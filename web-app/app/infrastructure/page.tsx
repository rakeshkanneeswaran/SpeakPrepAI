"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { Server, Cloud, Lock, Zap, Database } from "lucide-react";
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

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 md:px-20 py-20 text-center relative overflow-hidden">
        <h1 className="text-5xl font-bold mb-4">
          Reliable, Scalable Infrastructure
        </h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto mb-10">
          SpeakPrep AI runs on a modern, containerized backend built for speed
          and reliability. Every user request is handled by independent workers
          that scale automatically in parallel.
        </p>

        <div className="flex justify-center mb-10">
          <dotlottie-wc
            src="https://lottie.host/9236abad-1220-45be-9b64-acfa7906fae3/zOSwQbVxA3.lottie"
            style={{ width: "320px", height: "320px" }}
            autoplay
            loop
          ></dotlottie-wc>
        </div>

        <p className="text-sm text-black/60 max-w-md mx-auto">
          When traffic spikes, our FastAPI microservices automatically spin up
          new workers. Each interview runs in an isolated container, ensuring
          consistent performance and zero cross-session interference.
        </p>
      </section>

      {/* Core Architecture */}
      <section className="px-6 md:px-20 py-16 bg-white border-t border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-12">
          How SpeakPrep AI Scales
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          {[
            {
              icon: (
                <Cloud size={38} strokeWidth={2.5} className="mx-auto mb-3" />
              ),
              title: "Deployed on Google Cloud Run",
              desc: "Our AI microservice runs in a serverless containerized setup that scales up or down instantly based on demand.",
            },
            {
              icon: (
                <Server size={38} strokeWidth={2.5} className="mx-auto mb-3" />
              ),
              title: "Parallel FastAPI Workers",
              desc: "Each user session is handled by its own FastAPI worker process, enabling concurrent interviews without bottlenecks.",
            },
            {
              icon: (
                <Zap size={38} strokeWidth={2.5} className="mx-auto mb-3" />
              ),
              title: "Groq LPU Acceleration",
              desc: "We use Groq’s ultra-low latency inference engine to deliver real-time AI responses for an authentic interview feel.",
            },
            {
              icon: (
                <Lock size={38} strokeWidth={2.5} className="mx-auto mb-3" />
              ),
              title: "End-to-End Privacy",
              desc: "Your resume and responses are processed securely. No data is shared or reused — sessions live only as long as your interview.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-[#f3f3ef] rounded-xl p-6 border border-black/10 hover:shadow-md transition"
            >
              {item.icon}
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-black/70 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Redis Section */}
      <section className="px-6 md:px-20 py-20 bg-[#111] text-[#E6DCAF]">
        <div className="max-w-5xl mx-auto text-center">
          <Database size={48} strokeWidth={2.5} className="mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">
            Real-Time State Management with Redis
          </h2>
          <p className="text-[#E6DCAF]/90 max-w-3xl mx-auto text-base leading-relaxed mb-10">
            At the heart of our infrastructure lies Redis — a lightning-fast,
            in-memory data store that tracks every user’s interview state in
            real time. Each session, question, and response is cached instantly,
            allowing smooth recovery, seamless continuity, and zero latency
            between turns.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {[
              {
                title: "Blazing-Fast Access",
                desc: "Session data is retrieved in milliseconds, ensuring no delay between AI questions and your answers.",
              },
              {
                title: "Ephemeral by Design",
                desc: "Data lives only for the duration of your interview session — then it’s automatically cleared for privacy.",
              },
              {
                title: "Global Reliability",
                desc: "Redis handles thousands of concurrent sessions safely, providing consistent uptime across every user.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-[#1b1b1b] border border-[#E6DCAF]/20 rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(230,220,175,0.15)] transition"
              >
                <h3 className="text-lg font-semibold mb-2 text-[#E6DCAF]">
                  {card.title}
                </h3>
                <p className="text-sm text-[#E6DCAF]/80">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-20 bg-black text-center text-[#E6DCAF]">
        <h2 className="text-3xl font-semibold mb-6">
          Built for Performance. Ready for Scale.
        </h2>
        <p className="text-white/80 max-w-xl mx-auto mb-10">
          Our infrastructure adapts to your usage — whether you’re a single
          learner or a university conducting hundreds of interviews in parallel.
        </p>
        <Link href="/early-access">
          <button
            className="text-black text-lg px-8 py-3 rounded-md font-semibold hover:scale-105 transition-transform"
            style={{ backgroundColor: "#E6DCAF" }}
          >
            Join Early Access
          </button>
        </Link>
      </section>
    </main>
  );
}
