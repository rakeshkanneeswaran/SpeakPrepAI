import { NextRequest, NextResponse } from "next/server";
import { AuthenticationService } from "@/app/services/authentication-service";
import OpenAIService from "@/app/services/openai-service";

// POST /api/generate-audio
// Converts text to speech and returns the audio as a WAV stream.
export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Get JWT from HttpOnly cookie
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify JWT
    AuthenticationService.verifyJWTToken(token);

    // 3️⃣ Parse incoming text
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { message: "Text is required" },
        { status: 400 }
      );
    }

    // 4️⃣ Generate audio
    const audioBuffer =
      await OpenAIService.createAudioBufferFromText(text);

    // 5️⃣ Return WAV audio
    return new Response(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);

    // Invalid/expired JWT
    if (
      error instanceof Error &&
      error.message === "Invalid or expired token"
    ) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to generate audio",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}