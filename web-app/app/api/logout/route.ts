import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        // ✅ ALWAYS create response that clears cookie
        const response = NextResponse.json({
            status: "success",
            message: "Logged out successfully",
        });

        // ✅ ALWAYS clear the cookie (whether token exists or not)
        response.cookies.set({
            name: "auth_token",
            value: "",
            path: "/",
            maxAge: 0, // expire immediately
        });

        // ✅ Simple logging (optional)
        console.log("Logout: Cookie cleared", token ? "token existed" : "no token found");

        return response;

    } catch (error) {
        console.error("Logout error:", error);

        // ✅ Even on error, clear cookie and return success
        const response = NextResponse.json({
            status: "success",
            message: "Logged out successfully",
        });

        response.cookies.set({
            name: "auth_token",
            value: "",
            path: "/",
            maxAge: 0,
        });

        return response;
    }
}