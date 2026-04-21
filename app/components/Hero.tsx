"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    title: "NEW COLLECTION",
    subtitle: "Refined essentials for everyday wear.",
    image: "/images/categories/mens-wear.avif",
    cta: "Shop Now",
  },
  {
    title: "SPRING EDIT",
    subtitle: "Light layers. Elevated comfort.",
    image: "/images/categories/casual-hoodie.jpg",
    cta: "Explore",
  },
  {
    title: "TIMELESS PIECES",
    subtitle: "Designed to outlast trends.",
    image: "/images/categories/watches.jpg",
    cta: "Discover",
  },
];

export default function ZaraHero() {
  const [current, setCurrent] = useState(0);

  // slow, elegant autoplay (can remove if you want fully manual)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-svh overflow-hidden bg-black">

      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1200 ease-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full md:h-svh h-full object-cover"
          />

          {/* subtle overlay */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute bottom-16 left-6 sm:left-10 lg:left-20 z-20 max-w-xl">
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white leading-tight tracking-tight">
          {slides[current].title}
        </h1>

        <p className="mt-3 text-sm sm:text-base text-white/80 max-w-md">
          {slides[current].subtitle}
        </p>

        <Link
          href="/shop"
          className="inline-block mt-6 text-sm tracking-widest uppercase text-white border-b border-white pb-1 hover:opacity-70 transition"
        >
          {slides[current].cta}
        </Link>
      </div>

      {/* Navigation - ultra minimal */}
      <div className="absolute bottom-8 right-6 sm:right-10 flex items-center gap-4 z-20">
        
        <button
          onClick={prev}
          className="text-white/70 hover:text-white text-xl"
        >
          ←
        </button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 w-6 transition-all ${
                i === current ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="text-white/70 hover:text-white text-xl"
        >
          →
        </button>
      </div>
    </section>
  );
}