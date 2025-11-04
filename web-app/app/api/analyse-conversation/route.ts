import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthenticationService } from "@/app/services/authentication-service";
import AIService from "@/app/services/ai-service";

export async function POST(req: Request) {
    try {

        const token = (await cookies()).get("auth_token")?.value;
        if (!token) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }
        // const userId = AuthenticationService.verifyJWTToken(token);
        // Parse the JSON body
        const body = await req.json();
        const { conversation } = body;

        if (!conversation || !Array.isArray(conversation)) {
            return NextResponse.json(
                { error: "Invalid input. Expected { conversation: [ [question, answer], ... ] }" },
                { status: 400 }
            );
        }

        console.log("Received conversation:", conversation);

        // 🧠 Here you would run your AI analysis logic, or call OpenAI API, etc.
        // For demo, we’ll just simulate it:
        const aiResponse = await AIService.analyzeConversation({ conversation });



        // Simulate some processing delay (optional)
        await new Promise((res) => setTimeout(res, 1000));

        return NextResponse.json(aiResponse);
    } catch (error) {
        console.error("Error analyzing conversation:", error);
        return NextResponse.json(
            { error: "Failed to analyze conversation" },
            { status: 500 }
        );
    }
}
