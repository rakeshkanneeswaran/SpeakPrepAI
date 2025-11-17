import { auth } from "@/auth";
import { InterviewService } from "@/app/services/interview-service";

export async function POST(req: Request) {
    try {
        // 1️⃣ Validate the user using NextAuth
        const session = await auth();

        if (!session || !session.user?.id) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // 2️⃣ Extract request body
        const { jobDescription, resumeData } = await req.json();

        if (!jobDescription || !resumeData) {
            return new Response(
                JSON.stringify({
                    message: "Job description and resume data are required"
                }),
                { status: 400 }
            );
        }

        // 3️⃣ Create the interview session
        const createInterviewSession =
            await InterviewService.createInterviewSession(
                userId,
                resumeData,
                jobDescription
            );

        const interviewSessionId = createInterviewSession.interviewSessionId;

        // 4️⃣ Respond to frontend
        return new Response(
            JSON.stringify({ interviewSessionId }),
            { status: 200 }
        );
    } catch (err) {
        console.error("Error in interview creation API:", err);

        return new Response(
            JSON.stringify({
                message: "Failed to create interview session",
                error: err instanceof Error ? err.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}
