"use client";

import { Check } from "lucide-react";
import Navbar from "../components/Navbar";

export default function PricingPage() {
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
          Whether you're prepping for a single interview or practicing daily,
          pick the plan that fits your workflow. Same powerful features —
          different billing models.
        </p>
      </section>

      {/* PRICING GRID */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-20 pb-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* BYOK PLAN */}
          <div className="relative bg-white border border-black/10 rounded-2xl p-8 shadow-sm hover:-translate-y-1 transition">
            {/* Badge */}
            <div className="absolute top-4 right-4 bg-[#fff7ef] text-[#f07a2b] px-3 py-1 rounded-full text-xs font-semibold border border-[#ffe6d0]">
              Dev Friendly
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Bring Your Own API Key
            </h3>

            <p className="text-black/70 mb-4 text-sm md:text-base">
              Use your own Groq key — we orchestrate the flows. Unlimited
              practice powered by your quota.
            </p>

            {/* PRICE */}
            <div className="flex items-baseline gap-3 mb-2">
              <div className="text-5xl font-bold">$5</div>
              <div className="text-sm text-black/60 self-end">per month</div>
            </div>

            <p className="text-black/60 mb-6 text-sm">
              Connect your Groq API key and pay Groq for usage. We provide the
              platform and UX.
            </p>

            {/* FEATURES */}
            <ul className="space-y-4 text-black/80 text-sm md:text-base mb-10">
              {[
                "Unlimited interview sessions (depends on your key limits)",
                "Use your own Groq API key",
                "Technical, HR & Behavioral interview modes",
                "Post-interview AI analysis & scoring",
                "Resume + Job Description-driven interview flow",
                "Voice-based mock interview experience",
                "Full access to all features and updates",
                "Detailed AI analysis and scoring after every interview",
                "Voice processing, transcripts & session history",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border border-[#f43e02] flex items-center justify-center">
                    <Check size={14} color="#f43e02" strokeWidth={3} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a href="/login">
              <button className="w-full bg-[#f43e02] text-white font-semibold py-3 rounded-lg hover:scale-105 transition">
                Connect & Subscribe — $5/month
              </button>
            </a>
          </div>

          {/* STANDARD PLAN */}
          <div className="relative bg-black text-white rounded-2xl p-8 border border-black shadow-sm hover:-translate-y-1 transition">
            {/* Badge */}
            <div className="absolute top-4 right-4 bg-yellow-50 text-[#b07b00] px-3 py-1 rounded-full text-xs font-semibold border border-[#fff2cc]">
              Managed & Reliable
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Standard Plan
            </h3>

            <p className="text-white/70 mb-4 text-sm md:text-base">
              No API keys required — we handle the backend. Buy credits and use
              on demand with predictable costs.
            </p>

            {/* PRICE */}
            <div className="flex items-baseline gap-3 mb-2">
              <div className="text-5xl font-bold">$12</div>
              <div className="text-sm text-white/60 self-end">
                one-time · 50 credits
              </div>
            </div>

            <p className="text-white/60 mb-6 text-sm">
              We run the inference on our managed backend. Each interview uses
              one credit.
            </p>

            {/* FEATURES */}
            <ul className="space-y-4 text-white/80 text-sm md:text-base mb-10">
              {[
                "50 interview credits included",
                "No API key required",
                "High-speed managed backend (handled by us)",
                "1 interview session = 1 credit",
                "Technical, HR & Behavioral interview modes",
                "Resume + Job Description-driven interview flow",
                "Recharge anytime when credits run out",
                "Full access to all features and updates",
                "Detailed AI analysis and scoring after every interview",
                "Voice processing, transcripts & session history",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border border-[#FFD700] flex items-center justify-center">
                    <Check size={14} color="#FFD700" strokeWidth={3} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a href="/login">
              <button className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:scale-105 transition">
                Buy 50 Credits — $12
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* CREDIT SYSTEM EXPLANATION */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-20 pb-24">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-3xl mx-auto shadow-sm">
          <h3 className="text-xl md:text-2xl font-semibold mb-4">
            How Credits & BYOK Work
          </h3>

          <ul className="space-y-3 text-black/80 text-sm md:text-base">
            <li>
              • <strong>One interview session = one credit</strong>.
            </li>
            <li>
              • Credits do <strong>not expire</strong> — use them anytime.
            </li>
            <li>
              • <strong>BYOK:</strong> Connect your Groq API key and the
              inference billing is charged to your key. We provide the platform
              and UI.
            </li>
            <li>
              • <strong>Standard:</strong> We run the inference using our
              managed Groq account — you buy credits and we consume them on your
              behalf.
            </li>
            <li>• No hidden fees. No surprise usage charges.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
