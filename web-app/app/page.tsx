"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen flex flex-col bg-[#fafafa] text-black">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 md:px-20 py-24 bg-[#f3f3ef] text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Master Every Interview <br />
            <span style={{ color: "#f43e02" }}>With Real-Time AI Coaching</span>
          </h1>
          <p className="text-lg text-gray-600">
            SpeakPrep AI simulates real interviews, evaluates your responses,
            and helps you grow faster — all powered by advanced AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link href="/dashboard">
              <button
                style={{ backgroundColor: "#f43e02" }}
                className="hover:opacity-90 text-white text-lg px-6 py-3 rounded-md shadow-md transition-transform transform hover:scale-105"
              >
                Start Free Mock Interview
              </button>
            </Link>

            <button
              style={{
                borderColor: "#f43e02",
                color: "#f43e02",
              }}
              className="border hover:bg-orange-50 text-lg px-6 py-3 rounded-md transition-transform transform hover:scale-105"
            >
              Watch Demo
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-12"
        >
          <img
            src="/hero-illustration.svg"
            alt="AI Interview Illustration"
            className="w-[380px] md:w-[500px] rounded-lg drop-shadow-xl mx-auto"
          />
        </motion.div>
      </section>

      {/* Copilot Section */}
      {/* Copilot Section */}
      <section className="py-24 px-6 md:px-20 bg-black text-[#E6DCAF]">
        <h2 className="text-4xl font-semibold text-center mb-12 text-[#E6DCAF]">
          Your AI Interview Copilot
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Adaptive AI Interviews",
              desc: "Personalized sessions crafted from your resume and job goals, ensuring every question feels relevant.",
            },
            {
              title: "Actionable Feedback",
              desc: "Instant analysis on tone, structure, and confidence — learn exactly what to improve after each session.",
            },
            {
              title: "Voice-Powered Practice",
              desc: "Realistic, hands-free mock interviews — speak naturally, and let AI handle evaluation and coaching.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-xl border border-[#E6DCAF]/30 bg-[#111] hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(230,220,175,0.3)] transition text-center"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#E6DCAF]">
                {card.title}
              </h3>
              <p className="text-[#E6DCAF]/80 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        className="py-24 px-6 md:px-20"
        style={{ backgroundColor: "#fff7f0" }}
      >
        <h2 className="text-4xl font-semibold text-center mb-12">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-12 max-w-5xl mx-auto">
          {[
            {
              step: "1",
              title: "Upload Resume & Job Description",
              desc: "Our AI learns about your background and the job you’re aiming for.",
            },
            {
              step: "2",
              title: "Practice in Real-Time",
              desc: "Experience interactive interviews tailored to your field.",
            },
            {
              step: "3",
              title: "Get Detailed Analysis",
              desc: "Receive instant feedback on communication, skills, and improvement areas.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col items-center text-center max-w-xs mx-auto"
            >
              <div
                style={{ backgroundColor: "#f43e02" }}
                className="text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold mb-4"
              >
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Black Section */}

      {/* Footer */}
      <footer className="py-16 px-6 md:px-20 text-center bg-black text-[#E6DCAF]">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to Ace Your Next Interview?
        </h2>
        <p className="text-white/80 mb-8">
          SpeakPrep AI is currently invite-only. Early access is open for a
          limited group of professionals and students.
        </p>
        <Link href="/early-access">
          <button
            style={{ backgroundColor: "#f43e02" }}
            className="hover:opacity-90 text-white text-lg px-6 py-3 rounded-md shadow-md transition-transform transform hover:scale-105"
          >
            Request Early Access
          </button>
        </Link>
        <div className="mt-10 text-white/60 text-sm">
          © {year} SpeakPrep AI · Invite-Only Early Access
        </div>
      </footer>
    </main>
  );
}
