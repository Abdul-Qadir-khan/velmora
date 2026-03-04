"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

const slides = [
  {
    title: "No.1 CCTV Installation Services in Noida",
    subtitle:
      "Protect your home, office & shop with expert CCTV installation in Noida. We also serve Delhi & nearby NCR areas with fast, reliable setup.",
    image: "/images/hero1.jpg",
    buttonText: "Get Free Site Visit",
    buttonLink: "/contact",
    buttonVariant: "primary",
  },
  {
    title: "Advanced HD & 4K Security Cameras",
    subtitle:
      "Crystal-clear surveillance, night vision & mobile monitoring. Secure your property in Noida, Delhi & surrounding areas with trusted professionals.",
    image: "/images/hero2.jpg",
    buttonText: "View CCTV Packages",
    buttonLink: "/products",
    buttonVariant: "accent",
  },
  {
    title: "24/7 Support & Quick Installation",
    subtitle:
      "Same-day installation in Noida. Emergency support available in Delhi NCR. Affordable pricing with complete installation & warranty.",
    image: "/images/hero3.jpg",
    buttonText: "Book Installation Now",
    buttonLink: "/services",
    buttonVariant: "secondary",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      className="relative w-full h-[500px] md:h-[700px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === current
              ? "opacity-100 scale-100 z-10"
              : "opacity-0 scale-110 z-0"
            }`}
        >
          {/* Background Image */}
          <div
            className={`w-full h-full bg-center bg-cover transition-transform duration-6000ms ease-linear ${index === current ? "scale-105" : "scale-110"
              }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/80 flex items-center justify-center">
            <div className="text-center px-6 max-w-3xl">

              {/* Title */}
              <h2 className="text-white  text-3xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
                {slide.title}
              </h2>

              {/* Subtitle */}
              <p className="text-gray-200 text-base md:text-2xl mb-8 leading-relaxed">
                {slide.subtitle}
              </p>

              {/* Button */}
              <Button
                variant={slide.buttonVariant as any}
                className="px-8 py-3 text-lg cursor-pointer"
                onClick={() => (window.location.href = slide.buttonLink)}
              >
                {slide.buttonText}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-accent text-white p-3 rounded-full transition z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-accent text-white p-3 rounded-full transition z-20"
        aria-label="Next Slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-3 rounded-full transition-all duration-300 ${idx === current
                ? "w-8 bg-accent"
                : "w-3 bg-gray-400/60 hover:bg-gray-300"
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}