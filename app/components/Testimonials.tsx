"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const quotes = [
  "Masterful craftsmanship.",
  "Timeless sophistication.",
  "Pure elegance."
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
    <section className="py-32 bg-black text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-6xl lg:text-7xl font-serif font-normal mb-12 leading-none">
          Voices
        </h2>
        
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-white/20 rounded-3xl p-16 backdrop-blur-sm bg-white/5 shadow-2xl"
        >
          <blockquote className="text-3xl lg:text-4xl font-serif font-light italic leading-tight">
            "{quotes[current]}"
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}