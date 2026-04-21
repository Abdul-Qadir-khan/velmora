"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DiscountsSection() {
  const [timeLeft, setTimeLeft] = useState(3600 * 4 + 1800);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600 * 24));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const CountdownBox = ({ label, value }: { label: string; value: string }) => (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/10 backdrop-blur-md rounded-lg p-2 sm:p-3 border border-white/20 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-400"
    >
      <div className="text-sm sm:text-base lg:text-lg font-light text-white drop-shadow-md mb-0.5">
        {value}
      </div>
      <div className="text-white/80 text-xs uppercase tracking-widest font-medium">
        {label}
      </div>
    </motion.div>
  );

  return (
    <section className="py-5 sm:py-10 lg:py-12 px-6 lg:px-12 overflow-hidden relative bg-black">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-slate-900/30 to-black" />
      
      <div className="relative z-10 w-full max-w-md lg:max-w-lg mx-auto text-center text-white">
        
        {/* Minimal badge */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-4 w-fit mx-auto"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Flash Sale</span>
        </motion.div>

        {/* Compact headline */}
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light leading-tight mb-3"
        >
          Up to{' '}
          <span className="block text-4xl sm:text-5xl lg:text-6xl font-black bg-linear-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            70% OFF
          </span>
        </motion.h2>

        {/* Short description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-white/90 font-light max-w-sm mx-auto mb-6 leading-relaxed"
        >
          Limited time on premium collection
        </motion.p>

        {/* Compact countdown */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-2 sm:gap-3 justify-center items-center mb-6"
        >
          <CountdownBox label="HRS" value={formatTime(timeLeft).split(':')[0]} />
          <div className="w-px h-8 sm:h-10 bg-white/30" />
          <CountdownBox label="MIN" value={formatTime(timeLeft).split(':')[1]} />
          <div className="w-px h-8 sm:h-10 bg-white/30" />
          <CountdownBox label="SEC" value={formatTime(timeLeft).split(':')[2]} />
        </motion.div>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link 
            href="/shop"
            className="group relative inline-flex px-6 py-3 text-sm sm:text-base font-medium uppercase tracking-widest border-2 border-white/30 bg-white/5 backdrop-blur-md rounded-full text-white 
                     hover:bg-white/10 hover:border-white/50 hover:shadow-xl hover:scale-[1.02]
                     active:bg-white/20 active:scale-[0.98]
                     focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-500 w-fit shadow-lg"
          >
            <span className="relative z-10">Shop Sale</span>
            <div className="absolute inset-0 bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-full" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}