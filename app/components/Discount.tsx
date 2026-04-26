"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
      whileHover={{ scale: 1.05, y: -2 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-2xl hover:bg-white/10 transition-all duration-500 flex flex-col items-center"
    >
      <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white drop-shadow-lg mb-1">
        {value}
      </div>
      <div className="text-white/70 text-xs uppercase tracking-[2px] font-light">
        {label}
      </div>
    </motion.div>
  );

  return (
    <section className="py-12 lg:py-16 px-4 lg:px-8 relative overflow-hidden bg-linear-to-r from-slate-900 via-black to-slate-900">
      {/* ✨ Subtle particles */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-linear-to-r from-amber-400/10 to-orange-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-rose-500/5 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        
        {/* 🔥 LIVE BADGE */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-rose-500/90 to-orange-500/90 backdrop-blur-md border border-white/20 rounded-2xl mb-6 shadow-xl w-fit mx-auto"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span className="text-sm uppercase tracking-widest font-medium">Live Now</span>
        </motion.div>

        {/* 💎 ELEGANT HEADLINE */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-serif font-black bg-linear-to-r from-amber-300 via-orange-300 to-rose-400 bg-clip-text text-transparent drop-shadow-2xl leading-none mb-4"
        >
          70% OFF
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-white/80 font-light max-w-md mx-auto mb-8 leading-relaxed"
        >
          Premium collection - limited time
        </motion.p>

        {/* 🕐 SLIM COUNTDOWN */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-end gap-3 sm:gap-4 justify-center mb-10 px-4"
        >
          <CountdownBox label="HRS" value={formatTime(timeLeft).split(':')[0]} />
          <motion.div 
            className="w-px h-12 sm:h-16 bg-gradient-to-b from-white/50 to-transparent"
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <CountdownBox label="MIN" value={formatTime(timeLeft).split(':')[1]} />
          <motion.div 
            className="w-px h-12 sm:h-16 bg-gradient-to-b from-white/50 to-transparent"
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <CountdownBox label="SEC" value={formatTime(timeLeft).split(':')[2]} />
        </motion.div>

        {/* 🚀 GLASS CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          className="group"
        >
          <Link 
            href="/shop"
            className="relative inline-flex items-center gap-3 px-8 py-4 text-base font-medium uppercase tracking-[1px] 
                     bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl text-white shadow-2xl
                     hover:bg-white/20 hover:border-white/40 hover:shadow-3xl hover:-translate-y-1
                     active:scale-95 active:shadow-xl
                     focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10">Shop Collection</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500 relative z-10" />
            
            {/* ✨ Glow trail */}
            <motion.div 
              className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent rounded-3xl -skew-x-12 opacity-0 group-hover:opacity-100"
              initial={{ x: -100 }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </Link>
        </motion.div>

        {/* 📏 Thin disclaimer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-white/50 uppercase tracking-wider font-light mt-6"
        >
          Selected styles • While stocks last
        </motion.p>
      </div>
    </section>
  );
}