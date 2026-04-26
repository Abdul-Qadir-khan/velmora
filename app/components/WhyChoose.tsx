"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  { title: "Handcrafted", stat: "Chikan Work" },
  { title: "Premium Fabrics", stat: "Mulmul Cotton" },
  { title: "Perfect Stitching", stat: "Tailor Made" },
  { title: "Timeless Wear", stat: "Everyday Luxury" },
];

export default function WhyLycoonWear() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Why LycoonWear
          </h2>
          <p className="text-xl text-gray-600 max-w-xl mx-auto">
            Indian craftsmanship for modern elegance
          </p>
        </motion.div>

        {/* Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group hover:-translate-y-2 transition-all duration-500 p-8 border border-gray-200 hover:border-gray-400 rounded-2xl hover:shadow-xl cursor-pointer"
            >
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {feature.stat}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                {feature.title}
              </h3>
              <div className="h-1 w-20 bg-gray-300 group-hover:bg-orange-500 rounded-full transition-colors mx-auto" />
            </motion.div>
          ))}
        </div>

        {/* Simple CTA */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block bg-gray-900 text-white font-bold px-12 py-4 rounded-full hover:bg-black hover:-translate-y-1 transition-all uppercase text-sm shadow-lg hover:shadow-xl"
          >
            Shop Now
          </Link>
        </div>

      </div>
    </section>
  );
}