import { NextRequest, NextResponse } from "next/server";
import { AuthenticationService } from "@/app/services/authentication-service";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Get JWT from HttpOnly cookie
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify JWT
    const userId = AuthenticationService.verifyJWTToken(token);

    // We don't currently need userId here because the AI service
    // identifies the interview using sessionId.
    void userId;

    // 3️⃣ Parse request
    const { sessionId, userAnswer } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { message: "Missing sessionId" },
        { status: 400 }
      );
    }

    // 4️⃣ Forward request to AI service
    const aiResponse = await axios.post(
      `${process.env.AI_BASE_URL}/interview/run/${sessionId}`,
      {
        userAnswer: userAnswer || null,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    // 5️⃣ Return AI response to browser
    return NextResponse.json(aiResponse.data);
  } catch (err) {
    console.error("Error running interview:", err);

    // Invalid/expired JWT
    if (
      err instanceof Error &&
      err.message === "Invalid or expired token"
    ) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to run interview",
        error:
          err instanceof Error
            ? err.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}