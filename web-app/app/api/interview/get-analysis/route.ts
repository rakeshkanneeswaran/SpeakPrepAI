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
    const { interviewSessionId } = await request.json();

    if (!interviewSessionId) {
      return NextResponse.json(
        { message: "Missing interviewSessionId" },
        { status: 400 }
      );
    }

    // 4️⃣ Fetch analysis and verify ownership
    const interview = await prisma.interview.findFirst({
      where: {
        sessionId: interviewSessionId,
        userId,
      },
      select: {
        analysis: true,
        createdAt: true,
      },
    });

    if (!interview) {
      return NextResponse.json(
        {
          message: "Interview not found or unauthorized",
        },
        { status: 404 }
      );
    }

    // 5️⃣ Return analysis
    return NextResponse.json({
      message: "Analysis retrieved successfully",
      analysis: interview.analysis,
      createdAt: interview.createdAt,
    });
  } catch (err) {
    console.error("Interview analysis error:", err);

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
        message: "Server error",
        error:
          err instanceof Error
            ? err.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}