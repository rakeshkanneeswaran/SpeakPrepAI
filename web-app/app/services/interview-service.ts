import { prisma } from "../database/index";
import AIService from "./ai-service";

/**
 * Service layer for managing interview sessions.
 * 
 * The InterviewService handles the creation and retrieval of mock interview sessions
 * based on user data, job descriptions, and resumes. It uses Prisma as the ORM and
 * depends on an external question generation function to prepare the interview.
 */
export class InterviewService {

    /**
     * Creates a new interview session for a given user.
     * 
     * This method:
     * 1. Generates interview questions based on the user's resume and the job description.
     * 2. Persists a new Interview record in the database.
     * 3. Returns the unique session ID for client-side reference.
     *
     * @param userId - The unique identifier of the user creating the interview session.
     * @param resumeData - The user’s resume text or parsed data string.
     * @param jobDescription - The job posting or description used to tailor questions.
     * 
     * @returns An object containing the generated `interviewSessionId` used to track the session.
     * 
     * @example
     * ```ts
     * const session = await InterviewService.createInterviewSession(
     *   "user_123",
     *   "Full Stack Developer with 3 years of experience...",
     *   "Looking for a React + Node.js engineer..."
     * );
     * console.log(session.interviewSessionId);
     * ```
     */
    static async createInterviewSession(
        userId: string,
        resumeData: string,
        jobDescription: string
    ) {
        // Step 1: Generate interview questions dynamically using AI or logic.
        const response = await AIService.getInterviewQuestions({ jobDescription, resumeData });

        // Step 2: Create a new interview record in the database.
        // Prisma automatically generates a unique `sessionId` via @default(cuid()) in the model.
        const interviewSession = await prisma.interview.create({
            data: {
                userId,
                resumeData,
                jobDescription,
                questions: response.questions,
            },
        });

        // Step 3: Return only the session identifier for frontend tracking.
        return {
            interviewSessionId: interviewSession.sessionId,
            questions: interviewSession.questions,
        };
    }

    static async getAllInterviewsForUser(userId: string) {
        const interviews = await prisma.interview.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: {
                sessionId: true,
                createdAt: true,
            }
        });
        return interviews;
    }

}
