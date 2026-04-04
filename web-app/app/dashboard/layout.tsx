"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/user/check-onboarding");

        if (res.status === 401) {
          // User is NOT authenticated → redirect to login
          router.push("/login");
          return;
        }
        setOnboarded(true);
      } catch (err) {
        console.error("Error checking onboarding:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [router]);

  // ⏳ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Checking your profile...
          </h2>
        </div>
      </div>
    );
  }

  // 🚫 User is NOT onboarded (redirect triggers automatically)
  if (!onboarded) {
    return null;
  }

  // ✅ User is onboarded → Render dashboard
  return <>{children}</>;
}
