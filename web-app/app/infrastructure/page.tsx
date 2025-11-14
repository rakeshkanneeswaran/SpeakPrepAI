"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { Lock, Database, Server, Zap } from "lucide-react";
import { useEffect } from "react";

export default function InfrastructurePage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js";
    script.type = "module";
    document.body.appendChild(script);
  }, []);

  return (
    <main
      className="min-h-screen bg-[#f3f3ef] text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 md:px-20 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Reliable. Fast. Transparent.
        </h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          SpeakPrep AI is engineered for speed, scale, and stability — with
          clear, transparent infrastructure you can trust. No mystery systems.
          No hidden limits. Just world-class performance powering every
          interview.
        </p>

        <Image
          src="/datacenter-server-cloud-computing-isometric-interior-composition.png"
          alt="Datacenter infrastructure illustration"
          width={640}
          height={480}
          className="w-[280px] sm:w-[360px] md:w-[480px] lg:w-[600px] h-auto mb-6 rounded-xl"
        />

        <p className="text-sm text-black/60 max-w-md mx-auto mt-4">
          Great technology should be open. Here's exactly how SpeakPrep AI
          delivers real-time interview performance — at scale.
        </p>
      </section>

      {/* Why Infrastructure Matters */}
      <section className="px-6 md:px-20 py-20 bg-white text-center border-t border-black/10">
        <Server size={48} className="mx-auto mb-6 text-[#f43e02]" />
        <h2 className="text-3xl font-bold mb-6">Why Infrastructure Matters</h2>
        <p className="text-black/70 max-w-3xl mx-auto leading-relaxed">
          Interview practice demands reliable audio processing, fast model
          responses, and real-time session handling. That’s why we use
          enterprise-grade infrastructure — so every user experiences smooth,
          uninterrupted performance no matter where they are.
        </p>
      </section>

      {/* Transparent Infrastructure */}
      <section className="px-6 md:px-20 py-20 bg-black text-[#E6DCAF] text-center">
        <Database size={48} className="mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-6">Built to Be Seen</h2>
        <p className="text-[#E6DCAF]/90 max-w-3xl mx-auto mb-10 leading-relaxed">
          SpeakPrep AI runs on{" "}
          <span className="text-[#E6DCAF] font-semibold">Google Cloud Run</span>{" "}
          for automatic scaling, container isolation, and low latency. We use{" "}
          <span className="font-semibold text-[#E6DCAF]">Redis</span> to manage
          real-time context and maintain the flow of your conversation. Our
          architecture is modern, transparent, and optimized for performance
          from the ground up.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {[
            {
              title: "Real-Time Insight",
              desc: "Every interview runs with consistent speed — no throttling, no hidden constraints.",
            },
            {
              title: "Cloud Run at Core",
              desc: "Auto-scales in seconds during peak traffic while keeping latency low worldwide.",
            },
            {
              title: "Redis Context Engine",
              desc: "Maintains session memory across turns for smooth, intelligent conversations.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-[#1b1b1b] border border-[#E6DCAF]/20 rounded-xl p-6 hover:-translate-y-1 transition"
            >
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-[#E6DCAF]/80 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="px-6 md:px-20 py-20 bg-white text-center border-t border-black/10">
        <h2 className="text-3xl font-bold mb-10 text-black">
          Performance You Can Count On
        </h2>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { stat: "99.9%", label: "Uptime" },
            { stat: "<200ms", label: "Median Response Time" },
            { stat: "Global", label: "Auto-Scaling Network" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#f8f8f8] border border-black/10 p-8 rounded-xl shadow-sm"
            >
              <p className="text-4xl font-bold text-[#f43e02]">{item.stat}</p>
              <p className="text-black/70 mt-2 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="px-6 md:px-20 py-20 bg-white text-center">
        <Lock size={48} className="mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-6">Your Data. Your Control.</h2>
        <p className="text-black/70 max-w-3xl mx-auto mb-12 leading-relaxed">
          Data privacy and infrastructure performance go hand-in-hand.
          Encryption, ephemeral processing, and strict access boundaries ensure
          your information remains safe at every step.
        </p>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-20 bg-black text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 text-[#E6DCAF]">
            Your Next Career Breakthrough Starts Here
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Practice with AI that mirrors real interviews. Get clarity,
            structure, and confidence — powered by world-class infrastructure.
          </p>

          <Link href="/auth">
            <button className="bg-[#E6DCAF] text-black text-lg px-16 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-2xl hover:shadow-[#E6DCAF]/30">
              Start Your Journey
            </button>
          </Link>

          <div className="flex justify-center items-center gap-8 text-sm text-gray-400 mt-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Setup in under 2 minutes
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
