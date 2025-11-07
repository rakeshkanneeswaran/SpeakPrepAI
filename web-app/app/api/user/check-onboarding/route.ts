import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthenticationService } from "@/app/services/authentication-service";
import { UserService } from "@/app/services/user-service";

export async function GET() {
    try {
        const token = (await cookies()).get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    isOnboarded: false,
                    message: "Not authenticated"
                },
                { status: 401 }
            );
        }

        const userId = AuthenticationService.verifyJWTToken(token);

        if (!userId) {
            return NextResponse.json(
                {
                    isOnboarded: false,
                    message: "Invalid token"
                },
                { status: 401 }
            );
        }

        // Check if user exists and is onboarded
        const user = await UserService.getUserOnboardingStatus(userId);

        if (!user) {
            return NextResponse.json(
                {
                    isOnboarded: false,
                    message: "User not found"
                },
                { status: 404 }
            );
        }

        // Assuming your User model has an `isOnboarded` field
        // Adjust this based on your actual user model structure
        const isOnboarded = user.onboarded

        return NextResponse.json({
            isOnboarded,
            message: isOnboarded ? "User is onboarded" : "User needs onboarding"
        });

    } catch (error) {
        console.error("Error checking onboarding status:", error);

        return NextResponse.json(
            {
                isOnboarded: false,
                message: "Internal server error"
            },
            { status: 500 }
        );
    }
}