import { auth } from "@/auth"
import { prisma } from "@/app/database/index"

export async function POST(req: Request) {
    try {
        // 1️⃣ Auth
        const session = await auth()

        if (!session || !session.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id

        // 2️⃣ Parse request data
        const { interviewSessionId } = await req.json()

        if (!interviewSessionId) {
            return Response.json({ message: "Missing interviewSessionId" }, { status: 400 })
        }

        // 3️⃣ Verify ownership then delete
        const interview = await prisma.interview.findFirst({
            where: { sessionId: interviewSessionId, userId },
        })

        if (!interview) {
            return Response.json(
                { message: "Interview session not found or unauthorized" },
                { status: 404 }
            )
        }

        await prisma.interview.delete({
            where: { id: interview.id },
        })

        return Response.json({ message: "Interview session deleted successfully" })

    } catch (err) {
        console.error("Error in interview deletion API:", err)

        return Response.json(
            {
                message: "Failed to delete interview session",
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        )
    }
}