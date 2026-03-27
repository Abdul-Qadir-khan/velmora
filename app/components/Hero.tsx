"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    title: "Velmora Essentials",
    subtitle: "Minimal silhouettes. Elevated everyday luxury.",
    image: "/images/product1.jpg",
    link: "/products",
  },
  {
    title: "New Season",
    subtitle: "Refined layers for the modern wardrobe.",
    image: "/images/product1.jpg",
    link: "/collection",
  },
  {
    title: "Timeless Denim",
    subtitle: "Crafted precision. Effortless style.",
    image: "/images/product1.jpg",
    link: "/denim",
  },
];

export default function VelmoraHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[85vh] py-12 md:py-0 overflow-hidden bg-black">

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ${
            index === current ? "opacity-100 z-10" : "opacity-0"
          }`}
        >
          {/* IMAGE */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover transition-transform duration-[6000ms] ${
                index === current ? "scale-110" : "scale-100"
              }`}
            />
          </div>

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* CONTENT */}
          <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-5 md:px-0">

            <div className="max-w-xl text-white space-y-4 md:space-y-6">

              {/* Title */}
              <h1 className="text-4xl md:text-7xl font-light tracking-wide leading-tight animate-fadeUp mb-2 md:mb-auto">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-gray-300 text-base md:text-lg animate-fadeUp delay-200">
                {slide.subtitle}
              </p>

              {/* Button */}
              <Link
                href={slide.link}
                className="inline-block border border-white px-8 py-3 text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300 animate-fadeUp delay-300"
              >
                Discover
              </Link>

            </div>
          </div>
        </div>
      ))}

      {/* DOTS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-[2px] transition-all duration-300 ${
              idx === current
                ? "w-10 bg-white"
                : "w-4 bg-gray-500"
            }`}
          />
        ))}
      </div>

      {/* CUSTOM ANIMATIONS */}
      <style jsx>{`
        .animate-fadeUp {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 1s forwards;
        }

        .animate-fadeUp.delay-200 {
          animation-delay: 0.2s;
        }

        .animate-fadeUp.delay-300 {
          animation-delay: 0.3s;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}