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

    // 3️⃣ Extract input
    const { interviewSessionId } = await request.json();

    if (!interviewSessionId) {
      return NextResponse.json(
        { message: "Missing interviewSessionId" },
        { status: 400 }
      );
    }

    // 4️⃣ Fetch interview belonging to this user
    const interview = await prisma.interview.findFirst({
      where: {
        sessionId: interviewSessionId,
        userId,
      },
      select: {
        interviewOpen: true,
      },
    });

    if (!interview) {
      return NextResponse.json(
        { message: "Interview session not found" },
        { status: 404 }
      );
    }

    // 5️⃣ Return status
    return NextResponse.json({
      message: "Interview status fetched successfully",
      interviewActive: {
        interviewOpen: interview.interviewOpen,
      },
    });
  } catch (err) {
    console.error("Error in interview status API:", err);

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
        message: "Unable to fetch interview status",
        error:
          err instanceof Error
            ? err.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}