import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/app/database/index";
import { AuthenticationService } from "@/app/services/authentication-service";

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Get JWT from HttpOnly cookie
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify JWT and get authenticated user ID
    const userId = AuthenticationService.verifyJWTToken(token);

    // 3️⃣ Parse request
    const body = await request.json();
    const { conversation, sessionId } = body;

    if (
      !conversation ||
      !Array.isArray(conversation) ||
      !sessionId
    ) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    console.log("Received conversation:", conversation);

    // 4️⃣ Verify that the interview belongs to this user
    const interview = await prisma.interview.findFirst({
      where: {
        sessionId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!interview) {
      return NextResponse.json(
        {
          error:
            "Interview session not found or unauthorized",
        },
        { status: 404 }
      );
    }

    // 5️⃣ Send conversation to AI service
    const aiResponse = await axios.post(
      `${process.env.AI_BASE_URL}/analyze-responses`,
      {
        conversation,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const result = aiResponse.data;

    // 6️⃣ Save analysis
    await prisma.interview.update({
      where: {
        id: interview.id,
      },
      data: {
        analysis: result,
        interviewOpen: false,
      },
    });

    // 7️⃣ Return analysis
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error(
      "Error analyzing conversation:",
      error
    );

    // Invalid/expired JWT
    if (
      error instanceof Error &&
      error.message === "Invalid or expired token"
    ) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to analyze conversation",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}