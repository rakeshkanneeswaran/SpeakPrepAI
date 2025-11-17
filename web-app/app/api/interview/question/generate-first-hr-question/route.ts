import { auth } from "@/auth";
import { InterviewService } from "@/app/services/interview-service";

export async function POST(req: Request) {
    try {
        // 1️⃣ Get authenticated user via NextAuth
        const session = await auth();

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }
        // 2️⃣ Parse request body
        const { interviewSessionId } = await req.json();

        // 3️⃣ Fetch first HR question
        const firstHRQuestionResponse =
            await InterviewService.getFirstHRQuestionFromAI(interviewSessionId);

        // 4️⃣ Respond
        return new Response(
            JSON.stringify(firstHRQuestionResponse),
            { status: 200 }
        );

    } catch (err) {
        console.error("Error in generate-first-hr-question:", err);

        return new Response(
            JSON.stringify({
                message: "Unable to generate HR question",
                error: err instanceof Error ? err.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}
