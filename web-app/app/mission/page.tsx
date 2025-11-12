"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";

export default function MissionPage() {
  return (
    <main
      className="min-h-screen bg-[#f3f2ef] text-black"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#f3f2ef]/95 backdrop-blur-md">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-20 text-center">
        <h1 className="text-6xl font-bold mb-4">Our Mission</h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto">
          To help every candidate walk into an interview calm, prepared, and
          confident — using the power of real-time, AI-driven practice.
        </p>
      </section>

      {/* Challenge Section */}
      <section className="px-6 md:px-20 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-black/10 p-10 md:p-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-[#f43e02]">
            The Challenge
          </h2>
          <p className="text-black/80 leading-relaxed text-[15px]">
            The job market has never been more competitive — or more uneven. In
            India, only <strong>32%</strong> of job seekers feel ready to face
            an interview{" "}
            <a
              href="https://economictimes.indiatimes.com/jobs/hr-policies-trends/just-one-third-of-job-seekers-consider-themselves-prepared-for-interviews-report/articleshow/121361553.cms"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Economic Times, 2025)
            </a>
            . Globally, just <strong>2–3%</strong> of applicants even reach the
            interview stage{" "}
            <a
              href="https://teamstage.io/job-interview-statistics/"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (TeamStage)
            </a>
            , and some openings receive 250+ applications per role{" "}
            <a
              href="https://resume.io/blog/interview-statistics"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Resume.io)
            </a>
            . Recruiters agree — interview readiness remains one of the biggest
            barriers to hiring success{" "}
            <a
              href="https://recruitcrm.io/blogs/job-interview-statistics/"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (RecruitCRM)
            </a>
            .
          </p>

          <p className="text-black/80 leading-relaxed mt-4 text-[15px]">
            Nearly <strong>40%</strong> of unemployed professionals haven’t had
            a single interview in the past year{" "}
            <a
              href="https://americanstaffing.net/posts/2024/11/20/hopeless-hunting/"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (American Staffing Association)
            </a>
            . And when they do, <strong>1 in 5</strong> candidates turns down
            offers due to stressful or poorly structured interviews{" "}
            <a
              href="https://www.selectsoftwarereviews.com/blog/recruiting-statistics"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Select Software Reviews)
            </a>
            . The issue isn’t a lack of talent — it’s a lack of guided,
            adaptive, and confidence-building preparation.
          </p>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 px-6 md:px-20 text-center bg-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl font-semibold text-[#f43e02]">
            Why It Matters
          </h2>
          <p className="text-black/80 text-[15px] leading-relaxed">
            Every interview opens a door — but too many people hesitate on the
            threshold. Research shows that candidates using structured practice
            tools report <strong>58% higher confidence</strong> before their
            interviews{" "}
            <a
              href="https://novoresume.com/career-blog/job-interview-statistics"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Novorésumé)
            </a>{" "}
            and are up to <strong>2×</strong> more likely to receive job offers{" "}
            <a
              href="https://qureos.com/career-guide/job-interview-statistics"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (Qureos)
            </a>
            . With <strong>82%</strong> of interviews now conducted remotely{" "}
            <a
              href="https://www.testgorilla.com/blog/job-interview-statistics/"
              target="_blank"
              className="text-[#f43e02] underline"
            >
              (TestGorilla)
            </a>
            , adaptability and real-time feedback have gone from nice-to-have to
            essential.
          </p>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-20 bg-[#f43e02] text-white text-center px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-4">Our Promise</h2>
          <p className="text-white/90 text-[15px] leading-relaxed">
            • Preparation that feels real, not rehearsed. <br />
            • Privacy and fairness at the core — no shortcuts. <br />
            • Designed for every learner, from graduates to professionals aiming
            higher. <br />• Always fast, secure, and built to help you grow.
          </p>

          <div className="mt-10">
            <Link href="/auth">
              <button className="bg-white text-[#f43e02] font-semibold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform">
                Get Started for Free
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-black/60 py-10">
        <p>
          Sources:{" "}
          <a
            href="https://economictimes.indiatimes.com/jobs/hr-policies-trends/just-one-third-of-job-seekers-consider-themselves-prepared-for-interviews-report/articleshow/121361553.cms"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Economic Times (2025)
          </a>
          ,{" "}
          <a
            href="https://teamstage.io/job-interview-statistics/"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            TeamStage
          </a>
          ,{" "}
          <a
            href="https://resume.io/blog/interview-statistics"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Resume.io
          </a>
          ,{" "}
          <a
            href="https://recruitcrm.io/blogs/job-interview-statistics/"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            RecruitCRM
          </a>
          ,{" "}
          <a
            href="https://americanstaffing.net/posts/2024/11/20/hopeless-hunting/"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            American Staffing Association
          </a>
          ,{" "}
          <a
            href="https://www.selectsoftwarereviews.com/blog/recruiting-statistics"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Select Software Reviews
          </a>
          ,{" "}
          <a
            href="https://qureos.com/career-guide/job-interview-statistics"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Qureos
          </a>
          ,{" "}
          <a
            href="https://www.testgorilla.com/blog/job-interview-statistics/"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            TestGorilla
          </a>
          ,{" "}
          <a
            href="https://passivesecrets.com/job-interview-statistics/"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Passivesecrets
          </a>
          ,{" "}
          <a
            href="https://novoresume.com/career-blog/job-interview-statistics"
            className="underline text-[#f43e02]"
            target="_blank"
          >
            Novorésumé
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
