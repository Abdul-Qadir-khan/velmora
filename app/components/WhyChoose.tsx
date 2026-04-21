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
    <section className="md:py-16 py-10 px-4 md:px-12 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Compact Header */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl lg:text-4xl font-serif font-medium text-slate-900 leading-tight"
        >
          Why Choose Us
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-lg text-slate-600 font-light mb-5 max-w-lg mx-auto"
        >
          Luxury crafted for you
        </motion.p>

        {/* Tight Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-400 cursor-pointer"
            >
              <div className="text-xl lg:text-2xl font-serif font-normal text-slate-900 mb-2 group-hover:text-slate-800">
                {feature.stat}
              </div>
              <div className="text-sm lg:text-base font-light text-slate-700 leading-tight">
                {feature.title}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compact CTA */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            href="/shop"
            className="group inline-flex items-center gap-2 px-8 py-3 font-medium border border-slate-200 bg-white rounded-full text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-md hover:shadow-lg transition-all duration-400"
          >
            Shop Collection
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}