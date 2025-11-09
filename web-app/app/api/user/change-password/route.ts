import { AuthenticationService } from "@/app/services/authentication-service";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const userId = AuthenticationService.verifyJWTToken(token);
        if (!userId) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
        }

        const { oldPassword, newPassword } = await req.json();

        if (!oldPassword || !newPassword) {
            return new Response(
                JSON.stringify({ message: "Old password and new password are required" }),
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return new Response(
                JSON.stringify({ message: "New password must be at least 6 characters long" }),
                { status: 400 }
            );
        }

        const result = await AuthenticationService.changePassword(userId, oldPassword, newPassword);

        return new Response(JSON.stringify(result), { status: 200 });

    } catch (error) {
        console.error("Error changing password:", error);

        if (error instanceof Error) {
            if (error.message === "User not found") {
                return new Response(JSON.stringify({ message: error.message }), { status: 404 });
            }
            if (error.message === "Current password is incorrect") {
                return new Response(JSON.stringify({ message: error.message }), { status: 400 });
            }
            return new Response(JSON.stringify({ message: error.message }), { status: 400 });
        }

        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}