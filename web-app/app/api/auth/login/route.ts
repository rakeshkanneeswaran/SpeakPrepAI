import { NextRequest, NextResponse } from "next/server";
import { AuthenticationService } from "@/app/services/authentication-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Authenticate user
    const result = await AuthenticationService.loginUser(
      email,
      password
    );

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: result.user,
      },
      { status: 200 }
    );

    // Store JWT in HttpOnly cookie
    response.cookies.set("auth_token", result.token, {
      httpOnly: true,
secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 10,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Login failed";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 401 }
    );
  }
}