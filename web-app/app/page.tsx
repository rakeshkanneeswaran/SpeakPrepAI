"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { Upload, Mic, BarChart3, Shield, Users, Sparkles } from "lucide-react";

export default function HomePage() {
  const year = new Date().getFullYear();

  const youtubeVideos = {
    upload: "zQDhe5_d3Uk",
    practice: "JrtZMetp-9I",
    analysis: "56FO9Vll36g",
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#fafafa] text-black">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-24 bg-[#f3f3ef]">
        {/* Text Content */}
        <div className="max-w-2xl space-y-6 md:pr-10">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Master Every Interview <br />
            <span style={{ color: "#f43e02" }}>With Real-Time AI Coaching</span>
          </h1>

          {/* NEW – Sharper value prop */}
          <p className="text-lg text-gray-700">
            Practice real interviews using your resume and job description.
            Speak naturally, get instant voice-based feedback, and improve your
            clarity, structure, and confidence in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/auth">
              <button
                style={{ backgroundColor: "#f43e02" }}
                className="hover:opacity-90 text-white text-lg px-6 py-3 rounded-md shadow-md transition-transform transform hover:scale-105"
              >
                Start Free Mock Interview
              </button>
            </Link>
          </div>

          {/* NEW – Reassurance under CTA */}
          <p className="text-sm text-gray-500 mt-2">
            No credit card · Takes 2 minutes to begin · 100% private
          </p>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-8 md:mt-0 md:flex-1 flex justify-center"
        >
          <img
            src="/hero-illustration.png"
            alt="AI mock interview preparation illustration"
            className="w-[380px] md:w-[600px] lg:w-[700px] xl:w-[800px] rounded-lg drop-shadow-xl"
          />
        </motion.div>
      </section>

      {/* Intro SEO Section */}
      <section className="px-6 md:px-20 py-12 bg-white text-center">
        <p className="max-w-3xl mx-auto text-gray-700 text-lg leading-relaxed">
          <strong>SpeakPrep AI</strong> is an intelligent mock interview tool
          designed for students, job-seekers, and professionals. Practice with
          real interview questions tailored to your resume, get instant feedback
          on communication, and build confidence through voice-based interactive
          sessions.
        </p>
      </section>

      {/* How It Works */}
      <section
        className="py-24 px-6 md:px-20"
        style={{ backgroundColor: "#fff7f0" }}
      >
        <h2 className="text-4xl font-semibold text-center mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          See SpeakPrep AI in action with our step-by-step walkthrough
        </p>

        {/* MOBILE + TABLET */}
        <div className="xl:hidden grid gap-8 max-w-2xl mx-auto">
          {[
            {
              step: "1",
              title: "Upload Resume & Job Description",
              desc: "Upload your resume and target job role — the AI instantly personalizes interview questions for your field.",
              videoId: youtubeVideos.upload,
              icon: <Upload size={24} />,
            },
            {
              step: "2",
              title: "Practice in Real-Time",
              desc: "Speak naturally in an AI-powered mock interview. Receive live guidance on tone, pace, structure, and clarity.",
              videoId: youtubeVideos.practice,
              icon: <Mic size={24} />,
            },
            {
              step: "3",
              title: "Get Detailed Analysis",
              desc: "Review actionable insights on confidence, communication, and answer effectiveness to improve rapidly.",
              videoId: youtubeVideos.analysis,
              icon: <BarChart3 size={24} />,
            },
          ].map((item) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* FIXED – Autoplay disabled */}
              <div className="relative aspect-video bg-gray-900">
                <iframe
                  src={`https://www.youtube.com/embed/${item.videoId}?mute=1&controls=1&modestbranding=1&rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Video: ${item.title}`}
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    style={{ backgroundColor: "#f43e02" }}
                    className="text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold"
                  >
                    {item.step}
                  </div>
                  <div className="text-orange-500">{item.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden xl:block mt-16 max-w-6xl mx-auto">
          <div className="space-y-16">
            {[
              {
                step: "1",
                title: "Upload Resume & Job Description",
                desc: "Upload your resume and target job description — the AI instantly tailors interview questions for your field.",
                videoId: youtubeVideos.upload,
                alignment: "left",
              },
              {
                step: "2",
                title: "Practice in Real-Time",
                desc: "Experience voice-based mock interviews. Get immediate guidance on tone, confidence, and clarity.",
                videoId: youtubeVideos.practice,
                alignment: "right",
              },
              {
                step: "3",
                title: "Get Detailed Analysis",
                desc: "Receive in-depth feedback on communication style, structure, and answer quality.",
                videoId: youtubeVideos.analysis,
                alignment: "left",
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`flex items-center gap-12 ${
                  item.alignment === "right" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-900 aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=1&loop=1&playlist=${item.videoId}&controls=1&modestbranding=1&rel=0`}
                      className="w-full h-full rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`How It Works: ${item.title}`}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      style={{ backgroundColor: "#f43e02" }}
                      className="text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold"
                    >
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEW MID-PAGE CTA */}
        <div className="text-center mt-20">
          <Link href="/auth">
            <button
              style={{ backgroundColor: "#f43e02" }}
              className="hover:opacity-90 text-white text-lg px-8 py-3 rounded-md shadow-md transition-transform transform hover:scale-105"
            >
              Start Practicing Now
            </button>
          </Link>
        </div>
      </section>

      {/* NEW – TRUST SECTION */}
      <section className="py-20 px-6 md:px-20 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-10">
          Trusted & Built for Real Candidates
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <Shield size={36} />,
              title: "Private & Secure",
              desc: "Your interview audio is processed securely and never stored.",
            },
            {
              icon: <Users size={36} />,
              title: "Made for Everyone",
              desc: "Freshers, engineers, managers — SpeakPrep adapts to any role.",
            },
            {
              icon: <Sparkles size={36} />,
              title: "Real Results",
              desc: "Users report higher confidence and smoother interviews in just one week.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 bg-[#f8f8f8] rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="text-orange-500 flex justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Interview Copilot */}
      <section className="py-24 px-6 md:px-20 bg-black text-[#E6DCAF]">
        <h2 className="text-4xl font-semibold text-center mb-12 text-[#E6DCAF]">
          Your AI Interview Copilot
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Role-Based Interview Scenarios",
              desc: "Dynamic interview questions generated from your resume and job description.",
            },
            {
              title: "Instant Communication Coaching",
              desc: "Live feedback on tone, clarity, filler words, and confidence during the interview.",
            },
            {
              title: "Voice-Powered Practice",
              desc: "Practice naturally with real-time AI listening — just speak and get coached.",
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

      {/* Footer */}
      <footer className="py-16 px-6 md:px-20 text-center bg-black text-[#E6DCAF]">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to Ace Your Next Interview?
        </h2>
        <p className="text-white/80 mb-8">
          SpeakPrep AI is currently completely free to use.
        </p>
        <Link href="/auth">
          <button
            style={{ backgroundColor: "#f43e02" }}
            className="hover:opacity-90 text-white text-lg px-6 py-3 rounded-md shadow-md transition-transform transform hover:scale-105"
          >
            Create Your Free Account
          </button>
        </Link>
        <div className="mt-10 text-white/60 text-sm">
          © {year} SpeakPrep AI · All rights reserved.
        </div>
      </footer>
    </main>
  );
}
