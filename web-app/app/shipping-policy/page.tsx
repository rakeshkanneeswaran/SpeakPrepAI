"use client";

import Navbar from "../components/Navbar";

export default function ShippingPolicy() {
  return (
    <main className="min-h-screen bg-[#f3f3ef] text-black">
      <Navbar />

      <section className="px-6 md:px-20 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold text-[#f43e02]">Shipping Policy</h1>

          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>SpeakPrep AI</strong> is a 100% digital product. We do not
            ship any physical goods. All services are delivered instantly online
            through our platform.
          </p>

          {/* Delivery Section */}
          <h2 className="text-3xl font-semibold mt-10">Digital Delivery</h2>
          <p className="text-gray-700 leading-relaxed mt-3">
            After successful payment or account creation, users gain immediate
            access to:
          </p>

          <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-3">
            <li>AI-powered mock interviews</li>
            <li>Interview transcripts and analysis</li>
            <li>Dashboard and saved sessions</li>
            <li>All features associated with your plan or credits</li>
          </ul>

          {/* No Shipping */}
          <h2 className="text-3xl font-semibold mt-10">No Physical Shipping</h2>
          <p className="text-gray-700 leading-relaxed mt-3">
            Since our service is fully digital:
          </p>

          <ul className="list-disc ml-6 space-y-2 text-gray-700 mt-3">
            <li>No physical product will be delivered.</li>
            <li>No shipping charges apply.</li>
            <li>No courier or tracking ID will be generated.</li>
          </ul>

          {/* Delivery Issues */}
          <h2 className="text-3xl font-semibold mt-10">
            If You Face Access Issues
          </h2>
          <p className="text-gray-700 leading-relaxed mt-3">
            If you are unable to access the platform after payment, please
            contact us immediately at:
            <br />
            <strong>speakprepai@gmail.com</strong>
          </p>

          <p className="text-gray-700 leading-relaxed">
            Our team will ensure your access is restored as quickly as possible.
          </p>

          <p className="text-gray-500 text-sm mt-12">
            Last updated: {new Date().getFullYear()}
          </p>
        </div>
      </section>
    </main>
  );
}
