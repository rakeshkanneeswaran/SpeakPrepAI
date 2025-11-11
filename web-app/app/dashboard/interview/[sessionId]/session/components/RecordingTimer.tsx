"use client";

interface RecordingTimerProps {
  recordingTimeRemaining: number;
  getTimerColor: () => string;
  formatTime: (seconds: number) => string;
  getAccentColor: (
    type?: "primary" | "success" | "warning" | "error"
  ) => string;
}

export default function RecordingTimer({
  recordingTimeRemaining,
  getTimerColor,
  formatTime,
  getAccentColor,
}: RecordingTimerProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <div
          className="text-3xl font-bold font-mono transition-colors duration-300"
          style={{ color: getTimerColor() }}
        >
          {formatTime(recordingTimeRemaining)}
        </div>
        <p className="text-sm text-gray-600">Time remaining to answer</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="relative flex items-center justify-center">
          <div
            className="absolute h-10 w-10 rounded-full animate-ping"
            style={{
              backgroundColor: getAccentColor("error"),
              opacity: 0.3,
            }}
          ></div>
          <div
            className="h-5 w-5 rounded-full shadow-md"
            style={{ backgroundColor: getAccentColor("error") }}
          ></div>
        </div>
        <p className="text-lg font-semibold text-black">
          Recording in progress...
        </p>
      </div>
    </div>
  );
}
