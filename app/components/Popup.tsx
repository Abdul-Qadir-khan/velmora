"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function FlashSalePopup() {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-show after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={closePopup}
      >
        <motion.div
          initial={{ scale: 0.85, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, y: 20, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 lg:mx-8 border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 lg:p-6 bg-linear-to-r from-rose-600 via-rose-500 to-orange-500 text-white relative">
            <button 
              onClick={closePopup}
              className="cursor-pointer absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4 mx-auto">
                <Clock className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-medium">Flash Sale Live</span>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-serif font-light mb-3">
                Up to 60% OFF
              </h3>
              <p className="text-xl font-light opacity-90">
                Limited time - Ends tonight
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6 flex-1 flex flex-col justify-between">
            {/* Event Details */}
            <div className="space-y-4 mb-2">
              <div className="flex items-center justify-center gap-2 text-2xl lg:text-3xl font-bold text-rose-600 mb-2">
                <ShoppingBag className="w-8 h-8" />
                <span>Collection Sale</span>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-slate-700 font-light leading-relaxed">
                  Premium coats, cashmere sweaters, and signature accessories
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Selected styles only. While stocks last.
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link 
              href="/shop"
              className="group w-full flex items-center justify-center gap-3 py-5 px-8 bg-linear-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] mx-auto"
              onClick={() => setIsOpen(false)}
            >
              <span>Shop Sale Now</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
            </Link>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-300 px-4 text-center w-fit mx-auto">
              <p className="text-xs text-slate-500">
                Don't miss out - sale ends in 24 hours
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}