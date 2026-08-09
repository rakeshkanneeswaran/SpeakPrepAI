import OpenAIService from "@/app/services/openai-service";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "No file uploaded",
                    error: "FILE_NOT_FOUND",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const result = await OpenAIService.transcribeAudio(file);
        console.log("[Transcription API Result]", result);

        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" },
            status: result.success ? 200 : 500,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("[Transcription API Error]", error.message);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal Server Error",
                error: error.message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
