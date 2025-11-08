import { NextResponse } from "next/server";
import GroqService from "@/app/services/groq-service";

export async function POST(req: Request) {
    try {
        const { apiKey } = await req.json();

        if (!apiKey) {
            return NextResponse.json(
                { error: { message: "API key is required" } },
                { status: 400 }
            );
        }

        const validation = await GroqService.validateApiKey(apiKey);

        if (validation.valid) {
            return NextResponse.json({
                status: "valid",
                message: "API key is valid and TTS is working"
            });
        } else {
            return NextResponse.json(
                {
                    error: {
                        message: validation.error || "Invalid API key",
                        code: validation.code,
                        ...(validation.code === "model_terms_required" && {
                            url: "https://console.groq.com/playground?model=playai-tts"
                        })
                    }
                },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("API key validation error:", error);
        return NextResponse.json(
            { error: { message: "Failed to validate API key" } },
            { status: 500 }
        );
    }
}