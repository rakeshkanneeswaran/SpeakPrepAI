"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main
      className="min-h-screen bg-[#0c0c0c] text-white"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#0c0c0c]/90 backdrop-blur-sm border-b border-white/10">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-24 bg-black text-center px-6 md:px-20">
        <h1 className="text-6xl font-bold text-[#E6DCAF] mb-6">
          Privacy. Security. Trust.
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Your data is yours — always. We’re here to help you prepare, not to
          collect, profile, or profit from what you share. Every design choice
          we make starts with privacy.
        </p>
      </section>

      {/* Philosophy Section */}
      <section className="px-6 md:px-24 py-20 bg-[#111] border-t border-[#E6DCAF]/10">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-3xl font-semibold text-[#E6DCAF]">
            Our Security Philosophy
          </h2>
          <p className="text-white/80 text-[15px] leading-relaxed">
            SpeakPrep AI is built on a simple principle — privacy should be as
            strong as performance. Every interaction, from your voice to your
            feedback, is encrypted, anonymized, and never used for model
            training or analytics. We operate with a zero-trust architecture,
            meaning every internal service must verify its access before any
            data moves.
          </p>
        </div>
      </section>

      {/* Core Security Pillars */}
      <section className="py-24 px-6 md:px-20 bg-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              title: "End-to-End Encryption",
              desc: "All data in motion is protected using TLS 1.3, and data at rest is secured with AES-256 encryption. You choose what to upload and what to delete — full control stays with you.",
            },
            {
              title: "Ephemeral Voice Data",
              desc: "Your voice recordings never live on our servers. Audio is processed securely in-memory and deleted as soon as analysis finishes — no copies, no archives.",
            },
            {
              title: "Zero Retention by Default",
              desc: "Interview sessions are temporary by design. Once your session ends, both audio and transcript data are erased automatically unless you explicitly choose to save them.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-[#141414] p-8 rounded-2xl border border-[#E6DCAF]/20 hover:border-[#E6DCAF]/60 hover:-translate-y-1 transition"
            >
              <h3 className="text-xl font-semibold text-[#E6DCAF] mb-3">
                {card.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Security */}
      <section className="bg-[#111111] text-white py-24 px-6 md:px-20">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-semibold text-[#E6DCAF]">
            Under the Hood
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto text-[15px] leading-relaxed">
            Every request to SpeakPrep AI passes through secure API gateways,
            DDoS protection, and strict rate limits. Model interactions are
            sandboxed and isolated, so data from one user can never overlap with
            another. Access is verified through short-lived keys, backed by
            real-time audit logs and internal monitoring.
          </p>

          <div className="grid md:grid-cols-3 gap-10 pt-12 text-left">
            {[
              {
                title: "Secure APIs",
                desc: "JWT-based authentication, short-lived tokens, and rotating access keys keep your data safe and verifiable end-to-end.",
              },
              {
                title: "Role-Based Access",
                desc: "Only verified internal services can request limited access. Even within our systems, permissions are minimal by default.",
              },
              {
                title: "In-Memory Processing",
                desc: "All intermediate data — including audio, transcripts, and AI analysis — is processed in volatile memory and never written to disk.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl bg-[#0c0c0c] border border-[#E6DCAF]/20 shadow-sm hover:border-[#E6DCAF]/60 hover:-translate-y-1 transition"
              >
                <h3 className="text-lg font-semibold text-[#E6DCAF] mb-2">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-24 px-6 md:px-20 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-4xl font-semibold text-[#E6DCAF]">
            Global Standards, Local Care
          </h2>
          <p className="text-white/80 text-[15px] leading-relaxed">
            SpeakPrep AI complies with <strong>GDPR</strong>,{" "}
            <strong>CCPA</strong>, and{" "}
            <strong>India’s Digital Personal Data Protection Act (2023)</strong>
            . You can request full data deletion anytime — we process verified
            requests within 48 hours.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#E6DCAF] py-20 text-center px-6 md:px-20 text-black">
        <h2 className="text-4xl font-semibold mb-4">
          Privacy isn’t a feature — it’s our foundation.
        </h2>
        <p className="text-black/80 mb-8 max-w-2xl mx-auto text-[15px]">
          Your voice and data are processed in real time, securely, and never
          stored. Once your session ends, everything is erased — permanently.
        </p>
        <Link href="/auth">
          <button className="bg-black text-[#E6DCAF] font-semibold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform">
            Get Started for Free
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-white/60 py-10 bg-[#0c0c0c] border-t border-[#E6DCAF]/20">
        © {new Date().getFullYear()} SpeakPrep AI · Privacy First. Always.
      </footer>
    </main>
  );
}
