"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Clock, Star, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "Premium Fabrics",
    description: "Finest materials for comfort & durability",
    stats: "100% Premium",
    color: "text-emerald-500",
  },
  {
    icon: Users,
    title: "Expert Tailoring",
    description: "Precision craftsmanship for perfect fit",
    stats: "50+ Artisans",
    color: "text-blue-500",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Lightning quick shipping & tracking",
    stats: "24H Dispatch",
    color: "text-orange-500",
  },
  {
    icon: Star,
    title: "Exclusive Designs",
    description: "Trendsetting styles you won't find elsewhere",
    stats: "500+ Styles",
    color: "text-purple-500",
  },
];

export default function WhyChooseUs() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-12 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/50">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200/40 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-blue-200/30 rounded-2xl blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-orange-200/40 rounded-xl blur-lg animate-ping delay-2000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-lg mb-6 mx-auto"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              Trusted by 10K+ Customers
            </span>
          </motion.div>

          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Choose Lycoon Wear
            </span>
          </motion.h2>

          <motion.p 
            className="text-lg sm:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Premium fabrics, expert tailoring, and exceptional service
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredFeature === index;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="group relative bg-white/80 backdrop-blur-xl p-6 lg:p-8 rounded-2xl border border-white/60 shadow-lg hover:shadow-xl hover:border-emerald-300/40 hover:bg-white transition-all duration-500 cursor-pointer h-full flex flex-col"
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.04] rounded-2xl transition-opacity duration-500`} />

                <div className="relative z-10 flex flex-col items-center text-center flex-1">
                  {/* Icon */}
                  <motion.div 
                    className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm shadow-xl mb-6 border border-white/70 mx-auto group-hover:scale-110 transition-all duration-500"
                    whileHover={{ rotate: 3 }}
                  >
                    <Icon className={`w-7 h-7 lg:w-9 lg:h-9 ${feature.color}`} />
                  </motion.div>

                  {/* Stats Badge */}
                  <motion.div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-md mb-4 backdrop-blur-sm"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Sparkles className="w-3 h-3" />
                    {feature.stats}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-bold mb-3 text-gray-900 group-hover:text-gray-800 leading-tight">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm lg:text-base leading-relaxed flex-1">
                    {feature.description}
                  </p>

                  {/* Arrow */}
                  <motion.div 
                    className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={{ x: 10 }}
                    whileHover={{ x: 5 }}
                  >
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16 lg:mt-24 pt-12 border-t border-gray-200/50"
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text mb-6">
            Ready to Elevate Your Style?
          </h3>
          <Link 
            href="/shop"
            className="group relative inline-flex items-center gap-3 px-10 py-4 lg:px-12 lg:py-5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-1"
          >
            <span className="relative z-10">Shop Collection</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -skew-x-12 -translate-x-20 group-hover:translate-x-0" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}