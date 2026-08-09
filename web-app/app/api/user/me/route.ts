import { NextRequest, NextResponse } from "next/server";
import { AuthenticationService } from "@/app/services/authentication-service";
import { UserService } from "@/app/services/user-service";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await AuthenticationService.getUserFromToken(token);

    const me = await UserService.getUserProfile(user.id);

    return NextResponse.json(
      {
        name: me.user.name,
        email: me.user.email,
        credits: me.settings?.credits ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to get current user:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "An error occurred",
      },
      { status: 401 }
    );
  }
}