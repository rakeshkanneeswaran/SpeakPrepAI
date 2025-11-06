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
        "SpeakPrep AI is an AI-powered mock interview and coaching platform that simulates real interview scenarios, helping candidates practice and improve their communication and problem-solving skills.",
    },
    {
      question: "How are the interview questions generated?",
      answer:
        "Our system uses advanced large language models (LLMs) trained on real-world interview patterns. The AI tailors each question based on your resume, job description, and previous answers.",
    },
    {
      question: "Are my recordings and data stored securely?",
      answer:
        "Yes. All user data, including audio responses and interview details, are processed securely. We only store essential session information to enhance your experience.",
    },
    {
      question: "Can I retake or revisit previous interviews?",
      answer:
        "Absolutely. Your recent sessions are saved and accessible from the sidebar under 'Recent Sessions'. You can review, analyze, or restart any past session at any time.",
    },
    {
      question: "Does SpeakPrep AI support both technical and HR interviews?",
      answer:
        "Yes. You can choose between technical, HR, or mixed interview modes, and the AI will adapt the flow accordingly to mimic real interview conditions.",
    },
    {
      question: "Are my audio files stored permanently?",
      answer:
        "No. Your audio recordings are used solely for transcription and analysis purposes during your session. We do not permanently store your audio files after the transcription is complete.",
    },
    {
      question: "What personal information is sent with my audio recordings?",
      answer:
        "We do not send any personally identifiable information with your audio recordings. The audio is processed anonymously for transcription and analysis only.",
    },
    {
      question: "Do you sell my data to third parties or advertisers?",
      answer:
        "Absolutely not. We do not sell, share, or distribute your personal data, interview responses, or any other information to third-party vendors, advertisers, or any external organizations.",
    },
    {
      question: "How long do you keep my interview data?",
      answer:
        "We only retain your interview session data for as long as necessary to provide you with the service and allow you to review your previous sessions. You can delete your session history at any time.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Yes. All payment processing is handled through secure, PCI-compliant third-party payment processors. We do not store your credit card or payment information on our servers.",
    },
    {
      question: "Can I export or download my interview data?",
      answer:
        "Yes. You can export your interview transcripts and feedback reports from your dashboard. This allows you to keep a personal record of your progress and insights.",
    },
    {
      question: "What measures are in place to protect my privacy?",
      answer:
        "We employ industry-standard encryption, secure data transmission protocols, and strict access controls. Our privacy-first approach ensures your data is used only to enhance your interview preparation experience.",
    },
  ];

  const handleBack = () => {
    // Go back to the previous page in history
    router.back();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: platformColors.mainBackground }}
    >
      {/* ✅ Custom Navbar */}
      <nav
        className="w-full flex items-center justify-between px-8 py-4 border-b border-black/10 shadow-sm"
        style={{
          backgroundColor: "#f3f3ef",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {/* Left: Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-black font-medium hover:text-[#f43e02] transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Center: Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight text-center"
          style={{
            color: "#000",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          SpeakPrep<span style={{ color: "#f43e02" }}>AI</span>
        </Link>

        {/* Right: Empty for symmetry */}
        <div className="w-[60px]" />
      </nav>

      {/* ✅ FAQ Content */}
      <div className="max-w-3xl w-full px-6 py-12">
        {/* Header */}
        <h1
          className="text-3xl font-bold text-center mb-4"
          style={{ color: "black" }}
        >
          Frequently Asked Questions
        </h1>
        <p className="text-center text-gray-900 mb-10">
          Get quick answers about how SpeakPrep AI works and how we protect your
          privacy.
        </p>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-sm transition-all"
              style={{
                backgroundColor: platformColors.outerMainBackground,
                borderColor: platformColors.borderColor,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center px-5 py-3 text-left"
              >
                <span
                  className="font-medium text-gray-800"
                  style={{ color: "black" }}
                >
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp size={18} className="text-orange-500" />
                ) : (
                  <ChevronDown size={18} className="text-orange-500" />
                )}
              </button>

              {openIndex === index && (
                <div
                  className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t"
                  style={{ borderColor: platformColors.borderColor }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Didn't find what you were looking for?{" "}
            <span className="text-orange-500 cursor-pointer hover:underline">
              Contact Support
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
