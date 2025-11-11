"use client";
import { RefObject } from "react";
import platformColors from "@/app/utils/colors";

interface CameraPanelProps {
  cameraError: string | null;
  cameraActive: boolean;
  videoRef: RefObject<HTMLVideoElement | null>; // Allow null
  startCamera: () => void;
  stopCamera: () => void;
  getAccentColor: (
    type?: "primary" | "success" | "warning" | "error"
  ) => string;
}

export default function CameraPanel({
  cameraError,
  cameraActive,
  videoRef,
  startCamera,
  stopCamera,
  getAccentColor,
}: CameraPanelProps) {
  return (
    <div
      className="w-1/3 flex flex-col items-center justify-center border-r p-4 justify-between"
      style={{
        backgroundColor: platformColors.outerMainBackground,
        borderColor: platformColors.borderColor,
      }}
    >
      <div
        className="w-full aspect-video rounded-lg overflow-hidden flex items-center justify-center border-2"
        style={{
          backgroundColor: platformColors.mainBackground,
          borderColor: platformColors.borderColor,
        }}
      >
        {cameraError ? (
          <div
            className="flex flex-col items-center justify-center text-center p-4"
            style={{ color: getAccentColor("error") }}
          >
            <p className="mb-2">{cameraError}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-md text-sm font-medium border transition-all"
              style={{
                borderColor: platformColors.borderColor,
                color: platformColors.borderColor,
                backgroundColor: platformColors.outerMainBackground,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  platformColors.borderColor;
                e.currentTarget.style.color =
                  platformColors.outerMainBackground;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  platformColors.outerMainBackground;
                e.currentTarget.style.color = platformColors.borderColor;
              }}
            >
              Retry Camera
            </button>
          </div>
        ) : cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <p className="mb-2" style={{ color: platformColors.borderColor }}>
              Connecting to camera...
            </p>
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: platformColors.borderColor }}
            ></div>
          </div>
        )}
      </div>

      <p className="mt-2 text-sm" style={{ color: platformColors.borderColor }}>
        {cameraError
          ? "Camera error"
          : cameraActive
          ? "Camera active"
          : "Connecting..."}
      </p>

      {/* Camera Controls */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={startCamera}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-300"
          style={{
            backgroundColor: getAccentColor("success"),
            color: "#fff",
            border: "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
            />
          </svg>
          Start Camera
        </button>

        <button
          onClick={stopCamera}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
          style={{
            backgroundColor: getAccentColor("error"),
            color: "#fff",
            border: "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="5" width="13" height="14" rx="2" ry="2" />
            <path d="M17 10l4.553-2.276A1 1 0 0122 8.618v6.764a1 1 0 01-1.447.894L17 14" />
            <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" />
          </svg>
          Stop Camera
        </button>
      </div>
    </div>
  );
}
