import { auth } from "@/auth"
import { UserService } from "@/app/services/user-service"

export async function POST(req: Request) {
    try {
        // 1️⃣ Authenticate user via NextAuth
        const session = await auth()

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            )
        }

        const userId = session.user.id

        // 2️⃣ Parse request body
        const body = await req.json()
        const { apiKey, role } = body

        // 3️⃣ Default values & derived values
        const apiChoice = body.apiChoice || "own"
        const platformedManagedAPIKey = apiChoice === "managed"

        // 4️⃣ Update user profile
        const status = await UserService.createUserProfile(
            userId,
            apiChoice,
            apiKey,
            role,
            platformedManagedAPIKey
        )

        // 5️⃣ Success response
        return new Response(JSON.stringify(status), { status: 200 })

    } catch (err) {
        console.error("❌ ERROR in /api/onboard:", err)

        if (err instanceof Error) {
            return new Response(
                JSON.stringify({
                    message: "Unable to register user",
                    error: err.message
                }),
                { status: 400 }
            )
        }

        return new Response(
            JSON.stringify({ error: "Unknown error" }),
            { status: 400 }
        )
    }
}
