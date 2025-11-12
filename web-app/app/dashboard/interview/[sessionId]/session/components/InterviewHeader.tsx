"use client";
import { useRouter } from "next/navigation";
import { PhoneOff } from "lucide-react";
import platformColors from "@/app/utils/colors";

interface InterviewHeaderProps {
  interviewTypeInfo: {
    name: string;
    icon: string;
    color: string;
    description: string;
  };
  sessionId: string | string[] | undefined; // Add undefined
  interviewCompleted: boolean;
}

export default function InterviewHeader({
  interviewTypeInfo,
  sessionId,
  interviewCompleted,
}: InterviewHeaderProps) {
  const router = useRouter();

  return (
    <header
      className="w-full flex items-center justify-between px-6 py-3 border-b shadow-sm"
      style={{
        backgroundColor: platformColors.outerMainBackground,
        borderColor: platformColors.borderColor,
      }}
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-black tracking-tight">
            SpeakPrep AI
            <span className="text-orange-500 font-semibold">
              {" "}
              Mock Interview
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Session ID:{" "}
            <span className="font-mono text-gray-600">{sessionId || "—"}</span>
            {" • "}
            <span className="text-red-600 font-medium">
              {interviewTypeInfo.description}
            </span>
            {interviewCompleted && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                Completed
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm bg-red-50 px-3 py-1 rounded-md border border-red-200">
          <span className="text-gray-600">Answer Time:</span>
          <div className=" py-1   text-sm font-medium">60 seconds</div>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
          style={{ borderColor: platformColors.borderColor }}
        >
          <PhoneOff size={16} strokeWidth={2} />
          Leave
        </button>
      </div>
    </header>
  );
}
