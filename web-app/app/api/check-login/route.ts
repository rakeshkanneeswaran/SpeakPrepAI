import { NextRequest, NextResponse } from "next/server";
import { AuthenticationService } from "@/app/services/authentication-service";

export async function GET(request: NextRequest) {
  try {
    // Get the JWT from the HttpOnly cookie
    const token = request.cookies.get("auth_token")?.value;

    // User is not logged in
    if (!token) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        { status: 401 }
      );
    }

    // Verify JWT and retrieve the user
    const user = await AuthenticationService.getUserFromToken(token);

    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login check failed:", error);

    return NextResponse.json(
      {
        authenticated: false,
      },
      { status: 401 }
    );
  }
}