import { AuthenticationService } from "@/app/services/authentication-service";
import { on } from "events";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { email, password, name } = await req.json();

    try {
        const result = await AuthenticationService.registerUser(email, password, name);

        // ✅ set JWT as an HttpOnly cookie (just like login)
        const cookieStore = await cookies();
        cookieStore.set({
            name: "auth_token",
            value: result.token,
            httpOnly: true,      // not accessible by JS
            secure: false,        // only sent over HTTPS
            sameSite: "strict",  // only same-domain requests
            path: "/",           // available across the site
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        // ✅ send success response (no token exposed)
        return Response.json({
            status: "success",
            onboarded: false,
        });

    } catch (err) {
        if (err instanceof Error) {
            return new Response(
                JSON.stringify({ message: "Unable to register user" }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({ error: "Unknown error" }),
            { status: 400 }
        );
    }
}
