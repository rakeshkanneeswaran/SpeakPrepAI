import { auth } from "@/auth";
import { InterviewService } from "@/app/services/interview-service";

export async function POST(req: Request) {
    try {
        // 1️⃣ Validate authentication using NextAuth
        const session = await auth();

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }


        // 2️⃣ Extract inputs
        const { interviewSessionId } = await req.json();

        // 3️⃣ IMPORTANT: Validate user owns the session
        const interviewActive = await InterviewService.getInterviewStatus(
            interviewSessionId,
        );

        // 4️⃣ Return status
        return new Response(
            JSON.stringify({
                message: "Interview status fetched successfully",
                interviewActive
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error("Error in interview status API:", err);

        return new Response(
            JSON.stringify({
                message: "Unable to fetch interview status",
                error: err instanceof Error ? err.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}
