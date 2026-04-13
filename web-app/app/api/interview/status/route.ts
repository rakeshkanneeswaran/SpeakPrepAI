import { auth } from "@/auth";
import { prisma } from "@/app/database/index";

export async function POST(req: Request) {
    try {
        // 1️⃣ Auth
        const session = await auth();

        if (!session || !session.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 2️⃣ Extract inputs
        const { interviewSessionId } = await req.json();

        if (!interviewSessionId) {
            return Response.json({ message: "Missing interviewSessionId" }, { status: 400 });
        }

        // 3️⃣ Fetch status directly from DB
        const interview = await prisma.interview.findFirst({
            where: { sessionId: interviewSessionId },
            select: { interviewOpen: true },
        });

        if (!interview) {
            return Response.json({ message: "Interview session not found" }, { status: 404 });
        }

        // 4️⃣ Return status
        return Response.json({
            message: "Interview status fetched successfully",
            interviewActive: { interviewOpen: interview.interviewOpen },
        });

    } catch (err) {
        console.error("Error in interview status API:", err);

        return Response.json(
            {
                message: "Unable to fetch interview status",
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}