"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    title: "AW24 Collection",
    subtitle: "Timeless elegance meets modern edge.",
    cta: "Shop New Arrivals",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", 
    category: "WOMEN",
  },
  {
    title: "Men's Essentials",
    subtitle: "Crafted for the modern gentleman.",
    cta: "Discover Menswear",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", 
    category: "MEN",
  },
  {
    title: "Timeless Denim",
    subtitle: "Heritage meets contemporary style.",
    cta: "Explore Denim",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80", 
    category: "DENIM",
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
      {/* Slides - unchanged */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? 'opacity-100 scale-[1.02]' : 'opacity-0 scale-100'
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-neutral-900/70 to-transparent" />
          </div>

          <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 pt-12 sm:pt-16 md:pt-0">
              <div className="inline-flex items-center px-4 sm:px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase w-fit text-gray-400">
                {slide.category}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-2xl font-serif">
                {slide.title}
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200/90 font-light max-w-xl leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center pt-6 sm:pt-8 border-t border-white/10">
                <Link
                  href="/shop"
                  className="group relative px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-medium uppercase tracking-widest border-2 border-white/20 bg-white/5 backdrop-blur-sm rounded-full text-gray-400 hover:bg-white hover:text-black hover:border-white active:bg-white/90 active:text-black active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 overflow-hidden w-full sm:w-fit max-w-xs sm:max-w-none shadow-lg hover:shadow-xl"
                >
                  <span className="relative z-10">{slide.cta}</span>
                  <div className="absolute inset-0 bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                </Link>

                <div className="flex items-center gap-4 sm:gap-6 text-xs uppercase tracking-widest text-gray-400 font-mono flex-wrap">
                  <span>New Season</span>
                  <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <span>Limited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ✅ FIXED Navigation Dots */}
      <div className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-4 z-40 bg-black/40 backdrop-blur-md py-3 sm:py-4 px-4 sm:px-6 rounded-2xl border border-white/20 shadow-lg">
        {slides.map((_, idx) => {
          const isActive = idx === current;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`
                relative h-1.5 sm:h-2 rounded-full transition-all duration-500 overflow-hidden 
                cursor-pointer shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black active:scale-95
                group
                ${isActive 
                  ? "w-8 sm:w-12 bg-gradient-to-r from-white to-blue-300 shadow-xl" 
                  : "w-2 sm:w-3 bg-white/50 hover:w-3 sm:hover:w-4 hover:bg-white/80"
                }
              `}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {isActive && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/100 to-blue-300/50 h-full transition-all duration-[6000ms] ease-linear pointer-events-none"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Arrows - unchanged */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 sm:w-14 h-10 sm:h-14 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:border-white/50 hover:shadow-xl active:bg-white/30 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 z-40 cursor-pointer shadow-lg group"
        aria-label="Previous slide"
      >
        <svg className="w-4 sm:w-6 h-4 sm:h-6 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 sm:w-14 h-10 sm:h-14 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:border-white/50 hover:shadow-xl active:bg-white/30 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 z-40 cursor-pointer shadow-lg group"
        aria-label="Next slide"
      >
        <svg className="w-4 sm:w-6 h-4 sm:h-6 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300 shadow-md ${
          hovered ? 'scale-150 bg-white shadow-lg' : 'bg-white/60'
        }`} />
      </div>
    </section>
  );
}