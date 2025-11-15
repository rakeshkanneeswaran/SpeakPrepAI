"use client";

import Navbar from "../components/Navbar";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { changelog } from "./changelog";

export default function ChangelogPage() {
  return (
    <main
      className="min-h-screen bg-[#f3f3ef] text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 md:px-20 py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Changelog</h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
          Every improvement, update, and upgrade — transparently documented.
          SpeakPrepAI evolves constantly to deliver a smoother, smarter, and
          more realistic interview experience.
        </p>
      </section>

      {/* Timeline */}
      <section className="px-6 md:px-20 pb-32 max-w-4xl mx-auto">
        <div className="space-y-12 relative border-l-2 border-black/20 pl-6">
          {changelog.map((entry, index) => (
            <div key={index} className="relative">
              {/* Timeline Icon */}
              <CalendarDays
                size={24}
                className="absolute -left-12 top-1 text-[#f43e02]"
              />

              {/* Date */}
              <h3 className="text-xl font-bold">{entry.date}</h3>

              {/* Title */}
              <p className="text-lg font-semibold text-black mt-1">
                {entry.title}
              </p>

              {/* Bullet Items */}
              <ul className="mt-3 space-y-2 text-black/80">
                {entry.items.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="text-[#f43e02] mt-1" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Tag */}
              <span className="inline-block mt-4 px-3 py-1 text-xs font-medium bg-black text-white rounded-full">
                {entry.tag}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
