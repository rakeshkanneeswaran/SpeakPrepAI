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
          Your data belongs to you. SpeakPrep AI’s mission is simple — help you
          practice confidently while keeping your information private,
          protected, and never used for anything beyond your session.
        </p>
      </section>

      {/* Why Privacy Matters */}
      <section className="px-6 md:px-24 py-20 bg-[#111] border-t border-[#E6DCAF]/10">
        <div className="max-w-4xl mx-auto space-y-8 text-center md:text-left">
          <h2 className="text-3xl font-semibold text-[#E6DCAF]">
            Why Privacy Matters to Us
          </h2>
          <p className="text-white/80 text-[15px] leading-relaxed max-w-3xl">
            Interview preparation often involves personal experiences, career
            history, and voice interaction. We believe these sensitive moments
            should never become analytics, datasets, or training material. Every
            design choice — from processing workflows to system architecture —
            prioritizes user privacy from the ground up.
          </p>
        </div>
      </section>

      {/* Core Security Pillars */}
      <section className="py-24 px-6 md:px-20 bg-black">
        <div className="max-w-6xl mx-auto space-y-12">
          <h2 className="text-4xl font-semibold text-center text-[#E6DCAF] mb-4">
            Our Core Security Principles
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "End-to-End Encryption",
                desc: "All data in motion uses TLS 1.3, and data at rest is encrypted using AES-256. Your inputs remain protected from the moment they leave your device.",
              },
              {
                title: "Ephemeral Voice Data",
                desc: "Voice input is processed securely in real time and not retained after analysis. No audio is stored, archived, or reused.",
              },
              {
                title: "Zero Retention by Default",
                desc: "Your interview activity is temporary unless you intentionally choose to save it. Your sessions exist only for as long as you’re actively using them.",
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
        </div>
      </section>

      {/* Technical Security */}
      <section className="bg-[#111111] text-white py-24 px-6 md:px-20">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <h2 className="text-4xl font-semibold text-[#E6DCAF]">
            Under the Hood
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto text-[15px] leading-relaxed">
            Behind the scenes, SpeakPrep AI uses a modern security-first
            architecture. Every request flows through protected gateways, strict
            rate limits, and isolated model environments — ensuring that user
            inputs remain separated, secure, and auditable.
          </p>

          <div className="grid md:grid-cols-3 gap-10 pt-12 text-left">
            {[
              {
                title: "Secure API Boundaries",
                desc: "Requests are authenticated using short-lived tokens and protected behind DDoS-resistant gateways.",
              },
              {
                title: "Role-Based Access",
                desc: "Internal services follow the principle of least privilege, ensuring minimal permissions and controlled access.",
              },
              {
                title: "In-Memory Processing",
                desc: "Audio, transcripts, and AI outputs are handled in-memory and never written to disk or stored in persistent logs.",
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
            Built for Global Privacy Standards
          </h2>
          <p className="text-white/80 text-[15px] leading-relaxed">
            SpeakPrep AI aligns with major international data regulations,
            including <strong>GDPR</strong>, <strong>CCPA</strong>, and{" "}
            <strong>India’s Digital Personal Data Protection Act (2023)</strong>
            . Users may request data removal or account deletion at any time,
            and verified requests are honored within 48 hours.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#E6DCAF] py-20 text-center px-6 md:px-20 text-black">
        <h2 className="text-4xl font-semibold mb-4">
          Privacy isn’t a feature — it’s our foundation.
        </h2>
        <p className="text-black/80 mb-8 max-w-2xl mx-auto text-[15px] leading-relaxed">
          SpeakPrep AI is built so you can practice freely. No data mining, no
          profiling, no hidden agendas — just secure, real-time interview
          preparation designed for you.
        </p>
        <Link href="/login">
          <button className="bg-black text-[#E6DCAF] font-semibold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform">
            Start Practicing Securely
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
