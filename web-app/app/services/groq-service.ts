/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import Groq from "groq-sdk";
import { UserService } from "./user-service";

export interface ServiceResponse {
    success: boolean;
    message: string;
    error: string;
    data: string;
}

export default class GroqService {

    static async createGroqClient(userId: string): Promise<Groq> {
        const userSettings = await UserService.getUserSettings(userId);

        if (userSettings && userSettings.apiKey) {
            return new Groq({
                apiKey: userSettings.apiKey,
            });
        }
        else {
            throw new Error("User API key not found");
        }
    }

    static async transcribeAudio(file: File, userId: string): Promise<ServiceResponse> {
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

            const groq = await this.createGroqClient(userId);

            // Directly send the File (Blob) to Groq
            const transcription = await groq.audio.transcriptions.create({
                file, // 👈 No need for fs.createReadStream anymore
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

    static async createAudioBufferFromText(text: string, userId: string): Promise<Buffer<ArrayBuffer>> {
        console.log("[TTS] Start...");

        try {
            if (!text.trim()) {
                throw new Error("Input text is empty");
            }
            const groq = await this.createGroqClient(userId);
            const response = await groq.audio.speech.create({
                model: "playai-tts",
                voice: "Mitch-PlayAI",
                input: text,
                response_format: "wav",
            });

            const buffer = Buffer.from(await response.arrayBuffer());

            return buffer

        } catch (err: any) {
            console.error("[TTS ❌]", err.message);

            throw new Error(`TTS failed: ${err.message}`);
        }
    }
}

