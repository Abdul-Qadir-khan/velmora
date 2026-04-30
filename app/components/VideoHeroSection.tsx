"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Play } from "lucide-react";

interface VideoHeroProps {
  title?: string;
  subtitle?: string;
  primaryButton?: { text: string; href: string };
  secondaryButton?: { text: string; href: string };
  videoMp4?: string;
  videoWebm?: string;
  posterImage?: string;
}

export default function VideoHeroSection({
  title = "Premium Streetwear Collection",
  subtitle = "Limited drops • Premium fabrics • Worldwide shipping",
  primaryButton = { text: "Shop Now", href: "/shop" },
  secondaryButton = { text: "New Arrivals", href: "/new-arrivals" },
  videoMp4 = "/videos/hero.mp4", // 🔥 WORKING URL
  videoWebm,
  posterImage = "/images/watches.jpg"
}: VideoHeroProps) {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 🔥 FIXED: Better video handling
  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true); // Hide spinner on error
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Auto-play when visible
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && videoRef.current && !hasError) {
        videoRef.current.play().catch(() => {
          // Fallback: show play button
        });
      }
    }, { threshold: 0.3 });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [hasError]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
     // 🔥 REPLACE your video section with this DEBUG version:
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          poster={posterImage}
          className="w-full h-full object-cover"
          preload="auto"
          onCanPlay={() => {
            console.log("✅ Video CAN PLAY!");
            setIsLoaded(true);
            setHasError(false);
          }}
          onError={(e) => {
            console.error("❌ Video ERROR:", e);
            setHasError(true);
            setIsLoaded(true);
          }}
          onLoadStart={() => {
            console.log("🔄 Video loading...");
            setIsLoaded(false);
          }}
          onPlay={() => console.log("▶️ Video playing!")}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Debug overlay */}
        {/* <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          Loaded: {isLoaded ? '✅' : '⏳'} | Error: {hasError ? '❌' : '✅'}
        </div> */}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 max-w-4xl mx-auto h-full z-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent leading-tight mb-8 drop-shadow-2xl">
          {title}
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center mb-20">
          <Link
            href={primaryButton.href}
            className="group relative px-12 py-6 bg-white text-slate-900 text-xl font-semibold rounded-3xl hover:bg-slate-50 shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-500 overflow-hidden whitespace-nowrap"
          >
            <span className="relative z-10 flex items-center gap-2">
              {primaryButton.text}
              <ShoppingBag size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {secondaryButton && (
            <Link
              href={secondaryButton.href}
              className="px-12 py-6 border-2 border-white/70 text-white text-xl font-light rounded-3xl hover:bg-white/10 hover:border-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 whitespace-nowrap"
            >
              {secondaryButton.text}
            </Link>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-4 bg-white rounded-full mt-2 self-end animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}