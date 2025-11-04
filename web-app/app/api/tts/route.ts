import { NextResponse } from "next/server";
import GroqService from "@/app/services/groq-service";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const fileName = `tts-${randomUUID()}.wav`;
        const outputFilePath = path.resolve(`/tmp/${fileName}`);
        const result = await GroqService.createAudioFromText(text, outputFilePath);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        const audioBuffer = await fs.promises.readFile(outputFilePath);

        // Return audio as base64
        const base64Audio = audioBuffer.toString("base64");

        return NextResponse.json({ audio: base64Audio });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("TTS API Error:", message);
        return NextResponse.json({ error: "TTS failed" }, { status: 500 });
    }
}
