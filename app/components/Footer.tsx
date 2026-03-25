"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { FaFacebook, FaInstagram, FaPinterest } from "react-icons/fa";

export default function VelmoraFooter() {
  const footerRef = useRef<HTMLDivElement>(null);

  // Fade-in on scroll
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-[#050505] text-gray-400 text-sm tracking-wide opacity-0 translate-y-10 transition-all duration-1000"
    >
      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-20 grid grid-cols-1 md:grid-cols-4 gap-16">

        {/* Brand */}
        <div className="space-y-6">
          <Image
            src="/images/velmora-gdd.png"
            alt="Velmora"
            width={150}
            height={30}
          />

          <p className="text-gray-500 leading-relaxed max-w-xs">
            A study in refined elegance. Velmora blends timeless silhouettes with
            modern expression for those who embody quiet luxury.
          </p>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-[10px] uppercase tracking-[0.35em] mb-4">
              Join Velmora
            </h3>

            <div className="flex border-b border-gray-700">
              <input
                type="email"
                placeholder="Your email"
                className="bg-transparent w-full py-2 text-white placeholder-gray-600 outline-none"
              />
              <button className="text-white text-xs uppercase tracking-widest hover:opacity-60 transition">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Links Column Component */}
        {[
          {
            title: "Collections",
            links: ["Men", "Women", "New Arrivals", "Essentials", "Sale"],
          },
          {
            title: "Experience",
            links: ["Contact", "Shipping & Delivery", "Returns", "FAQs", "Track Order"],
          },
          {
            title: "Maison Velmora",
            links: ["Our Story", "Craftsmanship", "Sustainability", "Careers"],
          },
        ].map((col, i) => (
          <div key={i}>
            <h3 className="text-gray-500 uppercase tracking-[0.35em] text-[10px] mb-6">
              {col.title}
            </h3>
            <ul className="space-y-3">
              {col.links.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href="#"
                    className="relative inline-block hover:text-white transition group"
                  >
                    {link}
                    {/* Underline animation */}
                    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div className="flex flex-col justify-end">
          <p className="text-white text-lg tracking-wide">+91 781 7835 909</p>
          <p className="text-gray-600 text-xs mt-1">
            Mon – Sat / 10:00 – 19:00
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-600">

          <span>
            © {new Date().getFullYear()} Velmora. All rights reserved.
          </span>

          {/* Policies */}
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="relative group hover:text-white transition"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex gap-5">
            {/* Instagram */}
            <Link href="#" className="hover:opacity-70 transition">
              <FaInstagram />
            </Link>

            {/* Pinterest */}
            <Link href="#" className="hover:opacity-70 transition">
              <FaPinterest />
            </Link>

            {/* Facebook */}
            <Link href="#" className="hover:opacity-70 transition">
              <FaFacebook />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}