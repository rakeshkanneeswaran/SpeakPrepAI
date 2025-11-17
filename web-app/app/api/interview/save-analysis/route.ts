import { auth } from "@/auth";
import { InterviewService } from "@/app/services/interview-service";

export async function POST(req: Request) {
    try {
        // 1️⃣ Validate login using NextAuth session
        const session = await auth();

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }
        // 2️⃣ Read incoming data
        const { interviewSessionId, analysis } = await req.json();

        // 3️⃣ Save interview analysis (pass userId for ownership validation)
        await InterviewService.saveInterviewAnalysis(
            interviewSessionId,
            analysis
        );

        // 4️⃣ Respond success
        return new Response(
            JSON.stringify({ message: "Analysis saved successfully" }),
            { status: 200 }
        );

    } catch (err) {
        console.error("Error saving analysis:", err);

        return new Response(
            JSON.stringify({
                message: "Unable to save analysis",
                error: err instanceof Error ? err.message : "Unknown error"
            }),
            { status: 500 }
        );
    }
}
