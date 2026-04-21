"use client";

const brands = [
  "/images/brands/versace.svg",
  "/images/brands/zara.svg",
  "/images/brands/gucci.svg",
  "/images/brands/prada.svg",
  "/images/brands/calvin-klein.svg",
];

export default function BrandSlider() {
  return (
    <section className="py-3 md:py-5 bg-black overflow-hidden">
      <div className="relative w-full">
        
        {/* Gradient Fade (Luxury touch) */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-linear-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-linear-to-l from-black to-transparent z-10" />

        {/* Slider Track */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-12 md:gap-20 px-5 md:px-12">
          
          {/* Loop Twice */}
          {[...brands, ...brands].map((logo, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center w-28 h-14 md:w-40 md:h-20 shrink-0"
            >
              <img
                src={logo}
                alt="brand logo"
                className="h-8 md:h-10 w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition duration-300"
              />
            </div>
          ))}

        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 25s linear infinite;
        }

        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 18s;
          }
        }
      `}</style>
    </section>
  );
}