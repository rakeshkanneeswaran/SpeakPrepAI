"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { Lock, Database } from "lucide-react";
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
        <p className="text-lg text-black/70 max-w-2xl mx-auto mb-10">
          SpeakPrep AI runs on a transparent infrastructure — built for speed,
          scale, and stability. You don’t just use our system, you understand
          how it works. No hidden limits. No guessing. Just clear performance
          you can see and trust.
        </p>

        <Image
          src="/datacenter-server-cloud-computing-isometric-interior-composition.png"
          alt="Datacenter infrastructure illustration"
          width={640}
          height={480}
          className="w-[280px] sm:w-[360px] md:w-[480px] lg:w-[600px] h-auto mb-6 rounded-xl transition-all duration-300"
        />

        <p className="text-sm text-black/60 max-w-md mx-auto mt-4">
          We believe great technology should be open — so we show you how our
          system scales, secures, and performs in real time.
        </p>
      </section>

      {/* Transparent Infrastructure */}
      <section className="px-6 md:px-20 py-20 bg-black text-[#E6DCAF] text-center">
        <Database size={48} className="mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-6">Built to Be Seen</h2>
        <p className="text-[#E6DCAF]/90 max-w-3xl mx-auto mb-10">
          Our infrastructure isn’t a mystery box. SpeakPrep AI runs on{" "}
          <span className="font-semibold text-[#E6DCAF]">Google Cloud Run</span>{" "}
          for scalable, containerized performance — and uses{" "}
          <span className="font-semibold text-[#E6DCAF]">Redis</span> to
          maintain real-time context during interviews. Everything is designed
          to be clear, reliable, and transparent from the ground up.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {[
            {
              title: "Real-Time Insight",
              desc: "Every interview runs with full transparency — no throttling, no hidden scaling.",
            },
            {
              title: "Cloud Run at Core",
              desc: "Google Cloud Run powers our backend, automatically scaling with traffic in seconds.",
            },
            {
              title: "Redis Context Engine",
              desc: "Redis keeps track of your ongoing session in real time — ensuring smooth, continuous conversations.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-[#1b1b1b] border border-[#E6DCAF]/20 rounded-xl p-6 hover:-translate-y-1 transition"
            >
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-[#E6DCAF]/80">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="px-6 md:px-20 py-20 bg-white text-center">
        <Lock size={48} className="mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-6">Your Data. Your Control.</h2>
        <p className="text-black/70 max-w-3xl mx-auto mb-12">
          We treat privacy as part of performance. Data is encrypted, temporary,
          and never shared.
        </p>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-20 bg-black text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 text-[#E6DCAF]">
            Your Next Career Breakthrough Starts Here
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Practice with AI that understands real interviews. Get personalized
            feedback, build confidence, and land your dream job faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link href="/auth">
              <button className="bg-[#E6DCAF] text-black text-lg px-16 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-2xl hover:shadow-[#E6DCAF]/30">
                Start Your Journey
              </button>
            </Link>
          </div>

          <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              No credit card required
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Setup in less than 2 minutes
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
