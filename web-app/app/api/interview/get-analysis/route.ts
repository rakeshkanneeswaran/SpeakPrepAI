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
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }
        const { interviewSessionId } = await req.json();
        const interviewAnalysis = await InterviewService.getInterviewAnalysis(interviewSessionId);

        return new Response(
            JSON.stringify({
                message: "Analysis retrieved successfully",
                analysis: interviewAnalysis.analysis,
                createdAt: interviewAnalysis.createdAt
            }),
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
