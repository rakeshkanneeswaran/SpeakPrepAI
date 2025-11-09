"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Settings,
  Download,
  LogOut,
  HelpCircle,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import platformColors from "../utils/colors";

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [interviews, setInterviews] = useState<
    { sessionId: string; createdAt: string }[]
  >([]);
  const [loadingInterviews, setLoadingInterviews] = useState(true);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  // ✅ PROPER LOGOUT - Wait for API but with safeguards
  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      // Clear client-side storage first
      localStorage.clear();
      sessionStorage.clear();

      // Make logout API call with timeout
      const logoutPromise = fetch("/api/logout", {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        credentials: "include",
      });

      // Set a reasonable timeout (5 seconds)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Logout timeout")), 5000)
      );

      // Wait for logout API but don't wait forever
      await Promise.race([logoutPromise, timeoutPromise]);

      // ✅ ONLY redirect after successful API call
      console.log("Logout API completed, redirecting...");
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout error:", error);

      // Even if API fails, we should still try to redirect
      // but inform the user there might be issues
      if (error instanceof Error && error.message === "Logout timeout") {
        console.log("Logout timed out, forcing redirect anyway");
      }

      // Force redirect after error with cache busting
      window.location.href = "/auth?error=logout_timeout&t=" + Date.now();
    }
  };

  // ✅ SIMPLER & MORE RELIABLE VERSION
  const handleLogoutReliable = async () => {
    setLoggingOut(true);

    try {
      // Clear client storage
      localStorage.clear();
      sessionStorage.clear();

      // Make the logout request with a simple timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
        },
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log("Logout successful, redirecting...");
        // Use replace to prevent back button issues
        window.location.replace("/auth");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // If API fails, still redirect but with cache busting
      window.location.replace("/auth?error=logout_failed&t=" + Date.now());
    }
  };

  // ✅ ULTIMATE SAFE LOGOUT (Recommended)
  const handleLogoutSafe = async () => {
    setLoggingOut(true);

    try {
      // Step 1: Clear client-side data
      localStorage.clear();
      sessionStorage.clear();

      // Step 2: Attempt logout API with short timeout
      let logoutSuccess = false;

      try {
        const response = await fetch("/api/logout", {
          method: "POST",
          headers: { "Cache-Control": "no-cache" },
          credentials: "include",
        });

        if (response.ok) {
          logoutSuccess = true;
          console.log("Logout API succeeded");
        }
      } catch (apiError) {
        console.log("Logout API failed, but continuing...", apiError);
      }

      // Step 3: Wait a brief moment to ensure cookie is cleared
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Step 4: Force redirect regardless of API result
      console.log("Redirecting to auth page...");
      window.location.href =
        "/auth?logout=" + (logoutSuccess ? "success" : "forced");
    } catch (error) {
      console.error("Unexpected logout error:", error);
      // Final fallback - always redirect
      window.location.href = "/auth";
    }
  };

  // ✅ Fetch past interviews
  useEffect(() => {
    async function fetchInterviews() {
      try {
        const res = await fetch("/api/dashboard/interviews");
        const data = await res.json();
        if (data.interviews) setInterviews(data.interviews);
      } catch (err) {
        console.error("Failed to load interviews:", err);
      } finally {
        setLoadingInterviews(false);
      }
    }
    fetchInterviews();
  }, []);

  // ✅ Handle interview deletion
  const handleDeleteInterview = async (sessionId: string) => {
    try {
      setDeletingSession(sessionId);
      const response = await fetch("/api/interview/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interviewSessionId: sessionId }),
      });

      if (response.ok) {
        // Remove from local state
        setInterviews((prev) =>
          prev.filter((interview) => interview.sessionId !== sessionId)
        );
        setShowDeleteConfirm(null);
      } else {
        const errorData = await response.json();
        alert(
          `Failed to delete session: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting interview:", error);
      alert("Failed to delete interview session. Please try again.");
    } finally {
      setDeletingSession(null);
    }
  };

  // ✅ Navigate to analysis page
  const handleViewAnalysis = (sessionId: string) => {
    router.push(`/dashboard/interview/${sessionId}/analysis`);
  };

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } shadow-md transition-all duration-300 flex flex-col`}
      style={{
        backgroundColor: platformColors.outerMainBackground,
        borderRight: `1px solid ${platformColors.borderColor}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4"
        style={{ borderColor: platformColors.borderColor }}
      >
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-3 flex-1 overflow-y-auto">
        {/* Recent Sessions */}
        <div>
          {sidebarOpen && (
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
              Recent Sessions
            </h3>
          )}
          {loadingInterviews ? (
            <p className="text-xs text-gray-400 italic">
              {sidebarOpen && "Loading..."}
            </p>
          ) : interviews.length === 0 ? (
            <p className="text-xs text-gray-400 italic">
              {sidebarOpen && "No sessions yet"}
            </p>
          ) : (
            <div className="space-y-1">
              {interviews.slice(0, 8).map((interview) => (
                <div
                  key={interview.sessionId}
                  className="group flex items-center justify-between hover:bg-gray-100 rounded-md transition"
                >
                  <button
                    onClick={() => handleViewAnalysis(interview.sessionId)}
                    className="flex-1 text-left px-2 py-1 rounded-md text-sm text-gray-700 truncate"
                    title={interview.sessionId}
                  >
                    {sidebarOpen
                      ? `Session ${interview.sessionId.slice(-5)}`
                      : "•"}
                  </button>

                  {sidebarOpen && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(interview.sessionId);
                        }}
                        disabled={deletingSession === interview.sessionId}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete session"
                      >
                        {deletingSession === interview.sessionId ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Delete Interview Session?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This action cannot be undone. The interview analysis will be
                permanently deleted.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteInterview(showDeleteConfirm)}
                  disabled={deletingSession === showDeleteConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition"
                >
                  {deletingSession === showDeleteConfirm
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div
        className="p-4 border-t"
        style={{ borderColor: platformColors.borderColor }}
      >
        {sidebarOpen && (
          <>
            {/* ✅ FAQs Link */}
            <button
              onClick={() => router.push("/faqs")}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500 transition mb-3"
            >
              <HelpCircle size={16} />
              FAQs
            </button>

            <SidebarItem
              icon={<Settings />}
              label="Settings"
              open={sidebarOpen}
            />

            {/* Logout - Use the SAFE version */}
            <button
              onClick={handleLogoutSafe} // Use the safe version that waits for API
              disabled={loggingOut}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition mt-3 w-full"
            >
              <LogOut size={16} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  open,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
}) {
  return (
    <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-100">
      <div className="w-5 h-5">{icon}</div>
      {open && <span>{label}</span>}
    </div>
  );
}
