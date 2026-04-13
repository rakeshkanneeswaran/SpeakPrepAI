"use client";
import platformColors from "@/app/utils/colors";
import StatusDisplay from "./StatusDisplay";

interface InterviewContentProps {
  isInterviewStarted: boolean;
  interviewTypeInfo: {
    name: string;
    icon: string;
    color: string;
    description: string;
  };
  setIsInterviewStarted: (value: boolean) => void;
  currentQuestion: string;
  userAnswers: string[];
  interviewEnded: boolean;
  concludingMessagePlayed: boolean;
  isAudioPlaying: boolean;
  isAudioRecording: boolean;
  recordingTimeRemaining: number;
  getTimerColor: () => string;
  formatTime: (seconds: number) => string;
  getAccentColor: (
    type?: "primary" | "success" | "warning" | "error"
  ) => string;
  moveToNextQuestion: () => void;
}

export default function InterviewContent({
  isInterviewStarted,
  interviewTypeInfo,
  setIsInterviewStarted,
  currentQuestion,
  userAnswers,
  interviewEnded,
  concludingMessagePlayed,
  isAudioPlaying,
  isAudioRecording,
  recordingTimeRemaining,
  getTimerColor,
  formatTime,
  getAccentColor,
  moveToNextQuestion,
}: InterviewContentProps) {
  if (!isInterviewStarted) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: "black" }}>
          {interviewTypeInfo.name}
        </h2>
        <p className="mb-4" style={{ color: "black" }}>
          Click below to start your {interviewTypeInfo.name.toLowerCase()}. Each
          question will play automatically, and your answers will be recorded.
        </p>
        <button
          onClick={() => setIsInterviewStarted(true)}
          className="relative px-6 py-2 rounded-md font-medium border transition-all bg-orange-500 text-white hover:bg-orange-600 shadow-md"
          style={{
            borderColor: platformColors.borderColor,
            boxShadow: "0 0 12px rgba(255, 165, 0, 0.5)",
          }}
        >
          <span className="relative z-10">Start Interview</span>
          <span className="absolute inset-0 rounded-md bg-orange-500 opacity-50 blur-md animate-pulse"></span>
        </button>
      </div>
    );
  }

  if (!concludingMessagePlayed) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        {/* Question Header */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold text-black mb-1">
            {interviewEnded
              ? "Interview Complete"
              : `Question ${userAnswers.length + 1}`}
          </h3>
          <p className="italic text-lg text-gray-900 leading-relaxed">
            {currentQuestion}
          </p>
        </div>

        {/* State Block with Timer */}
        <div className="flex flex-col items-center justify-center space-y-4 min-h-[150px]">
          <StatusDisplay
            isAudioPlaying={isAudioPlaying}
            isAudioRecording={isAudioRecording}
            interviewEnded={interviewEnded}
            recordingTimeRemaining={recordingTimeRemaining}
            getTimerColor={getTimerColor}
            formatTime={formatTime}
            getAccentColor={getAccentColor}
          />

          {isAudioRecording && !interviewEnded && (
            <button
              onClick={moveToNextQuestion}
              className="px-5 py-2 rounded-md font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-md transition-all"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    );
  }

  return null; // This case is handled by AnalysisView
}
