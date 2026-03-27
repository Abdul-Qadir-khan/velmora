"use client";

import { useEffect, useRef } from "react";

const brands = [
  "/images/brands/versace.svg",
  "/images/brands/zara.svg",
  "/images/brands/gucci.svg",
  "/images/brands/prada.svg",
  "/images/brands/calvin-klein.svg",
];

export default function BrandSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;
    const speed = 1; // pixels per frame
    const frame = () => {
      if (!slider) return;
      scrollAmount += speed;
      if (scrollAmount >= slider.scrollWidth / 2) {
        scrollAmount = 0; // loop back
      }
      slider.scrollLeft = scrollAmount;
      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  return (
    <section className="py-8">
      {/* <h3 className="text-center text-2xl md:text-3xl font-semibold mb-4">Trusted By Leading Brands</h3> */}
      <div
        ref={sliderRef}
        className="flex gap-8 overflow-hidden whitespace-nowrap px-6 md:px-12"
      >
        {/* Duplicate logos for seamless scrolling */}
        {[...brands, ...brands].map((logo, idx) => (
          <div
            key={idx}
            className="shrink-0 w-32 h-16 md:w-40 md:h-20 flex items-center justify-center"
          >
            <img
              src={logo}
              alt={`Brand ${idx + 1}`}
              className="h-15 w-25 object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
}