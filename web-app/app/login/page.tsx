"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-100 text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* 🌟 Sticky Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-orange-100">
        <Navbar />
      </div>

      {/* 🌟 Centered Login Card */}
      <div className="flex flex-col items-center justify-center flex-1 mt-24 mb-16 px-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-xl rounded-3xl p-10 md:p-12 w-[400px] md:w-[460px] text-center border border-orange-100"
        >
          {/* Heading */}
          <h2 className="text-3xl font-bold text-[#f43e02] mb-3">
            Welcome to SpeakPrepAI
          </h2>

          <p className="text-gray-500 mb-8 text-[15px]">
            Sign in to continue to your dashboard
          </p>

          {/* ⭐ Google Login Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span>Continue with Google</span>
          </motion.button>

          {/* OR divider */}
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
