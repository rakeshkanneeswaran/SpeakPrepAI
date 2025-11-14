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
        "SpeakPrep AI is an AI-powered mock interview platform that simulates realistic interview conversations. You answer questions naturally, and after the session, you receive a detailed AI analysis to help improve structure, clarity, and communication.",
    },
    {
      question: "How does SpeakPrep AI generate interview questions?",
      answer:
        "The system uses advanced language models to create interview questions relevant to your resume and job description. The goal is to give you a natural interview flow, similar to what you’d experience with a human interviewer.",
    },
    {
      question: "Do you use my data to train the AI?",
      answer:
        "No. SpeakPrep AI does not use your interviews, transcripts, or voice data to train any model. Your data is only used during your session to generate responses.",
    },
    {
      question: "Are my recordings and data stored permanently?",
      answer:
        "No. Your audio exists temporarily during transcription and analysis. You can choose whether or not to save transcripts for reviewing later.",
    },
    {
      question: "Can I see my interview analysis afterwards?",
      answer:
        "Yes. After each interview, you receive a detailed performance breakdown — including clarity, structure, tone, and delivery. Your past analyses are available anytime in your dashboard.",
    },
    {
      question: "Does SpeakPrep AI support both technical and HR interviews?",
      answer:
        "Yes. You can select technical, HR, or mixed interviews. The AI conducts the session accordingly to match the type of interview you want to prepare for.",
    },
    {
      question: "Do I need a credit card to get started?",
      answer:
        "No. SpeakPrep AI is free to use. You only need your Groq API key — nothing else.",
    },
    {
      question: "What personal data is sent with my audio?",
      answer:
        "None. Your audio is processed anonymously and is not linked to personal identifiers like your name, email, or resume details.",
    },
    {
      question: "Do you sell or share my data?",
      answer:
        "Never. SpeakPrep AI does not sell, share, or send any of your data to external organizations, advertisers, or third-party vendors.",
    },
    {
      question: "How accurate is the AI feedback?",
      answer:
        "The feedback highlights communication patterns such as clarity, tone, pacing, and structure. While not a replacement for a human coach, it provides highly actionable insights to help you improve.",
    },
    {
      question: "Which devices and browsers are supported?",
      answer:
        "SpeakPrep AI works best on modern browsers such as Chrome, Edge, Brave, and Firefox. You can use mobile devices, but desktop offers the most stable experience.",
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
