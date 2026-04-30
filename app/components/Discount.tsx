import { ShoppingBag, Percent, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const DiscountSection = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 47, s: 23 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s === 0) {
          s = 59;
          if (m === 0) {
            m = 59;
            h = h > 0 ? h - 1 : 23;
          } else m--;
        } else s--;
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center">
          {/* Compact Header */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-5 py-2 rounded-2xl mb-6 font-semibold text-sm uppercase tracking-wide shadow-lg">
            <Percent className="w-4 h-4" />
            LIMITED TIME SALE
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 leading-tight">
            Up to 60% OFF
          </h2>
          <p className="text-lg md:text-xl text-slate-300 font-light mb-10">
            Everything Must Go
          </p>

          {/* Tight Counter */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 border border-white/30 min-w-[100px]">
              <div className="text-3xl md:text-4xl font-mono font-bold text-white mb-1">
                {timeLeft.h.toString().padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400">HRS</div>
            </div>
            <div className="text-2xl font-bold text-white">:</div>
            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 border border-white/30 min-w-[100px]">
              <div className="text-3xl md:text-4xl font-mono font-bold text-white mb-1">
                {timeLeft.m.toString().padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400">MIN</div>
            </div>
            <div className="text-2xl font-bold text-white">:</div>
            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 border border-white/30 min-w-[100px]">
              <div className="text-3xl md:text-4xl font-mono font-bold text-white mb-1">
                {timeLeft.s.toString().padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400">SEC</div>
            </div>
          </div>

          {/* Compact CTA */}
          <Link 
            href="/shop"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-slate-900 font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 overflow-hidden hover:bg-slate-50 border border-white/20"
          >
            <span className="relative z-10">Shop Now</span>
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;