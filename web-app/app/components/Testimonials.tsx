"use client";

import { motion } from "framer-motion";

interface Testimonial {
  name: string;
  company: string;
  companyLogo: string;
  comment: string;
  image: string;
}

export default function Testimonials({ list }: { list: Testimonial[] }) {
  return (
    <section className="py-24 px-6 md:px-20 bg-white">
      <h2 className="text-4xl font-semibold text-center mb-3">
        What Candidates Are Saying
      </h2>

      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Trusted by students, engineers, and working professionals preparing for
        real interviews.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {list.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-[#fafafa] rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          >
            {/* HEADER: Avatar + Info + Large Logo */}
            <div className="flex items-center justify-between mb-5">
              {/* LEFT: Avatar + Name + Company */}
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-300"
                />

                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {t.name}
                  </h3>
                  <span className="text-gray-600 text-sm">{t.company}</span>
                </div>
              </div>

              {/* RIGHT: Large Company Logo */}
              <img
                src={t.companyLogo}
                alt={`${t.company} logo`}
                className="w-20 h-20 object-contain opacity-90"
              />
            </div>

            {/* COMMENT */}
            <p className="text-gray-700 leading-relaxed italic">
              "{t.comment}"
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
