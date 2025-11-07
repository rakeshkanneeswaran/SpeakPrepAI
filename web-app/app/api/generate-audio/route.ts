import GroqService from "@/app/services/groq-service";
import { AuthenticationService } from "@/app/services/authentication-service";
import { cookies } from "next/headers";

// POST /api/tts
// Converts text to speech and returns the audio as a WAV stream.
export async function POST(req: Request) {
    try {
        // Retrieve auth token from cookies
        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        // Verify JWT and extract user ID
        const userId = AuthenticationService.verifyJWTToken(token);
        if (!userId) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        // Parse incoming text from request body
        const { text } = await req.json();

        // Generate audio buffer from text (TTS)
        const audioBuffer = await GroqService.createAudioBufferFromText(text, userId);

        // Send audio stream to the frontend
        return new Response(audioBuffer, {
            headers: {
                "Content-Type": "audio/wav",
            },
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error";
        console.error("[TTS Error]", message);
        return new Response(
            JSON.stringify({ message: "Internal Server Error", error: message }),
            { status: 500 }
        );
    }
}
