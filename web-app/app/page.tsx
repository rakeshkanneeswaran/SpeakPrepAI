"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { Upload, Mic, BarChart3 } from "lucide-react";

export default function HomePage() {
  const year = new Date().getFullYear();

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
          <p className="text-lg text-gray-600">
            SpeakPrep AI simulates real interviews, evaluates your responses,
            and helps you grow faster — all powered by advanced AI.
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
        </div>

        {/* Image - UPDATED WITH LARGER DESKTOP SIZE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-8 md:mt-0 md:flex-1 flex justify-center"
        >
          <img
            src="/hero-illustration.png"
            alt="AI Interview Illustration"
            className="w-[380px] md:w-[600px] lg:w-[700px] xl:w-[800px] rounded-lg drop-shadow-xl"
          />
        </motion.div>
      </section>

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

      {/* How It Works - UPDATED WITH BOTH DESKTOP & MOBILE LAYOUTS */}
      <section
        className="py-24 px-6 md:px-20"
        style={{ backgroundColor: "#fff7f0" }}
      >
        <h2 className="text-4xl font-semibold text-center mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          See SpeakPrep AI in action with our step-by-step video demonstrations
        </p>

        {/* MOBILE & TABLET LAYOUT (Stacked cards) */}
        <div className="xl:hidden grid gap-8 max-w-2xl mx-auto">
          {[
            {
              step: "1",
              title: "Upload Resume & Job Description",
              desc: "Our AI learns about your background and the job you're aiming for. Simply upload your resume and paste the job description - our system analyzes both to create personalized interview questions.",
              video: "/videos/upload-demo.mp4",
              icon: <Upload size={24} />,
            },
            {
              step: "2",
              title: "Practice in Real-Time",
              desc: "Experience interactive interviews tailored to your field. Speak naturally and get real-time feedback on your responses, tone, and communication style.",
              video: "/videos/practice-demo.mp4",
              icon: <Mic size={24} />,
            },
            {
              step: "3",
              title: "Get Detailed Analysis",
              desc: "Receive comprehensive feedback on communication, technical skills, and areas for improvement. Our AI pinpoints exactly what to work on for your next interview.",
              video: "/videos/analysis-demo.mp4",
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
              {/* Video Container - AUTOPLAY & LOOP */}
              <div className="relative aspect-video bg-gray-900">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={item.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Content */}
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

        {/* DESKTOP LAYOUT (Side-by-side) */}
        <div className="hidden xl:block mt-16 max-w-6xl mx-auto">
          <div className="space-y-16">
            {[
              {
                step: "1",
                title: "Upload Resume & Job Description",
                desc: "Our AI learns about your background and the job you're aiming for. Simply upload your resume and paste the job description - our system analyzes both to create personalized interview questions.",
                video: "/videos/upload-demo.mp4",
                alignment: "left",
              },
              {
                step: "2",
                title: "Practice in Real-Time",
                desc: "Experience interactive interviews tailored to your field. Speak naturally and get real-time feedback on your responses, tone, and communication style.",
                video: "/videos/practice-demo.mp4",
                alignment: "right",
              },
              {
                step: "3",
                title: "Get Detailed Analysis",
                desc: "Receive comprehensive feedback on communication, technical skills, and areas for improvement. Our AI pinpoints exactly what to work on for your next interview.",
                video: "/videos/analysis-demo.mp4",
                alignment: "left",
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`flex items-center gap-12 ${
                  item.alignment === "right" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Video Section - AUTOPLAY & LOOP */}
                <div className="flex-1">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-900 aspect-video">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={item.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                {/* Text Section */}
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
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 md:px-20 text-center bg-black text-[#E6DCAF]">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to Ace Your Next Interview?
        </h2>
        <p className="text-white/80 mb-8">
          SpeakPrep AI is currently completely free.
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
