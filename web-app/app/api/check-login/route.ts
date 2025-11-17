// app/api/check-login/route.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // 1️⃣ Get the session from NextAuth
        const session = await auth()

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            )
        }

        return NextResponse.json({
            authenticated: true,
            userId: session.user.id,
        })
    } catch (error) {
        console.error("Login check failed:", error)

        return NextResponse.json(
            { authenticated: false },
            { status: 500 }
        )
    }
}
