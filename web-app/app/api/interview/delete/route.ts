import { AuthenticationService } from "@/app/services/authentication-service";
import { cookies } from "next/headers";
import { InterviewService } from "@/app/services/interview-service";

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }
        const userId = AuthenticationService.verifyJWTToken(token);
        if (!userId) {
            return new Response(
                JSON.stringify({ message: "Invalid token" }),
                { status: 401 }
            );
        }

        const { interviewSessionId } = await req.json();

        await InterviewService.deleteInterviewSession(interviewSessionId, userId);
        return new Response(
            JSON.stringify({ message: "Interview session deleted successfully" }),
            { status: 200 }
        );


    } catch (err) {
        console.error("Error in interview deletion API:", err);

        if (err instanceof Error) {
            return new Response(
                JSON.stringify({
                    message: "Failed to delete interview session",
                    error: err.message
                }),
                { status: 500 }
            );
        }

        return new Response(
            JSON.stringify({ error: "Unknown error occurred" }),
            { status: 500 }
        );
    }
}