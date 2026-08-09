import { NextRequest, NextResponse } from "next/server";
import { AuthenticationService } from "@/app/services/authentication-service";
import { prisma } from "@/app/database/index";

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

    // 2️⃣ Verify JWT and get authenticated user ID
    const userId = AuthenticationService.verifyJWTToken(token);

    // 3️⃣ Parse request
    const { interviewSessionId, analysis } = await request.json();

    if (!interviewSessionId || !analysis) {
      return NextResponse.json(
        {
          message: "Missing interviewSessionId or analysis",
        },
        { status: 400 }
      );
    }

    // 4️⃣ Verify ownership
    const interview = await prisma.interview.findFirst({
      where: {
        sessionId: interviewSessionId,
        userId,
      },
    });

    if (!interview) {
      return NextResponse.json(
        {
          message:
            "Interview session not found or unauthorized",
        },
        { status: 404 }
      );
    }

    // 5️⃣ Save analysis
    await prisma.interview.update({
      where: {
        id: interview.id,
      },
      data: {
        analysis,
        interviewOpen: false,
      },
    });

    return NextResponse.json({
      message: "Analysis saved successfully",
    });
  } catch (err) {
    console.error("Error saving analysis:", err);

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
        message: "Unable to save analysis",
        error:
          err instanceof Error
            ? err.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}