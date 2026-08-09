import { NextRequest, NextResponse } from "next/server";
import { AuthenticationService } from "@/app/services/authentication-service";
import { prisma } from "@/app/database/index";

export async function GET(request: NextRequest) {
  try {
    // Get JWT from HttpOnly cookie
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify JWT and get user ID
    const userId = AuthenticationService.verifyJWTToken(token);

    // Get user's interviews
    const allInterviews = await prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        sessionId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      interviews: allInterviews,
    });
  } catch (error: unknown) {
    console.error("[GET Interviews Error]", error);

    if (
      error instanceof Error &&
      error.message === "Invalid or expired token"
    ) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unknown error";

    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: message,
      },
      { status: 500 }
    );
  }
}