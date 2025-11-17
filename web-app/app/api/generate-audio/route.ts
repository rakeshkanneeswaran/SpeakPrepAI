import { auth } from "@/auth"
import GroqService from "@/app/services/groq-service"

// POST /api/tts
// Converts text to speech and returns the audio as a WAV stream.
export async function POST(req: Request) {
    try {
        // 1️⃣ Get current session
        const session = await auth()

        if (!session || !session.user?.id) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            })
        }

        const userId = session.user.id

        // 2️⃣ Parse incoming text
        const { text } = await req.json()

        if (!text) {
            return new Response(
                JSON.stringify({ message: "Text is required" }),
                { status: 400 }
            )
        }

        // 3️⃣ Generate audio buffer for this user
        const audioBuffer = await GroqService.createAudioBufferFromText(text, userId)

        // 4️⃣ Return WAV audio stream
        return new Response(audioBuffer, {
            headers: {
                "Content-Type": "audio/wav",
            },
        })
    } catch (error) {
        console.error("TTS Error:", error)

        return new Response(
            JSON.stringify({
                message: "Internal Server Error",
                error: error instanceof Error ? error.message : String(error)
            }),
            { status: 500 }
        )
    }
}
