import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/database/index";
import { AuthenticationService } from "@/app/services/authentication-service";

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

    // 2️⃣ Verify JWT and get user ID
    const userId = AuthenticationService.verifyJWTToken(token);

    // 3️⃣ Parse request data
    const { interviewSessionId } = await request.json();

    if (!interviewSessionId) {
      return NextResponse.json(
        { message: "Missing interviewSessionId" },
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

    // 5️⃣ Delete interview
    await prisma.interview.delete({
      where: {
        id: interview.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Interview session deleted successfully",
    });

  } catch (err) {
    console.error(
      "Error in interview deletion API:",
      err
    );

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
        message: "Failed to delete interview session",
        error:
          err instanceof Error
            ? err.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}