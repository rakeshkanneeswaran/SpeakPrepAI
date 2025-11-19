"use client";

import { useEffect, useState, useMemo } from "react";
import { Check } from "lucide-react";
import Navbar from "../components/Navbar";

export default function PricingPage() {
  const [country, setCountry] = useState<"IN" | "OTHER" | "LOADING">("LOADING");

  // Detect country from IP
  useEffect(() => {
    async function fetchCountry() {
      try {
        const res = await fetch("https://ipwho.is/");
        const data = await res.json();

        if (data?.country_code === "IN") {
          setCountry("IN");
        } else {
          setCountry("OTHER");
        }
      } catch (e) {
        console.log("Failed to fetch country", e);
        setCountry("OTHER"); // fallback
      }
    }

    fetchCountry();
  }, []);

  const isIndia = country === "IN";

  // Updated Pricing Logic (India Optimized)
  const PRICES = useMemo(
    () => ({
      BYOK: {
        amount: isIndia ? "₹149" : "$2",
        original: isIndia ? "₹199" : "$4",
        subtitle: "per month",
        cta: isIndia
          ? "Start Unlimited Practice — ₹149/month"
          : "Start Unlimited Practice — $2/month",
      },
      STANDARD: {
        amount: isIndia ? "₹499" : "$6",
        subtitle: isIndia ? "one-time · 25 credits" : "one-time · 50 credits",
        cta: isIndia ? "Buy 25 Credits — ₹499" : "Buy 50 Credits — $6",
      },
    }),
    [isIndia]
  );

  return (
    <main
      className="min-h-screen bg-[#f3f3ef] text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Navbar />

      {/* HEADER */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-20 py-16 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent Pricing
        </h1>

        <p className="text-base sm:text-lg text-black/70 max-w-2xl mx-auto px-4">
          Practice unlimited interviews or pay only for what you need — clear,
          honest pricing that fits every learner’s budget.
        </p>
      </section>

      {/* PRICING GRID */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-20 pb-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* UNLIMITED PRACTICE PLAN */}
          <div className="relative bg-white border border-black/10 rounded-2xl p-8 shadow-sm hover:-translate-y-1 transition">
            <div className="absolute top-4 right-4 bg-[#fff7ef] text-[#f07a2b] px-3 py-1 rounded-full text-xs font-semibold border border-[#ffe6d0]">
              Best Value
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-1">
              Unlimited Practice Plan
            </h3>

            {/* INDIA SPECIAL OFFER (only for IN users) */}
            {isIndia && (
              <div className="flex items-center gap-2 text-sm mb-3">
                <span className="text-black/50 line-through">₹199</span>
                <span className="text-[#f43e02] font-bold">₹149/month</span>
                <span className="text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                  India Pricing
                </span>
              </div>
            )}

            <p className="text-black/70 mb-4 text-sm md:text-base">
              Practice as much as you want using your own Groq API key —
              extremely low cost and perfect for regular learners.
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <div className="text-5xl font-bold">
                {country === "LOADING" ? "..." : PRICES.BYOK.amount}
              </div>
              <div className="text-sm text-black/60 self-end">
                {PRICES.BYOK.subtitle}
              </div>
            </div>

            {/* SECURITY */}
            <p className="text-black/60 text-sm mb-6">
              Your Groq API key is encrypted before it reaches our servers. Even
              we cannot view or decrypt it. It’s used only during your interview
              sessions.
            </p>

            {/* Features */}
            <ul className="space-y-4 text-black/80 text-sm md:text-base mb-10">
              {[
                "Unlimited interview sessions",
                "Use your own Groq key — extremely low-cost learning",
                "Technical, HR & Behavioral interview modes",
                "Smart follow-up questions (real-interviewer style)",
                "Detailed improvement feedback after every session",
                "Resume + Job Description-based questions",
                "Voice-based interview experience",
                "Save transcripts & revisit past interviews",
                "Full access to all new features",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border border-[#f43e02] flex items-center justify-center">
                    <Check size={14} color="#f43e02" strokeWidth={3} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a href="/login">
              <button className="w-full bg-[#f43e02] text-white font-semibold py-3 rounded-lg hover:scale-105 transition">
                {country === "LOADING" ? "Loading..." : PRICES.BYOK.cta}
              </button>
            </a>
          </div>

          {/* CREDITS PACK — REDUCED TO 25 CREDITS FOR INDIA */}
          <div className="relative bg-black text-white rounded-2xl p-8 border border-black shadow-sm hover:-translate-y-1 transition">
            <div className="absolute top-4 right-4 bg-yellow-50 text-[#b07b00] px-3 py-1 rounded-full text-xs font-semibold border border-[#fff2cc]">
              One-Time Purchase
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Credits Pack
            </h3>

            <p className="text-white/70 mb-4 text-sm md:text-base">
              No monthly subscription. Buy credits and use them whenever you
              need a mock interview.
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <div className="text-5xl font-bold">
                {country === "LOADING" ? "..." : PRICES.STANDARD.amount}
              </div>
              <div className="text-sm text-white/60 self-end">
                {PRICES.STANDARD.subtitle}
              </div>
            </div>

            <p className="text-white/60 mb-6 text-sm">
              Each credit = one complete interview session powered by our
              high-speed managed backend.
            </p>

            {/* Features */}
            <ul className="space-y-4 text-white/80 text-sm md:text-base mb-10">
              {[
                isIndia
                  ? "25 mock interview credits"
                  : "50 mock interview credits",
                "No API key required",
                "Runs on our fast managed backend",
                "Technical, HR & Behavioral interviews",
                "Resume + JD–based questions",
                "Detailed improvement feedback",
                "Voice-based interview experience",
                "Save and review past sessions",
                "Recharge anytime",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-[#FFD700] flex items-center justify-center">
                    <Check size={14} color="#FFD700" strokeWidth={3} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a href="/login">
              <button className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:scale-105 transition">
                {country === "LOADING" ? "Loading..." : PRICES.STANDARD.cta}
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* CREDIT SYSTEM EXPLANATION */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-20 pb-24">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-3xl mx-auto shadow-sm">
          <h3 className="text-xl md:text-2xl font-semibold mb-4">
            How Credits & Unlimited Plans Work
          </h3>

          <ul className="space-y-3 text-black/80 text-sm md:text-base">
            <li>
              • <strong>1 interview = 1 credit</strong>.
            </li>
            <li>• Credits never expire — use anytime.</li>
            <li>
              • <strong>Unlimited Plan:</strong> Best for regular practice.
            </li>
            <li>
              • <strong>Credits Pack:</strong> Best for occasional learners.
            </li>
            <li>• Zero hidden fees. No surprise charges.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
