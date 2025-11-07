import GroqService from "@/app/services/groq-service";
import { cookies } from "next/headers";
import { AuthenticationService } from "@/app/services/authentication-service";

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        // Verify JWT and extract user ID
        const userId = AuthenticationService.verifyJWTToken(token);
        if (!userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "No file uploaded",
                    error: "FILE_NOT_FOUND",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const result = await GroqService.transcribeAudio(file, userId);

        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" },
            status: result.success ? 200 : 500,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("[Transcription API Error]", error.message);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal Server Error",
                error: error.message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
