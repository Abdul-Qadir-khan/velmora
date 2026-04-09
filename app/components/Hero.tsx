"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    title: "AW24",
    subtitle: "Refined elegance for the discerning.",
    cta: "Discover Collection",
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&fit=crop&w=2500&h=1667&q=85", 
    category: "WOMEN",
    product: "Nylon Handbag"
  },
  {
    title: "Essentials",
    subtitle: "Timeless craftsmanship redefined.",
    cta: "Explore Menswear",
    // ✅ FIXED: Premium leather shoes
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&fit=crop&w=2500&h=1667&q=85", 
    category: "MEN",
    product: "Leather Loafers"
  },
  {
    title: "Signature",
    subtitle: "Heritage meets contemporary luxury.",
    cta: "View Denim",
    // ✅ FIXED: Luxury handbag closeup
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&fit=crop&w=2500&h=1667&q=85", 
    category: "ICONS",
    product: "Triangle Bag"
  },
];

export default function FashionHero() {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (!hovered) {
      interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 6000);
      
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 60);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [hovered]);

  useEffect(() => {
    setProgress(0);
  }, [current]);

  const goToSlide = useCallback((index: number) => {
    setCurrent(index);
    setProgress(0);
  }, []);

  const nextSlide = () => goToSlide((current + 1) % slides.length);
  const prevSlide = () => goToSlide((current - 1 + slides.length) % slides.length);

  return (
    <section 
      className="relative w-full h-screen overflow-hidden bg-black"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
            index === current 
              ? 'opacity-100 scale-[1.02] brightness-100' 
              : 'opacity-0 scale-95 brightness-50'
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={`${slide.product} - ${slide.title}`}
              loading="eager"
              className="w-full h-full object-cover object-center brightness-90 contrast-[1.1] saturate-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          <div className="relative z-20 h-full flex flex-col justify-end px-6 sm:px-8 lg:px-12 xl:px-20 max-w-6xl mx-auto pb-12 sm:pb-16 lg:pb-24">
            <div className="space-y-3 lg:space-y-4 max-w-lg lg:max-w-xl">
              <div className="inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-xs lg:text-sm font-medium tracking-widest uppercase text-white w-fit shadow-lg">
                {slide.category}
              </div>

              <p className="text-sm lg:text-base font-mono tracking-widest uppercase text-white/80">
                {slide.product}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-light leading-none tracking-tight text-white drop-shadow-2xl">
                {slide.title}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-white/90 font-light max-w-md leading-relaxed">
                {slide.subtitle}
              </p>

              <Link
                href="/shop"
                className="group relative inline-flex px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base font-medium uppercase tracking-widest border-2 border-white/40 bg-white/5 backdrop-blur-md rounded-full text-white 
                         hover:bg-white/15 hover:border-white/60 hover:shadow-xl hover:scale-[1.01]
                         active:bg-white/20 active:scale-[0.98] active:shadow-lg
                         focus:outline-none focus:ring-4 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black
                         transition-all duration-500 ease-out overflow-hidden w-fit shadow-xl"
              >
                <span className="relative z-10 tracking-widest">{slide.cta}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent origin-left scale-x-0 
                               group-hover:scale-x-100 transition-transform duration-700 ease-out rounded-full" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots - FIXED */}
      <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-8 lg:left-12 flex items-center gap-2 lg:gap-3 z-50 pointer-events-auto">
        {slides.map((_, idx) => {
          const isActive = idx === current;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`
                relative h-1 w-1.5 lg:h-1.5 lg:w-2 rounded-full transition-all duration-500 overflow-hidden 
                cursor-pointer shadow-md group focus:outline-none focus:ring-2 focus:ring-white/50
                ${isActive 
                  ? "w-10 lg:w-12 h-1.5 lg:h-2 bg-gradient-to-r from-white via-blue-100/50 to-transparent shadow-xl hover:shadow-2xl hover:w-12 lg:hover:w-14" 
                  : "w-1.5 lg:w-2 h-1 lg:h-1.5 bg-white/50 hover:w-3 lg:hover:w-4 hover:h-1.5 lg:hover:h-2 hover:bg-white/80 hover:shadow-lg"
                }
              `}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {isActive && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-white to-blue-200/30 h-full transition-all duration-[6000ms] ease-linear pointer-events-none"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ✅ FIXED: Luxury Arrow Hovers - Ultra-Subtle */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 
                   bg-white/8 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center 
                   text-white/70 hover:bg-white/15 hover:border-white/40 hover:text-white 
                   hover:shadow-xl hover:scale-[1.05]
                   active:bg-white/25 active:scale-[0.98] active:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black
                   transition-all duration-400 ease-out z-50 cursor-pointer group pointer-events-auto"
        aria-label="Previous slide"
      >
        <svg className="w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-500 group-hover:translate-x-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 
                   bg-white/8 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center 
                   text-white/70 hover:bg-white/15 hover:border-white/40 hover:text-white 
                   hover:shadow-xl hover:scale-[1.05]
                   active:bg-white/25 active:scale-[0.98] active:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black
                   transition-all duration-400 ease-out z-50 cursor-pointer group pointer-events-auto"
        aria-label="Next slide"
      >
        <svg className="w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-500 group-hover:translate-x-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}