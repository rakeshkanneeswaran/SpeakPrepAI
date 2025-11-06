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
        if (!userId) {
            return new Response(
                JSON.stringify({ message: "Invalid token" }),
                { status: 401 }
            );
        }
        const { interviewSessionId, user_answer } = await req.json();
        const firstQuestionResponse = await InterviewService.getContinuedQuestionFromAI({
            sessionId: interviewSessionId,
            userAnswer: user_answer
        });
        return new Response(
            JSON.stringify(firstQuestionResponse),
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
