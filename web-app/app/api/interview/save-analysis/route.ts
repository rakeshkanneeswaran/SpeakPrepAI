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
        const { interviewSessionId, analysis } = await req.json();

        if (!interviewSessionId || !analysis) {
            return Response.json(
                { message: "Missing interviewSessionId or analysis" },
                { status: 400 }
            );
        }

        // 3️⃣ Verify ownership
        const interview = await prisma.interview.findFirst({
            where: { sessionId: interviewSessionId, userId },
        });

        if (!interview) {
            return Response.json(
                { message: "Interview session not found or unauthorized" },
                { status: 404 }
            );
        }

        // 4️⃣ Save analysis
        await prisma.interview.update({
            where: { id: interview.id },
            data: {
                analysis,
                interviewOpen: false,
            },
        });

        return Response.json({ message: "Analysis saved successfully" });

    } catch (err) {
        console.error("Error saving analysis:", err);

        return Response.json(
            {
                message: "Unable to save analysis",
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}