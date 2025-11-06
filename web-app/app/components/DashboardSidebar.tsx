"use client";

import { useState, useEffect } from "react";
import { Menu, X, Settings, Download, LogOut, HelpCircle } from "lucide-react";
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

  // ✅ Handle Logout
  async function handleLogout() {
    try {
      setLoggingOut(true);
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        router.push("/auth");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out", err);
    } finally {
      setLoggingOut(false);
    }
  }

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
                <button
                  key={interview.sessionId}
                  onClick={() =>
                    router.push(
                      `/dashboard/interview/${interview.sessionId}/analysis`
                    )
                  }
                  className="w-full text-left px-2 py-1 rounded-md hover:bg-gray-100 transition text-sm text-gray-700 truncate"
                  title={interview.sessionId}
                >
                  {sidebarOpen
                    ? `Session ${interview.sessionId.slice(-5)}`
                    : "•"}
                </button>
              ))}
            </div>
          )}
        </div>
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

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition mt-3"
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
