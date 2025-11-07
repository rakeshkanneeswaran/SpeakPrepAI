import { prisma } from "../database/index";
import AIService from "./ai-service";

export class InterviewService {
    // Create a new interview session for a user
    static async createInterviewSession(
        userId: string,
        resumeData: string,
        jobDescription: string
    ) {
        let interviewSession;

        try {
            // First create the interview session in database
            interviewSession = await prisma.interview.create({
                data: {
                    userId,
                    resumeData,
                    jobDescription,
                    questions: [],
                },
            });

            // Then call AI service to register the session
            const response = await AIService.createInterviewSession({
                jobDescription,
                resumeData,
                session_id: interviewSession.sessionId,
            });

            console.log("Create interview session response from ai", response);

            // If AI service returns invalid response, throw error to trigger catch block
            if (!response || !response.sessionId) {
                throw new Error("AI service returned invalid response - no sessionId");
            }

            return {
                interviewSessionId: response.sessionId,
            };

        } catch (error) {
            console.error("Error in createInterviewSession:", error);

            // If database record was created but AI service failed, delete the record
            if (interviewSession) {
                console.log("Cleaning up database record due to AI service failure...");
                try {
                    await prisma.interview.delete({
                        where: { id: interviewSession.id },
                    });
                    console.log("Database record deleted successfully");
                } catch (deleteError) {
                    console.error("Failed to delete database record:", deleteError);
                }
            }

            throw error; // Re-throw the original error
        }
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

    static async getFirstQuestionFromAI(sessionId: string): Promise<{ status: string; question: string; interview_end: boolean }> {
        return AIService.getFirstQuestion(sessionId);
    }

    static async getContinuedQuestionFromAI({ sessionId, userAnswer }: { sessionId: string, userAnswer: string }): Promise<{ status: string; question: string; interview_end: boolean }> {
        return AIService.getContinuedQuestion(sessionId, userAnswer);
    }

    static async getInterviewAnalysis(interviewSessionId: string) {
        const interview = await prisma.interview.findFirst({
            where: { sessionId: interviewSessionId },
        });
        if (!interview) {
            throw new Error("Interview session not found");
        }
        return {
            analysis: interview.analysis,
            createdAt: interview.createdAt
        }
    }

    static async deleteInterviewSession(interviewSessionId: string, userId: string) {
        console.log("Deleting interview session:", interviewSessionId, "for user:", userId);
        const interview = await prisma.interview.findFirst({
            where: { sessionId: interviewSessionId, userId: userId },
        });

        console.log("deleting", interview)
        if (!interview) {
            throw new Error("Interview session not found or unauthorized");
        }
        return prisma.interview.delete({
            where: { id: interview.id },
        });
    }

}