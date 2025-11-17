"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Navbar from "../components/Navbar";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [checkingLogin, setCheckingLogin] = useState(true);

  // Initialize the provider mismatch alert ONLY once (avoids hydration mismatch)
  const initialProviderAlert =
    searchParams?.get("error") === "OAuthAccountNotLinked";
  const [showProviderAlert, setShowProviderAlert] =
    useState(initialProviderAlert);

  // 🔥 Check if user is already authenticated
  useEffect(() => {
    let mounted = true;

    async function checkLogin() {
      try {
        const res = await fetch("/api/check-login");
        const data = await res.json();

        if (mounted && res.ok && data.authenticated) {
          router.push("/dashboard");
        } else if (mounted) {
          setCheckingLogin(false);
        }
      } catch (err) {
        console.error("Login check failed:", err);
        if (mounted) setCheckingLogin(false);
      }
    }

    checkLogin();

    return () => {
      mounted = false; // ✅ Correct cleanup
    };
  }, [router]);

  // ⏳ Show loading while checking the session
  if (checkingLogin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-orange-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-100 text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-orange-100">
        <Navbar />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 mt-24 mb-16 px-4">
        {/* ⚠️ Provider mismatch warning */}
        {showProviderAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4 w-full max-w-lg shadow"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-1 flex items-center gap-1">
                  ⚠️ Login method mismatch
                </h3>

                <div className="text-sm space-y-3">
                  <p>
                    This account was created using a different sign-in method.
                    You must log in using the same provider you originally used.
                  </p>

                  <div>
                    <strong>Examples:</strong>
                    <ul className="list-disc ml-5 mt-1">
                      <li>
                        If you signed up with <strong>Google</strong>, continue
                        using Google.
                      </li>
                      <li>
                        If you signed up with <strong>LinkedIn</strong>,
                        continue using LinkedIn.
                      </li>
                    </ul>
                  </div>

                  <p>
                    Want to switch login providers?{" "}
                    <strong>Contact support</strong> and we’ll help migrate your
                    account.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowProviderAlert(false)}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* Login Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-xl rounded-3xl p-10 md:p-12 w-[400px] md:w-[460px] text-center border border-orange-100"
        >
          <h2 className="text-3xl font-bold text-[#f43e02] mb-3">
            Welcome to SpeakPrepAI
          </h2>

          <p className="text-gray-500 mb-8 text-[15px]">
            Sign in to access your dashboard
          </p>

          {/* Google */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Continue with Google</span>
          </motion.button>

          {/* LinkedIn */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("linkedin", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-4 mt-3 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
              alt="LinkedIn"
              className="w-5 h-5"
            />
            <span>Continue with LinkedIn</span>
          </motion.button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="border-t border-gray-200"></div>
            <span className="absolute left-1/2 -top-3 transform -translate-x-1/2 bg-white px-3 text-gray-400 text-sm">
              OR
            </span>
          </div>

          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="/privacy" className="text-[#f43e02] underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

// 🔥 Wrap the component in <Suspense> so useSearchParams() works
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginInner />
    </Suspense>
  );
}
