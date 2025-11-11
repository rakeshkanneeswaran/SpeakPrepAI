"use client";
import platformColors from "@/app/utils/colors";

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingState({
  message = "Checking Interview Status...",
  subMessage = "Please wait while we verify your interview session.",
}: LoadingStateProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: platformColors.mainBackground }}
    >
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
          style={{ borderColor: platformColors.borderColor }}
        ></div>
        <h2 className="text-xl font-semibold text-black mb-2">{message}</h2>
        <p className="text-gray-600">{subMessage}</p>
      </div>
    </div>
  );
}
