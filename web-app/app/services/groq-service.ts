/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import fs from "fs";
import Groq from "groq-sdk";

export interface ServiceResponse {
    success: boolean;
    message: string;
    error: string;
    data: string;
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export default class GroqService {

    static async transcribeAudio(filePath: string): Promise<ServiceResponse> {
        console.log("[Transcription] Start...");

        try {
            if (!fs.existsSync(filePath)) {
                return {
                    success: false,
                    message: "Audio file not found",
                    error: "FILE_NOT_FOUND",
                    data: "",
                };
            }

            const transcription = await groq.audio.transcriptions.create({
                file: fs.createReadStream(filePath),
                model: "whisper-large-v3-turbo",
                response_format: "verbose_json",
                language: "en",
                temperature: 0.0,
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

    static async createAudioFromText(text: string, outputFilePath: string): Promise<ServiceResponse> {
        console.log("[TTS] Start...");

        try {
            if (!text.trim()) {
                return {
                    success: false,
                    message: "Text input empty",
                    error: "EMPTY_TEXT",
                    data: "",
                };
            }

            const response = await groq.audio.speech.create({
                model: "playai-tts",
                voice: "Fritz-PlayAI",
                input: text,
                response_format: "wav",
            });

            const buffer = Buffer.from(await response.arrayBuffer());
            await fs.promises.writeFile(outputFilePath, buffer);

            console.log("[TTS ✅] Saved:", outputFilePath);

            return {
                success: true,
                message: "Audio created successfully",
                error: "",
                data: outputFilePath,
            };

        } catch (err: any) {
            console.error("[TTS ❌]", err.message);

            return {
                success: false,
                message: "Failed to convert text to audio",
                error: err.message,
                data: "",
            };
        }
    }
}

// ✅ Example local test
(async () => {
    const result = await GroqService.createAudioFromText(
        "Hello there",
        "./output.wav"
    );
    console.log(result);
})();
