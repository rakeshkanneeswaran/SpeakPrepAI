/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import OpenAI from "openai";


export interface ServiceResponse {
    success: boolean;
    message: string;
    error: string;
    data: string;
}

export default class OpenAIService {

    static async transcribeAudio(
        file: File,
    ): Promise<ServiceResponse> {
        console.log("[Transcription] Start...");

        try {
            if (!file) {
                return {
                    success: false,
                    message: "No audio file received",
                    error: "FILE_NOT_FOUND",
                    data: "",
                };
            }

            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            // ✅ Convert File → Buffer → File (OpenAI compatible)
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const transcription = await openai.audio.transcriptions.create({
                file: new File([buffer], file.name, { type: file.type }),
                model: "gpt-4o-transcribe", // 🔥 or gpt-4o-mini-transcribe
                // response_format: "text", // optional
            });

            console.log("[Transcription ✅]");

            return {
                success: true,
                message: "Transcription completed",
                error: "",
                data: transcription.text || "",
            };

        } catch (err: any) {
            console.error("[Transcription ❌]", err.message);

            return {
                success: false,
                message: "Transcription failed",
                error: err.message,
                data: "",
            };
        }
    }

    static async createAudioBufferFromText(
        text: string,
    ): Promise<Buffer> {
        console.log("[TTS] Start...");

        try {
            if (!text.trim()) {
                throw new Error("Input text is empty");
            }

            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            const response = await openai.audio.speech.create({
                model: "gpt-4o-mini-tts", // ✅ latest model
                voice: "coral",           // 🔥 try "marin" or "cedar" later
                input: text,
                response_format: "wav",   // keep wav for browser playback
                instructions: "Speak clearly and professionally.",
            });

            const buffer = Buffer.from(await response.arrayBuffer());

            console.log("[TTS ✅] Audio generated");

            return buffer;

        } catch (err: any) {
            console.error("[TTS ❌]", err.message);
            throw new Error(`TTS failed: ${err.message}`);
        }
    }

}

