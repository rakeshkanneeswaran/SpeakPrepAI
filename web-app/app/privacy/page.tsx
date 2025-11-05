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
      <section className="pt-40 pb-24 text-center px-6 md:px-20">
        <h1 className="text-6xl font-bold text-[#E6DCAF] mb-6">
          Privacy. Security. Trust.
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Your voice, data, and journey belong to you. We exist to help you
          prepare — not to collect, profile, or monetize your personal
          information.
        </p>
      </section>

      {/* Philosophy Section */}
      <section className="px-6 md:px-24 py-20 bg-[#111] border-t border-[#E6DCAF]/10">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-3xl font-semibold text-[#E6DCAF]">
            Our Security Philosophy
          </h2>
          <p className="text-white/80 text-[15px] leading-relaxed">
            SpeakPrep AI was built on the belief that privacy should be as
            strong as performance. Every interaction — from your voice to your
            transcript — is encrypted, anonymized, and never used for model
            training or third-party analytics. We follow a zero-trust
            architecture where each component must verify every access request,
            even within our own systems.
          </p>
        </div>
      </section>

      {/* Core Security Pillars */}
      <section className="py-24 px-6 md:px-20 bg-[#0c0c0c]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              title: "End-to-End Encryption",
              desc: "Data in motion is protected with TLS 1.3, and data at rest is secured using AES-256 encryption. Only you control what gets uploaded or deleted.",
            },
            {
              title: "Ephemeral Voice Data",
              desc: "We never store your voice recordings. All audio is processed securely in-memory during your interview workflow and permanently deleted once analysis is complete.",
            },
            {
              title: "Zero Data Retention by Default",
              desc: "Your interviews are temporary by design. Once a session ends, both audio and transcript data are erased automatically unless you explicitly save them.",
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
            Behind the Scenes
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto text-[15px] leading-relaxed">
            Every request to SpeakPrep AI passes through secured API gateways,
            DDoS protection, and strict rate-limiting layers. Model interactions
            are sandboxed and isolated, ensuring that no data from one user can
            ever influence another. Access is governed by key-based
            authentication and real-time audit trails.
          </p>

          <div className="grid md:grid-cols-3 gap-10 pt-12 text-left">
            {[
              {
                title: "Secure APIs",
                desc: "JWT-based authentication, short-lived tokens, and rotating keys ensure safe, verifiable access at all times.",
              },
              {
                title: "Role-Based Access",
                desc: "Only minimal, verified internal services have access to your data — ensuring the smallest possible attack surface.",
              },
              {
                title: "In-Memory Processing",
                desc: "All temporary data — including audio, transcripts, and feedback — lives only in volatile memory and is never written to disk.",
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
            Global Compliance, Local Care
          </h2>
          <p className="text-white/80 text-[15px] leading-relaxed">
            SpeakPrep AI complies with <strong>GDPR</strong>,{" "}
            <strong>CCPA</strong>, and <strong>India’s DPDP Act (2023)</strong>.
            You can request full data deletion at any time, and we guarantee
            completion within 48 hours of verification.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#E6DCAF] py-20 text-center px-6 md:px-20 text-black">
        <h2 className="text-4xl font-semibold mb-4">
          Privacy isn’t optional — it’s our foundation.
        </h2>
        <p className="text-black/80 mb-8 max-w-2xl mx-auto text-[15px]">
          SpeakPrep AI processes your data securely in real time. We never store
          your audio, and all content is deleted once your session ends —
          permanently.
        </p>
        <Link href="/early-access">
          <button className="bg-black text-[#E6DCAF] font-semibold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform">
            Join Early Access
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
