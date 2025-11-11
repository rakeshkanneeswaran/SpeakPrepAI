"use client";
import AnalysisResult from "./AnalysisResult";
import platformColors from "@/app/utils/colors";

interface AnalysisViewProps {
  isAnalyzing: boolean;
  analysisError: string | null;
  analysisResult: string | null;
  interviewType: string;
  saveInterviewAnalysis: () => void;
  analyzeConversation: () => void;
  getAccentColor: (
    type?: "primary" | "success" | "warning" | "error"
  ) => string;
  interviewTypeInfo: {
    name: string;
    icon: string;
    color: string;
    description: string;
  };
}

export default function AnalysisView({
  isAnalyzing,
  analysisError,
  analysisResult,
  interviewType,
  saveInterviewAnalysis,
  analyzeConversation,
  getAccentColor,
  interviewTypeInfo,
}: AnalysisViewProps) {
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
          style={{ borderColor: platformColors.borderColor }}
        ></div>
        <h3
          className="text-xl font-semibold mb-2"
          style={{ color: platformColors.borderColor }}
        >
          Analyzing Your Interview...
        </h3>
        <p style={{ color: platformColors.borderColor }}>
          The AI evaluator is reviewing your{" "}
          {interviewType === "technical"
            ? "technical"
            : interviewType === "hr"
            ? "behavioral"
            : "technical and behavioral"}{" "}
          answers.
        </p>
      </div>
    );
  }

  if (analysisError) {
    return (
      <div className="text-center p-8">
        <h3
          className="font-semibold text-xl mb-2"
          style={{ color: getAccentColor("error") }}
        >
          Analysis Error
        </h3>
        <p className="mb-4" style={{ color: platformColors.borderColor }}>
          {analysisError}
        </p>
        <button
          onClick={analyzeConversation}
          className="px-6 py-2 rounded-md font-medium border transition-all"
          style={{
            borderColor: platformColors.borderColor,
            color: platformColors.borderColor,
            backgroundColor: platformColors.outerMainBackground,
          }}
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  if (analysisResult) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <AnalysisResult text={analysisResult} />
        <button
          onClick={saveInterviewAnalysis}
          className="mt-6 flex items-center gap-2 px-6 py-2 rounded-md text-white font-medium bg-orange-500 hover:bg-orange-600 shadow-md transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-semibold text-black mb-4">
        Interview Completed
      </h3>
      <p className="text-gray-700 mb-6">
        Thank you for completing the {interviewTypeInfo.name.toLowerCase()}!
      </p>
      <p className="text-sm text-gray-500">
        Your analysis is being prepared...
      </p>
    </div>
  );
}
