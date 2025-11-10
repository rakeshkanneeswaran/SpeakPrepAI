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
  const [showAuthError, setShowAuthError] = useState(false);

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
          // If onboarding check fails, logout and show error modal
          await fetch("/api/logout", { method: "POST" });
          setShowAuthError(true);
          setIsCheckingOnboarding(false);
          return;
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
        // On error, logout and show error modal
        await fetch("/api/logout", { method: "POST" });
        setShowAuthError(true);
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

  // Show error modal if authentication fails
  if (showAuthError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Authentication Error
            </h2>
            <p className="text-gray-700 mb-4">
              There is some problem in authentication of your account. Please
              login again.
            </p>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              onClick={() => router.push("/auth")}
            >
              Go to Login
            </button>
          </div>
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
