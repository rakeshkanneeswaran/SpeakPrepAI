"use client";

import { useState } from "react";
import Link from "next/link";

export default function EarlyAccessPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email.");
    setSubmitted(true);
    // You can later replace this with an API call
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{
        backgroundColor: "#f3f3ef",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* Header */}
      <Link
        href="/"
        className="absolute top-8 left-8 text-lg font-semibold text-black hover:text-[#f43e02] transition-colors"
      >
        ← Back to Home
      </Link>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 border border-black/10">
        <h1 className="text-4xl font-bold mb-4 text-black">Early Access</h1>
        <p className="text-gray-700 mb-6 text-sm leading-relaxed">
          SpeakPrep AI is currently invite-only. Enter your email below — we’ll
          send you your unique ID and password when access is granted.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full border border-black/20 rounded-md px-4 py-3 text-black focus:outline-none focus:border-[#f43e02] placeholder-gray-400"
              required
            />
            <button
              type="submit"
              className="w-full text-white font-semibold py-3 rounded-md transition-transform hover:scale-105"
              style={{ backgroundColor: "#f43e02" }}
            >
              Request Access
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#f43e02]">
              Request Received ✅
            </h2>
            <p className="text-gray-700 text-sm">
              We’ll review your request and send your invite ID and password to{" "}
              <strong>{email}</strong> once approved.
            </p>
          </div>
        )}
      </div>

      <footer className="mt-16 text-gray-600 text-sm">
        © {new Date().getFullYear()} SpeakPrep AI · Invite-Only Early Access
      </footer>
    </main>
  );
}
