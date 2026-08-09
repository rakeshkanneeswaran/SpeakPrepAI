import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/database/index";
import { AuthenticationService } from "@/app/services/authentication-service";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Get JWT from HttpOnly cookie
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify JWT and get user ID
    const userId = AuthenticationService.verifyJWTToken(token);

    // 3️⃣ Parse request
    const { jobDescription, resumeData } = await request.json();

    if (!jobDescription || !resumeData) {
      return NextResponse.json(
        {
          message: "Job description and resume data are required",
        },
        { status: 400 }
      );
    }

    // 4️⃣ Create interview record in DB
    const interviewSession = await prisma.interview.create({
      data: {
        userId,
        resumeData,
        jobDescription,
        questions: [],
      },
    });

    // 5️⃣ Register session with AI service
    let aiResponse;

    try {
      aiResponse = await axios.post(
        `${process.env.AI_BASE_URL}/register-session`,
        {
          job_description: jobDescription,
          candidate_details: resumeData,
          session_id: interviewSession.sessionId,
          candidate_name: userId,
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
      // AI call failed → rollback DB record
      console.error(
        "AI service failed, rolling back DB record:",
        aiError
      );

      await prisma.interview.delete({
        where: { id: interviewSession.id },
      });

      throw aiError;
    }

    // 6️⃣ Validate AI response
    if (!aiResponse.data?.session_id) {
      console.error(
        "AI service returned invalid response, rolling back DB record"
      );

      await prisma.interview.delete({
        where: { id: interviewSession.id },
      });

      return NextResponse.json(
        {
          message: "AI service returned invalid response",
        },
        { status: 502 }
      );
    }

    // 7️⃣ Return session ID
    return NextResponse.json({
      interviewSessionId: aiResponse.data.session_id,
    });

  } catch (err) {
    console.error(
      "Error in interview creation API:",
      err
    );

    if (
      err instanceof Error &&
      err.message === "Invalid or expired token"
    ) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create interview session",
        error:
          err instanceof Error
            ? err.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}