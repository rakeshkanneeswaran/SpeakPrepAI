import { auth } from "@/auth";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { sessionId, userAnswer } = await req.json();

        if (!sessionId) {
            return Response.json({ message: "Missing sessionId" }, { status: 400 });
        }

        const aiResponse = await axios.post(
            `${process.env.AI_BASE_URL}/interview/run/${sessionId}`,
            { userAnswer: userAnswer || null },
            {
                headers: {
                    Authorization: `Bearer ${process.env.AI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 30000,
            }
        );

        return Response.json(aiResponse.data);

    } catch (err) {
        console.error("Error running interview:", err);
        return Response.json(
            {
                message: "Failed to run interview",
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}