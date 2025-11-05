"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "../components/Navbar";

export default function PricingPage() {
  return (
    <main
      className="min-h-screen bg-[#f3f3ef] text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Navbar />

      <section className="px-6 md:px-20 py-24">
        <section className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-black/70 max-w-2xl mx-auto">
            Choose between our Bring Your Own API plan or our fully managed
            credit-based system. Both give you access to the same AI interview
            intelligence — it’s just about how much control you want.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          <div className="bg-white border border-black rounded-xl p-10 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition">
            <div>
              <h2 className="text-3xl font-bold mb-3">
                BYOA (Bring Your Own API)
              </h2>
              <p className="text-black/70 mb-6">
                Connect your own OpenAI or Groq API key. You control the
                infrastructure — we handle the platform.
              </p>

              <ul className="space-y-4 text-sm text-black/80">
                {[
                  "Use your own API keys and manage costs directly",
                  "Fast and low-latency mock interviews",
                  "Instant feedback and real-time interview analysis",
                  "Target company insights with deeper AI understanding",
                  "Your API key, your data, your control",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border border-[#f43e02] flex items-center justify-center">
                      <Check size={14} color="#f43e02" strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 text-center">
              <p className="text-4xl font-bold mb-2">
                $5<span className="text-lg font-medium">/month</span>
              </p>
              <p className="text-sm text-black/60 mb-6">
                Platform access only — API usage billed separately
              </p>
              <Link href="/early-access">
                <button
                  className="text-white text-lg px-8 py-3 rounded-md font-semibold hover:scale-105 transition-transform"
                  style={{ backgroundColor: "#f43e02" }}
                >
                  Join Early Access
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-black text-white border border-black rounded-xl p-10 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition">
            <div>
              <h2 className="text-3xl font-bold mb-3 text-[#E6DCAF]">
                Managed AI (Credit-Based)
              </h2>
              <p className="text-white/80 mb-6">
                Fully managed by SpeakPrep — no setup, no API keys, no
                complexity. Just buy credits and start practicing instantly.
              </p>

              <ul className="space-y-4 text-sm text-white/80">
                {[
                  "Credit-based AI interview sessions",
                  "Fast and low-latency mock interviews",
                  "Instant feedback and detailed interview analysis",
                  "Target company insights powered by advanced AI",
                  "End-to-end encryption and managed infrastructure",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border border-[#E6DCAF] flex items-center justify-center">
                      <Check size={14} color="#E6DCAF" strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 text-center">
              <p className="text-4xl font-bold mb-2 text-[#E6DCAF]">
                $15/month
              </p>
              <p className="text-sm text-white/60 mb-6">Includes 100 credits</p>
              <Link href="/early-access">
                <button
                  className="text-black text-lg px-8 py-3 rounded-md font-semibold hover:scale-105 transition-transform"
                  style={{ backgroundColor: "#E6DCAF" }}
                >
                  Get Early Access
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="text-center mt-24 text-black/70 max-w-2xl mx-auto">
          <p className="text-sm">
            💡 SpeakPrep AI is currently invite-only. Join early access to
            receive your login credentials by email.
          </p>
        </section>
      </section>
    </main>
  );
}
