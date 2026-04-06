"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "../components/Button";

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
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white/25 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 border border-white/40 shadow-2xl group hover:shadow-white/60 transition-all duration-300"
    >
      <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white drop-shadow-xl mb-1 group-hover:text-amber-400">
        {value}
      </div>
      <div className="text-white/90 text-xs sm:text-sm font-bold uppercase tracking-widest">
        {label}
      </div>
    </motion.div>
  );

  return (
    <section className="h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 overflow-hidden relative min-h-[600px]">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black/90 to-slate-900/70" />
      
      {/* Luxury Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 mix-blend-multiply"
        style={{
          backgroundImage: "url('/images/elegant-fashion-sale.jpg')"
        }}
      />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse opacity-50" />
        <div className="absolute top-1/3 right-10 w-2 h-2 bg-gradient-to-r from-white to-slate-200 rounded-full animate-bounce opacity-40 delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-ping opacity-60 delay-2000" />
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse opacity-30 delay-3000" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center text-white flex flex-col h-full justify-center">
        
        {/* Premium Badge - Compact */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-xl rounded-xl border border-white/30 shadow-xl mb-4 sm:mb-6 w-fit mx-auto"
        >
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-full shadow-lg animate-pulse" />
          <span className="text-xs sm:text-sm uppercase tracking-widest font-bold">🔥 FLASH SALE LIVE</span>
        </motion.div>

        {/* Compact Hero Headline */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-3 sm:mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text"
        >
          Up To{' '}
          <span className="block text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black drop-shadow-2xl">
            70% OFF
          </span>
          Premium Collection
        </motion.h2>

        {/* Compact Description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base sm:text-lg lg:text-xl text-slate-300/95 font-light max-w-lg sm:max-w-xl mx-auto mb-6 sm:mb-8 leading-tight px-2"
        >
          Luxury fashion at unbeatable prices. Limited stock - ends soon!
        </motion.p>

        {/* Compact Countdown - Always Horizontal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-2 sm:gap-3 justify-center items-center mb-6 sm:mb-8 px-2 w-full"
        >
          <CountdownBox label="Hours" value={formatTime(timeLeft).split(':')[0]} />
          <div className="w-1 h-12 sm:h-16 bg-gradient-to-b from-white/40 to-transparent" />
          <CountdownBox label="Minutes" value={formatTime(timeLeft).split(':')[1]} />
          <div className="w-1 h-12 sm:h-16 bg-gradient-to-b from-white/40 to-transparent" />
          <CountdownBox label="Seconds" value={formatTime(timeLeft).split(':')[2]} />
        </motion.div>

        {/* Optimized CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
        >
          <Link href="/shop">
            <Button 
              variant="primary" 
              className="group relative px-8 sm:px-10 py-4 text-base sm:text-lg font-bold shadow-2xl hover:shadow-primary/30 hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 min-w-[200px]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Claim 70% OFF
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
          
          {/* Secondary CTA */}
          <Link 
            href="/shop" 
            className="text-sm sm:text-base font-semibold text-white/80 hover:text-white transition-colors duration-300 underline underline-offset-2 hidden sm:inline"
          >
            View All Collections →
          </Link>
        </motion.div>

        {/* Compact Urgency Bar */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="mt-6 sm:mt-8 w-full h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden mx-auto max-w-sm"
        >
          <div className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 animate-pulse shadow-lg rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}