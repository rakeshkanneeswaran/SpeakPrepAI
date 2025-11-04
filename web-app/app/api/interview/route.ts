import { AuthenticationService } from "@/app/services/authentication-service";
import { UserService } from "@/app/services/user-service";
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

        // const { jobDescription, resumeData } = await req.json();

        // const status = await InterviewService.createInterviewSession(userId, jobDescription, resumeData);
        const fakeStatus = {
            interviewSessionId: "test-session-" + Math.random().toString(36).substring(2, 8),
            questions: [
                "Tell me about yourself.",
                "What are your strengths and weaknesses?",
                "Explain a project you worked on and the challenges you faced.",
                "How do you handle tight deadlines?",
                "Why do you want to work for this company?",
            ],
        };
        return new Response(
            JSON.stringify(fakeStatus),
            { status: 200 }
        );

    } catch (err) {
        if (err instanceof Error) {
            return new Response(
                JSON.stringify({ message: "Unable to register user" }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({ error: "Unknown error" }),
            { status: 400 }
        );
    }
}
