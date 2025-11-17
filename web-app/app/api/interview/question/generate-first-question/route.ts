import { auth } from "@/auth";
import { InterviewService } from "@/app/services/interview-service";

export async function POST(req: Request) {
    try {
        // 1️⃣ Get NextAuth session
        const session = await auth();

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }

        // 2️⃣ Extract request body
        const { interviewSessionId } = await req.json();

        // 3️⃣ Generate first question
        const firstQuestionResponse =
            await InterviewService.getFirstQuestionFromAI(interviewSessionId);

        // 4️⃣ Send response
        return new Response(
            JSON.stringify(firstQuestionResponse),
            { status: 200 }
        );

    } catch (err) {
        console.error("Error in generate-first-question:", err);

        return new Response(
            JSON.stringify({
                message: "Failed to generate question",
                error: err instanceof Error ? err.message : "Unknown error"
            }),
            { status: 500 }
        );
    }
}
