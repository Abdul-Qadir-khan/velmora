"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  { title: "Premium Italian Fabrics", stat: "100% Pure" },
  { title: "Handcrafted Tailoring", stat: "Paris Atelier" },
  { title: "24H Global Delivery", stat: "Worldwide" },
  { title: "Timeless Designs", stat: "Since 1924" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-white text-black">
      <div className="max-w-5xl mx-auto">

        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight">
            Why We Stand Apart
          </h2>
          <p className="mt-3 text-sm uppercase tracking-[0.25em] text-black/50">
            Crafted with intention
          </p>
        </motion.div>

        {/* Minimal Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 mb-16">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group cursor-pointer"
            >
              {/* Stat */}
              <div className="text-xl md:text-2xl font-serif mb-2">
                {feature.stat}
              </div>

              {/* Title */}
              <div className="text-sm text-black/60 leading-snug relative inline-block">
                {feature.title}
                
                {/* Underline hover (fashion style) */}
                <span className="absolute left-0 -bottom-1 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Minimal CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <Link
            href="/shop"
            className="inline-block text-sm uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition"
          >
            Shop Collection
          </Link>
        </motion.div>

      </div>
    </section>
  );
}