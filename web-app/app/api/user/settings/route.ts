import { AuthenticationService } from "@/app/services/authentication-service";
import { UserService } from "@/app/services/user-service";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
    try {
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const userId = AuthenticationService.verifyJWTToken(token);
        if (!userId) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
        }

        const userProfile = await UserService.getUserProfile(userId);

        return new Response(JSON.stringify(userProfile), { status: 200 });

    } catch (error) {
        console.error("Error fetching user settings:", error);

        if (error instanceof Error) {
            if (error.message === "User not found") {
                return new Response(JSON.stringify({ message: error.message }), { status: 404 });
            }
            return new Response(JSON.stringify({ message: error.message }), { status: 400 });
        }

        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const userId = AuthenticationService.verifyJWTToken(token);
        if (!userId) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
        }

        const { name, email, apiKey, apiChoice, role } = await request.json();

        const updatedProfile = await UserService.updateUserProfile(userId, {
            name,
            email,
            apiKey,
            apiChoice,
            role
        });

        return new Response(
            JSON.stringify({
                message: "Settings updated successfully",
                data: updatedProfile
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating user settings:", error);

        if (error instanceof Error) {
            return new Response(JSON.stringify({ message: error.message }), { status: 400 });
        }

        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}