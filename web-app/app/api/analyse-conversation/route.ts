import { NextResponse } from "next/server";
import { auth } from "@/auth";
import axios from "axios";
import { prisma } from "@/app/database/index";

export async function POST(req: Request) {
    try {
        // 1️⃣ Auth check
        const session = await auth();

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { conversation, sessionId } = body;

        if (!conversation || !Array.isArray(conversation) || !sessionId) {
            return NextResponse.json(
                { error: "Invalid input" },
                { status: 400 }
            );
        }

        console.log("Received conversation:", conversation);

        // 2️⃣ Direct AI call
        const aiResponse = await axios.post(
            `${process.env.AI_BASE_URL}/analyze-responses`,
            { conversation },
            {
                headers: {
                    Authorization: `Bearer ${process.env.AI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 30000,
            }
        );

        const result = aiResponse.data;

        // 3️⃣ Find the interview record directly
        const interview = await prisma.interview.findFirst({
            where: { sessionId },
        });

        if (!interview) {
            return NextResponse.json(
                { error: "Interview session not found" },
                { status: 404 }
            );
        }

        // 4️⃣ Save analysis directly to DB
        const updatedInterview = await prisma.interview.update({
            where: { id: interview.id },
            data: {
                analysis: result,
                interviewOpen: false,
            },
        });

        if (!updatedInterview) {
            return NextResponse.json(
                { error: "Failed to save interview analysis" },
                { status: 500 }
            );
        }

        return NextResponse.json(result);

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error analyzing conversation:", error instanceof Error ? error : errorMessage);

        return NextResponse.json(
            { error: "Failed to analyze conversation" },
            { status: 500 }
        );
    }
}