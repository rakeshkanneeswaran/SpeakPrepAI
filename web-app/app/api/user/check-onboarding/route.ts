import { auth } from "@/auth"
import { UserService } from "@/app/services/user-service"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // 1️⃣ Get session using NextAuth
        const session = await auth()

        if (!session || !session.user?.id) {
            return NextResponse.json(
                {
                    isOnboarded: false,
                    message: "Not authenticated"
                },
                { status: 401 }
            )
        }

        const userId = session.user.id

        // 2️⃣ Fetch user onboarding status
        const user = await UserService.getUserOnboardingStatus(userId)

        if (!user) {
            return NextResponse.json(
                {
                    isOnboarded: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }

        const isOnboarded = user.onboarded

        return NextResponse.json({
            isOnboarded,
            message: isOnboarded
                ? "User is onboarded"
                : "User needs onboarding"
        })
    }
    catch (error) {
        console.error("Error checking onboarding status:", error)

        return NextResponse.json(
            {
                isOnboarded: false,
                message: "Internal server error"
            },
            { status: 500 }
        )
    }
}
