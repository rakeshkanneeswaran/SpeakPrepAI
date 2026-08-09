import { NextRequest, NextResponse } from "next/server";
import {AuthenticationService} from "@/app/services/authentication-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and password are required",
        },
        { status: 400 }
      );
    }

    // Register user
    const result = await AuthenticationService.registerUser(
      name,
      email,
      password
    );

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: result.user,
      },
      { status: 201 }
    );

    // Store JWT inside an HttpOnly cookie
    response.cookies.set("auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 10, // 10 days
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Registration failed";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 }
    );
  }
}