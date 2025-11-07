import { AuthenticationService } from "@/app/services/authentication-service";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { email, password, name } = await req.json();

    try {
        // First check if email already exists
        const emailExists = await AuthenticationService.checkEmailExists(email);
        if (emailExists) {
            return new Response(
                JSON.stringify({
                    message: "Email already exists. Please use a different email or login."
                }),
                { status: 400 }
            );
        }

        const result = await AuthenticationService.registerUser(email, password, name);

        // ✅ set JWT as an HttpOnly cookie (just like login)
        const cookieStore = await cookies();
        cookieStore.set({
            name: "auth_token",
            value: result.token,
            httpOnly: true,      // not accessible by JS
            secure: process.env.NODE_ENV === "production", // secure in production
            sameSite: "strict",  // only same-domain requests
            path: "/",           // available across the site
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // ✅ send success response with redirect info
        return Response.json({
            status: "success",
            onboarded: false,
            redirectTo: "/onboarding" // Add redirect information
        });

    } catch (err) {
        console.error("Registration error:", err);

        if (err instanceof Error) {
            return new Response(
                JSON.stringify({ message: err.message || "Unable to register user" }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({ error: "Unknown error occurred during registration" }),
            { status: 500 }
        );
    }
}