import { auth } from "@/auth"
import { InterviewService } from "@/app/services/interview-service"

// GET /api/tts
// Returns all interviews for the authenticated user
export async function GET(req: Request) {
    try {
        // 1️⃣ Auth — get session using NextAuth
        const session = await auth()

        if (!session || !session.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id

        // 2️⃣ Fetch interviews for this user
        const allInterviews = await InterviewService.getAllInterviewsForUser(userId)

        return Response.json({ interviews: allInterviews })
    }
    catch (error: unknown) {
        console.error("[GET Interviews Error]", error)

        const message =
            error instanceof Error
                ? error.message
                : typeof error === "string"
                    ? error
                    : "Unknown error"

        return Response.json(
            { message: "Internal Server Error", error: message },
            { status: 500 }
        )
    }
}
