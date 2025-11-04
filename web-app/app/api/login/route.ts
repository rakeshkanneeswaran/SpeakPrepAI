import { AuthenticationService } from "@/app/services/authentication-service";
import { UserService } from "@/app/services/user-service";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    try {
        const result = await AuthenticationService.loginUser(email, password);
        const getUserOnboardingStatus = await UserService.getUserOnboardingStatus(result.user.id);
        // ✅ set JWT as an HttpOnly cookie
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

        // return only user info, not token (token is now in cookie)
        return Response.json({
            status: "success",
            onboarded: getUserOnboardingStatus.onboarded,
        });

    } catch (err) {
        if (err instanceof Error) {
            return new Response(JSON.stringify({ error: err.message }), { status: 400 });
        }
        return new Response(JSON.stringify({ error: "Unknown error" }), { status: 400 });
    }
}
