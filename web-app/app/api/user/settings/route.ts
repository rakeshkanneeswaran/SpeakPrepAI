import { NextRequest, NextResponse } from "next/server";
import { AuthenticationService } from "@/app/services/authentication-service";
import { UserService } from "@/app/services/user-service";

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

    // Get user profile
    const profile = await UserService.getUserProfile(userId);

    return NextResponse.json(
      {
        user: profile,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[GET User Settings Error]", err);

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
        message:
          err instanceof Error
            ? err.message
            : "An error occurred",
      },
      { status: 500 }
    );
  }
}