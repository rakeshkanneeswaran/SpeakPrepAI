"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        setIsCheckingOnboarding(true);

        const response = await fetch("/api/user/check-onboarding", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to check onboarding status");
        }

        const data = await response.json();

        if (data.isOnboarded) {
          setIsOnboarded(true);
        } else {
          // Redirect to onboarding if not onboarded
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // On error, we can either redirect to onboarding or show an error
        // For now, let's redirect to onboarding to be safe
        router.push("/onboarding");
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  // Show loading state while checking onboarding status
  if (isCheckingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Checking your profile...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we verify your information.
          </p>
        </div>
      </div>
    );
  }

  // Only render children if user is onboarded
  // (if not onboarded, they will be redirected in the useEffect)
  if (!isOnboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Redirecting to onboarding...
          </h2>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
