import { auth } from "@/auth";
import { prisma } from "@/app/database/index";

export async function POST(req: Request) {
    try {
        // 1️⃣ Auth
        const session = await auth();

        if (!session || !session.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // 2️⃣ Parse request
        const { interviewSessionId } = await req.json();

        if (!interviewSessionId) {
            return Response.json({ message: "Missing interviewSessionId" }, { status: 400 });
        }

        // 3️⃣ Fetch analysis — verify ownership in the same query
        const interview = await prisma.interview.findFirst({
            where: { sessionId: interviewSessionId, userId },
            select: {
                analysis: true,
                createdAt: true,
            },
        });

        if (!interview) {
            return Response.json(
                { message: "Interview not found or unauthorized" },
                { status: 404 }
            );
        }

        // 4️⃣ Success
        return Response.json({
            message: "Analysis retrieved successfully",
            analysis: interview.analysis,
            createdAt: interview.createdAt,
        });

    } catch (err) {
        console.error("Interview analysis error:", err);

        return Response.json(
            {
                message: "Server error",
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}