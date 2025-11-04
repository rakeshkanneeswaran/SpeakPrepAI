import { prisma } from "../database/index";
import AIService from "./ai-service";

export class InterviewService {
    // Create a new interview session for a user
    static async createInterviewSession(
        userId: string,
        resumeData: string,
        jobDescription: string
    ) {
        const response = await AIService.getInterviewQuestions({ jobDescription, resumeData });

        const interviewSession = await prisma.interview.create({
            data: {
                userId,
                resumeData,
                jobDescription,
                questions: response.questions,
            },
        });

        return {
            interviewSessionId: interviewSession.sessionId,
            questions: interviewSession.questions,
        };
    }

    // Fetch all interviews for a user
    static async getAllInterviewsForUser(userId: string) {
        return prisma.interview.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: {
                sessionId: true,
                createdAt: true,
            },
        });
    }

    // Save AI-generated analysis to an existing interview
    static async saveInterviewAnalysis(interviewSessionId: string, analysisData: string) {
        const interview = await prisma.interview.findFirst({
            where: { sessionId: interviewSessionId },
        });
        if (!interview) {
            throw new Error("Interview session not found");
        }
        return prisma.interview.update({
            where: { id: interview.id },
            data: { analysis: analysisData },
        });
    }
}
