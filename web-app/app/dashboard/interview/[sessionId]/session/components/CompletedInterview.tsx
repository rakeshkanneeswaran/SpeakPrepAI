"use client";
import { useRouter } from "next/navigation";
import platformColors from "@/app/utils/colors";

interface CompletedInterviewProps {
  sessionId: string | string[] | undefined; // Add undefined to the type
  analysisResult: string | null;
}

export default function CompletedInterview({
  sessionId,
  analysisResult,
}: CompletedInterviewProps) {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: platformColors.mainBackground }}
    >
      <div className="text-center max-w-md p-8 rounded-lg border shadow-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-black mb-4">
          Interview Already Completed
        </h2>
        <p className="text-gray-600 mb-6">
          This interview session has already been completed. You can view the
          analysis results on your dashboard.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Go to Dashboard
          </button>
          {analysisResult && (
            <button
              onClick={() => {
                if (sessionId) {
                  router.push(`/dashboard/interview/${sessionId}/analysis`);
                }
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              View Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
