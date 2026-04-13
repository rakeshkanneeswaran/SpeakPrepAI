import { auth } from "@/auth"
import { prisma } from "@/app/database/index"

export async function GET(req: Request) {
    try {
        const session = await auth()

        if (!session || !session.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const userId = session.user.id

        const allInterviews = await prisma.interview.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: {
                sessionId: true,
                createdAt: true,
            },
        })

        return Response.json({ interviews: allInterviews })

    } catch (error: unknown) {
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