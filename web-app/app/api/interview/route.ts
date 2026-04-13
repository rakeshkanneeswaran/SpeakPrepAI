import { auth } from "@/auth";
import { prisma } from "@/app/database/index";
import axios from "axios";

export async function POST(req: Request) {
    try {
        // 1️⃣ Auth
        const session = await auth();

        if (!session || !session.user?.id) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // 2️⃣ Parse request
        const { jobDescription, resumeData } = await req.json();

        if (!jobDescription || !resumeData) {
            return Response.json(
                { message: "Job description and resume data are required" },
                { status: 400 }
            );
        }

        // 3️⃣ Create interview record in DB first
        const interviewSession = await prisma.interview.create({
            data: {
                userId,
                resumeData,
                jobDescription,
                questions: [],
            },
        });

        // 4️⃣ Register session with AI service
        let aiResponse;
        try {
            aiResponse = await axios.post(
                `${process.env.AI_BASE_URL}/register-session`,
                {
                    job_description: jobDescription,
                    candidate_details: resumeData,
                    session_id: interviewSession.sessionId,
                    candidate_name: userId, // or extract from resumeData if available
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.AI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    timeout: 30000,
                }
            );
        } catch (aiError) {
            // AI call failed — rollback the DB record
            console.error("AI service failed, rolling back DB record:", aiError);
            await prisma.interview.delete({
                where: { id: interviewSession.id },
            });
            throw aiError;
        }

        if (!aiResponse.data?.session_id) {
            // AI returned invalid response — rollback
            console.error("AI service returned invalid response, rolling back DB record");
            await prisma.interview.delete({
                where: { id: interviewSession.id },
            });
            return Response.json(
                { message: "AI service returned invalid response" },
                { status: 502 }
            );
        }

        // 5️⃣ Deduct credit
        await prisma.userSettings.update({
            where: { userId },
            data: {
                credits: { decrement: 1 },
            },
        });

        return Response.json({ interviewSessionId: aiResponse.data.session_id });

    } catch (err) {
        console.error("Error in interview creation API:", err);

        return Response.json(
            {
                message: "Failed to create interview session",
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}