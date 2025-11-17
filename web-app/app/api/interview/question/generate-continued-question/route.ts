import { auth } from "@/auth";
import { InterviewService } from "@/app/services/interview-service";

export async function POST(req: Request) {
    try {
        // 1️⃣ Get secure NextAuth session
        const session = await auth();

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }

        // 2️⃣ Parse request body
        const { interviewSessionId, user_answer } = await req.json();

        // 3️⃣ Fetch next AI question
        const firstQuestionResponse =
            await InterviewService.getContinuedQuestionFromAI({
                sessionId: interviewSessionId,
                userAnswer: user_answer,
            });

        // 4️⃣ Return result
        return new Response(
            JSON.stringify(firstQuestionResponse),
            { status: 200 }
        );

    } catch (err) {
        console.error("Error generating continued question:", err);

        return new Response(
            JSON.stringify({
                message: "Unable to generate question",
                error: err instanceof Error ? err.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}
