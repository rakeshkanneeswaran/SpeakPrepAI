"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";
import Navbar from "../components/Navbar";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main
      className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-orange-100 text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Sticky Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-orange-100">
        <Navbar />
      </div>

      {/* Centered Auth Card */}
      <div className="flex flex-col items-center justify-center flex-1 mt-24 mb-16">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-xl rounded-3xl p-10 md:p-12 w-[400px] md:w-[460px] text-center border border-orange-100"
        >
          <h2 className="text-3xl font-bold text-[#f43e02] mb-3">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 mb-8 text-[15px]">
            {isLogin
              ? "Sign in to your SpeakPrep AI dashboard"
              : "Join SpeakPrep AI and start practicing interviews"}
          </p>

          {isLogin ? <LoginForm /> : <SignupForm />}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#f43e02] font-semibold hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
