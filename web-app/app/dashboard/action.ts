"use server";
import { PdfReader } from "pdfreader";
import { UserService } from "../services/user-service";

export async function getPdfContent(base64: string): Promise<string> {
    const fileBuffer = Buffer.from(base64, "base64");
    let raw = "";

    await new Promise((resolve, reject) => {
        new PdfReader().parseBuffer(fileBuffer, (err, item) => {
            if (err) reject(err);
            else if (!item) resolve(true);
            else if (item.text) raw += item.text + " ";
        });
    });

    // 🧹 Deep clean + normalize PDF artifacts
    const cleaned = raw
        .replace(/\s+/g, " ") // collapse multiple spaces
        .replace(/([A-Za-z])\s(?=[A-Za-z])/g, "$1") // remove spaces between letters of the same word
        .replace(/\s{2,}/g, " ") // collapse again just in case
        .replace(/\s*([.,:;!?])\s*/g, "$1 ") // tidy punctuation spacing
        .replace(/\s*\n\s*/g, "\n") // normalize newlines
        .trim();

    console.log("🧠 Extracted & Cleaned PDF Content (first 500 chars):\n", cleaned.slice(0, 500));

    return cleaned;
}

export async function getAvailableCredits(params: { userId: string }) {
    const availableCredits = await UserService.getAvailableCredits(params.userId);
    return availableCredits;
}
