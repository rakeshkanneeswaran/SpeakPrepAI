"use client";

import { useState } from "react";
import {
  Menu,
  X,
  User,
  Settings,
  Download,
  Briefcase,
  Rocket,
  LogOut,
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

  const items = [
    { icon: <Briefcase />, label: "Interview Copilot" },
    { icon: <User />, label: "Mock Interview" },
    { icon: <Rocket />, label: "Job Hunter" },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } shadow-md transition-all duration-300 flex flex-col justify-between`}
      style={{
        backgroundColor: platformColors.outerMainBackground,
        borderRight: `1px solid ${platformColors.borderColor}`,
      }}
    >
      {/* Top Section */}
      <div>
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: platformColors.borderColor }}
        >
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-3">
          {items.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              open={sidebarOpen}
            />
          ))}
          <div
            className="border-t my-3"
            style={{ borderColor: platformColors.borderColor }}
          />
          <SidebarItem
            icon={<Download />}
            label="Download for Mac/PC"
            open={sidebarOpen}
          />
          <SidebarItem
            icon={<Settings />}
            label="Settings"
            open={sidebarOpen}
          />
        </nav>
      </div>

      {/* Bottom Section */}
      <div
        className="p-4 border-t"
        style={{ borderColor: platformColors.borderColor }}
      >
        {sidebarOpen && (
          <>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition"
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
