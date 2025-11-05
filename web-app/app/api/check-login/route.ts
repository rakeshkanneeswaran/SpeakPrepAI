// app/api/check-login/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AuthenticationService } from "@/app/services/authentication-service";

export async function GET() {
    try {
        const token = (await cookies()).get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const userId = AuthenticationService.verifyJWTToken(token);
        if (!userId) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({ authenticated: true, userId });
    } catch (error) {
        console.error("Login check failed:", error);
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}
