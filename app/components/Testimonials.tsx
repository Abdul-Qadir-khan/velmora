"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const quotes = [
    "Delhi's best streetwear. Quality unmatched.",
    "Perfect fit for Indian body types.",
    "Lightning fast delivery in NCR.",
    "Premium fabrics at honest prices.",
    "Returns smoother than silk.",
    "Oversize game strong. Love the cuts.",
    "Weekend drip sorted. Highly recommend.",
    "Customer service top class.",
    "Hoodies softer than expected.",
    "Sizing perfect. No guesswork.",
    "Delhi winters handled. Cozy AF.",
    "Street-ready straight outta box."
  ];

export default function PradaTestimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-5 leading-tight">
          Customer Voices
        </h2>
        
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-white/20 rounded-3xl p-8 px-0 backdrop-blur-sm bg-white/5 shadow-2xl"
        >
          <blockquote className="text-2xl lg:text-3xl font-serif font-light italic leading-tight">
            "{quotes[current]}"
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}