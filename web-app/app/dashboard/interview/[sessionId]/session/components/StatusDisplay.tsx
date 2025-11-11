"use client";

import RecordingTimer from "./RecordingTimer";

interface StatusDisplayProps {
  isAudioPlaying: boolean;
  isAudioRecording: boolean;
  interviewEnded: boolean;
  recordingTimeRemaining: number;
  getTimerColor: () => string;
  formatTime: (seconds: number) => string;
  getAccentColor: (
    type?: "primary" | "success" | "warning" | "error"
  ) => string;
}

export default function StatusDisplay({
  isAudioPlaying,
  isAudioRecording,
  interviewEnded,
  recordingTimeRemaining,
  getTimerColor,
  formatTime,
  getAccentColor,
}: StatusDisplayProps) {
  if (isAudioRecording) {
    return (
      <RecordingTimer
        recordingTimeRemaining={recordingTimeRemaining}
        getTimerColor={getTimerColor}
        formatTime={formatTime}
        getAccentColor={getAccentColor}
      />
    );
  }

  if (isAudioPlaying) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="flex items-end justify-center gap-1 h-5">
          {[1, 2, 3, 4, 5].map((bar) => (
            <div
              key={bar}
              className="w-1.5 bg-orange-500 rounded-sm animate-bounce"
              style={{
                height: `${6 + bar * 3}px`,
                animationDelay: `${bar * 0.1}s`,
              }}
            ></div>
          ))}
        </div>
        <p className="text-lg font-semibold text-black">
          {interviewEnded
            ? "Interviewer is speaking..."
            : "Interviewer is speaking..."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="h-6 w-6 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
      <p className="text-lg font-semibold text-black">
        {interviewEnded
          ? "Analyzing your answer..."
          : "Analyzing your answer..."}
      </p>
    </div>
  );
}
