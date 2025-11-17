import { auth } from "@/auth"
import { InterviewService } from "@/app/services/interview-service"

export async function POST(req: Request) {
    try {
        // 1️⃣ Get authenticated user from NextAuth session
        const session = await auth()

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            )
        }

        const userId = session.user.id

        // 2️⃣ Parse request data
        const { interviewSessionId } = await req.json()

        if (!interviewSessionId) {
            return new Response(
                JSON.stringify({ message: "Missing interviewSessionId" }),
                { status: 400 }
            )
        }

        // 3️⃣ Delete interview for this user
        await InterviewService.deleteInterviewSession(interviewSessionId, userId)

        return new Response(
            JSON.stringify({ message: "Interview session deleted successfully" }),
            { status: 200 }
        )

    } catch (err) {
        console.error("Error in interview deletion API:", err)

        return new Response(
            JSON.stringify({
                message: "Failed to delete interview session",
                error: err instanceof Error ? err.message : "Unknown error"
            }),
            { status: 500 }
        )
    }
}
