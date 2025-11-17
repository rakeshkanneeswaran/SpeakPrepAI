import { auth } from "@/auth";
import { InterviewService } from "@/app/services/interview-service";

export async function POST(req: Request) {
    try {
        // 1️⃣ Get logged-in user from NextAuth
        const session = await auth();

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }

        // 2️⃣ Parse request
        const { interviewSessionId } = await req.json();

        if (!interviewSessionId) {
            return new Response(
                JSON.stringify({ message: "Missing interviewSessionId" }),
                { status: 400 }
            );
        }

        // 3️⃣ Fetch analysis — ensure user owns the interview
        const interviewAnalysis = await InterviewService.getInterviewAnalysis(
            interviewSessionId,
        );

        if (!interviewAnalysis) {
            return new Response(
                JSON.stringify({ message: "Interview not found or unauthorized" }),
                { status: 404 }
            );
        }

        // 4️⃣ Success response
        return new Response(
            JSON.stringify({
                message: "Analysis retrieved successfully",
                analysis: interviewAnalysis.analysis,
                createdAt: interviewAnalysis.createdAt,
            }),
            { status: 200 }
        );

    } catch (err) {
        console.error("Interview analysis error:", err);

        return new Response(
            JSON.stringify({
                message: "Server error",
                error: err instanceof Error ? err.message : "Unknown error"
            }),
            { status: 500 }
        );
    }
}
