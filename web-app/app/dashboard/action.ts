"use server";
import { PdfReader } from "pdfreader";

export async function getPdfContent(base64: string): Promise<string> {
    const fileBuffer = Buffer.from(base64, "base64");
    let content = "";

    await new Promise((resolve, reject) => {
        new PdfReader().parseBuffer(fileBuffer, (err, item) => {
            if (err) reject(err);
            else if (!item) resolve(true);
            else if (item.text) content += item.text + "\n";

        });
    });
    console.log("Extracted PDF Content:", content);

    return content;
}
