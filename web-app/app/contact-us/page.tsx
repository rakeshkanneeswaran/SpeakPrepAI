"use client";

import Navbar from "../components/Navbar";

export default function ContactUs() {
  return (
    <main className="min-h-screen bg-[#f3f3ef] text-black">
      <Navbar />

      <section className="px-6 md:px-20 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold text-[#f43e02]">Contact Us</h1>

          <p className="text-lg text-gray-700 leading-relaxed">
            We're here to help. Whether you have questions about your account,
            payments, refunds, technical issues, or product feedback — feel free
            to reach out anytime.
          </p>

          <h2 className="text-3xl font-semibold mt-10">Support Email</h2>
          <p className="text-gray-700 mt-3 leading-relaxed">
            You can contact us at:
            <br />
            <strong className="text-[#f43e02]">speakprepai@gmail.com</strong>
          </p>

          <p className="text-gray-700 leading-relaxed">
            We typically respond within 24–48 hours.
          </p>

          {/* Optional details */}
          <h2 className="text-3xl font-semibold mt-10">When to Contact Us</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-3">
            <li>Refund or cancellation requests</li>
            <li>Issues accessing your account or credits</li>
            <li>Questions about mock interviews</li>
            <li>Bug reports or technical issues</li>
            <li>General feedback to help us improve</li>
          </ul>

          {/* Optional future form section */}
          <h2 className="text-3xl font-semibold mt-10">Future Contact Form</h2>
          <p className="text-gray-700 leading-relaxed">
            We're working on adding a contact form here for faster support. For
            now, email is the best way to reach us.
          </p>

          <p className="text-gray-500 text-sm mt-12">
            Last updated: {new Date().getFullYear()}
          </p>
        </div>
      </section>
    </main>
  );
}
