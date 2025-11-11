import InterviewSession from "./components/InterviewSession";
import { Metadata } from "next";

interface InterviewSessionPageProps {
  params: {
    sessionId: string;
  };
  searchParams: {
    type?: string;
  };
}

// Since searchParams is a Promise, we need to make this an async function
export default async function InterviewSessionPage({
  params,
  searchParams,
}: InterviewSessionPageProps) {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;
  const interviewType = resolvedSearchParams.type || "technical";

  return <InterviewSession />;
}

// If you're using generateMetadata, it also needs to be async
export async function generateMetadata({
  params,
  searchParams,
}: InterviewSessionPageProps): Promise<Metadata> {
  // Await the searchParams promise here too
  const resolvedSearchParams = await searchParams;
  const interviewType = resolvedSearchParams.type || "technical";

  return {
    title: `${
      interviewType.charAt(0).toUpperCase() + interviewType.slice(1)
    } Interview - SpeakPrep AI`,
    description: `Practice ${interviewType} interview questions with AI feedback`,
  };
}

// Optional: Generate static params if needed
export async function generateStaticParams() {
  return [{ sessionId: "1" }, { sessionId: "2" }];
}
