import { auth } from "@/auth";
import { InterviewService } from "@/app/services/interview-service";

export async function POST(req: Request) {
    try {
        // 1. Get session from NextAuth (secure + automatic)
        const session = await auth();

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // 2. Parse body
        const { interviewSessionId, user_answer } = await req.json();

        // 3. Call the AI logic
        const continuedHRQuestionResponse =
            await InterviewService.getContinuedHRQuestionFromAI({
                sessionId: interviewSessionId,
                userAnswer: user_answer,
            });

        // 4. Send response
        return new Response(
            JSON.stringify(continuedHRQuestionResponse),
            { status: 200 }
        );

    } catch (err) {
        console.error("Error in generate-continued-hr-question:", err);

        return new Response(
            JSON.stringify({
                message: "Unable to generate continued HR question",
                error: err instanceof Error ? err.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}
