import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthenticationService } from "@/app/services/authentication-service";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        // 🧩 Check if token exists
        if (!token) {
            return NextResponse.json(
                { status: "error", message: "Unauthorized — no token found" },
                { status: 401 }
            );
        }

        // 🧠 Verify JWT
        const userId = AuthenticationService.verifyJWTToken(token);
        if (!userId) {
            return NextResponse.json(
                { status: "error", message: "Invalid token" },
                { status: 401 }
            );
        }

        // ✅ If valid, clear cookie and logout
        const response = NextResponse.json({
            status: "success",
            message: "Logged out successfully",
        });

        response.cookies.set({
            name: "auth_token",
            value: "",
            path: "/",
            maxAge: 0, // expire immediately
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { status: "error", message: "Something went wrong" },
            { status: 500 }
        );
    }
}
