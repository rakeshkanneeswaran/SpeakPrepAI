"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [checkingLogin, setCheckingLogin] = useState(true);

  // initialize show/hide of provider-mismatch alert from search param (lazy init)
  const initialProviderAlert =
    (searchParams?.get("error") || "") === "OAuthAccountNotLinked";
  const [showProviderAlert, setShowProviderAlert] = useState<boolean>(
    () => initialProviderAlert
  );

  // 🔥 Check if user is already logged in
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
      mounted = false;
    };
  }, [router]);

  // Loading Screen while check runs
  if (checkingLogin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-orange-400 border-t-transparent rounded-full mx-auto" />
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
      {/* Sticky Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-orange-100">
        <Navbar />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 mt-24 mb-16 px-4">
        {/* Provider mismatch alert (if present) */}
        {showProviderAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4 w-full max-w-lg shadow"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-1">
                  ⚠️ Login method mismatch
                </h3>

                <div className="text-sm leading-relaxed text-red-700">
                  <div>
                    It looks like this account was created using a different
                    sign-in method. Please sign in using the same provider you
                    used previously.
                  </div>

                  <div className="mt-3">
                    <strong>Examples</strong>
                    <ul className="list-disc ml-5 mt-2 text-red-700">
                      <li>
                        If you originally signed up with <strong>Google</strong>
                        , continue signing in with Google.
                      </li>
                      <li>
                        If you originally signed up with{" "}
                        <strong>LinkedIn</strong>, sign in with LinkedIn.
                      </li>
                    </ul>
                  </div>

                  <div className="mt-3">
                    If you want to switch providers,{" "}
                    <strong>contact support</strong> and we’ll help migrate your
                    account.
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => setShowProviderAlert(false)}
                  aria-label="Dismiss"
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Login card */}
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
            Sign in to continue to your dashboard
          </p>

          {/* Google */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              className="w-5 h-5"
              alt="Google"
            />
            <span>Continue with Google</span>
          </motion.button>

          {/* LinkedIn */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("linkedin", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-4 mt-3 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            {/* Using a CDN SVG for LinkedIn logo (reliable) */}
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
              alt="LinkedIn"
              className="w-5 h-5"
            />
            <span>Continue with LinkedIn</span>
          </motion.button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="border-t border-gray-200" />
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
