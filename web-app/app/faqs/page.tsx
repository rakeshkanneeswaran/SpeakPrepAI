"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import platformColors from "../utils/colors";

export default function FAQsPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is SpeakPrep AI?",
      answer:
        "SpeakPrep AI is an AI-powered mock interview platform that simulates real interview scenarios. It helps you practice speaking, structure answers, improve communication, and build confidence through real-time coaching.",
    },
    {
      question: "How does SpeakPrep AI generate interview questions?",
      answer:
        "The system uses advanced LLMs that analyze your resume, job description, and interview style. Each question is tailored to your role, field, and previous responses — making every session personalized.",
    },
    {
      question: "Do you use my data to train the AI?",
      answer:
        "No. SpeakPrep AI does not use your interview data, voice, or transcripts to train any model. Your interactions are used only to generate responses during your session.",
    },
    {
      question: "Are my recordings and data stored permanently?",
      answer:
        "No. Your audio is ephemeral — it exists only during transcription and analysis. You may optionally choose to save session transcripts for later review.",
    },
    {
      question: "Can I see my interview analysis afterwards?",
      answer:
        "Yes. After each interview, you receive a detailed breakdown of your performance — including clarity, tone, structure, and answer quality. You can revisit your analysis anytime from your dashboard.",
    },
    {
      question: "Does SpeakPrep AI support both technical and HR interviews?",
      answer:
        "Absolutely. You can select technical, HR, or mixed mode — the AI adjusts in real time to match the interview type.",
    },
    {
      question: "Do I need a credit card to get started?",
      answer:
        "No. SpeakPrep AI is completely free to use. You only need your Groq API key – nothing else.",
    },
    {
      question: "What personal data is sent with my audio?",
      answer:
        "None. Audio is processed anonymously and is not tied to personal identifiers such as your name, email, or resume data.",
    },
    {
      question: "Do you sell or share my data?",
      answer:
        "Never. SpeakPrep AI does not sell, share, or distribute any user data to third-party vendors, advertisers, or external organizations.",
    },
    {
      question: "How accurate is the AI feedback?",
      answer:
        "The feedback system is designed to mimic real interviewer expectations — clarity, tone, structure, and relevance. While not a replacement for human coaching, it provides highly actionable insights.",
    },
    {
      question: "Which devices and browsers are supported?",
      answer:
        "SpeakPrep AI works best on modern browsers like Chrome, Edge, Brave, and Firefox. Mobile devices are supported, but desktop provides the best experience.",
    },
  ];

  const handleBack = () => router.back();

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: platformColors.mainBackground }}
    >
      {/* Navbar */}
      <nav
        className="w-full flex items-center justify-between px-8 py-4 border-b border-black/10 shadow-sm sticky top-0 z-50"
        style={{
          backgroundColor: "#f3f3ef",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-black font-medium hover:text-[#f43e02] transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight"
          style={{ color: "#000" }}
        >
          SpeakPrep<span style={{ color: "#f43e02" }}>AI</span>
        </Link>

        <div className="w-[60px]" />
      </nav>

      {/* FAQ Content */}
      <div className="max-w-3xl w-full px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-4 text-black">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-gray-900 mb-10">
          Clear answers about how SpeakPrep AI works, how your data is handled,
          and what to expect.
        </p>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border rounded-lg shadow-sm transition-all overflow-hidden"
                style={{
                  backgroundColor: platformColors.outerMainBackground,
                  borderColor: platformColors.borderColor,
                }}
              >
                {/* Question */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left"
                >
                  <span
                    className="font-medium text-gray-800 text-lg"
                    style={{ color: "black" }}
                  >
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={20} className="text-[#f43e02]" />
                  ) : (
                    <ChevronDown size={20} className="text-[#f43e02]" />
                  )}
                </button>

                {/* Answer */}
                <div
                  className={`px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t transition-all duration-300 ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                  style={{ borderColor: platformColors.borderColor }}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Didn’t find what you were looking for?{" "}
            <span className="text-orange-500 cursor-pointer hover:underline">
              Contact Support
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
