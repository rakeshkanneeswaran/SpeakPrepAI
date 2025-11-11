"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface TTSErrorCardProps {
  error: string;
  onClose: () => void;
  sessionId: string | string[] | undefined;
}

export default function TTSErrorCard({
  error,
  onClose,
  sessionId,
}: TTSErrorCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleGoToDashboard = async () => {
    if (!sessionId) {
      router.push("/dashboard");
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch("/api/interview/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewSessionId: sessionId }),
      });

      if (!response.ok) throw new Error("Failed to delete session");
      console.log("Session deleted successfully");

      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting session:", error);
      router.push("/dashboard");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0c0c0c]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414]/95 border border-[#E6DCAF]/20 rounded-2xl shadow-[0_0_40px_rgba(230,220,175,0.08)] max-w-md w-full p-8 text-center">
        {/* Alert Icon */}
        <div className="w-20 h-20 bg-[#E6DCAF]/10 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <svg
            className="w-10 h-10 text-[#E6DCAF]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Title & Message */}
        <h3 className="text-2xl font-semibold text-[#E6DCAF] mb-2">
          Audio Processing Limited
        </h3>
        <p className="text-white/80 text-sm leading-relaxed max-w-sm mx-auto mb-6">
          The text-to-speech service has reached its daily limit. Since audio is
          essential for this interview experience, we need to pause here. You
          can either upgrade your plan for immediate access or start a new
          session tomorrow when limits reset.
        </p>

        {/* Error detail (optional tech info) */}
        <div className="bg-[#1c1c1c] border border-[#E6DCAF]/20 rounded-xl p-3 mb-6 text-xs text-[#E6DCAF]/70 text-left">
          <p>{error}</p>
        </div>

        {/* Important Note */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
          <p className="text-red-400 text-sm font-medium leading-relaxed">
            ⚠️ This session won’t be recorded. Please start a new one after
            upgrading your plan or updating your API key.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <a
            href="https://console.groq.com/settings/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#E6DCAF] text-black font-semibold rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(230,220,175,0.3)]"
          >
            Upgrade Plan
          </a>
          <button
            onClick={handleGoToDashboard}
            disabled={isDeleting}
            className="px-6 py-3 border border-[#E6DCAF]/30 text-[#E6DCAF] rounded-xl hover:bg-[#E6DCAF]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-[#E6DCAF]/60 border-t-transparent rounded-full animate-spin"></div>
                Cleaning up...
              </div>
            ) : (
              "Go to Dashboard"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
