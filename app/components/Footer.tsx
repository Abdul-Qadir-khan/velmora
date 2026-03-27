"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaFacebook, FaInstagram, FaPinterest } from "react-icons/fa";

/* Accordion Component (Mobile) */
function FooterAccordion({ title, links }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-gray-400 uppercase tracking-[0.3em] text-[10px]"
      >
        {title}
        <span className="text-white text-sm">{open ? "−" : "+"}</span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 mt-4" : "max-h-0"
        }`}
      >
        <ul className="space-y-3">
          {links.map((link: string, i: number) => (
            <li key={i}>
              <Link href="#" className="text-gray-500 hover:text-white text-xs">
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function VelmoraFooter() {
  const footerRef = useRef<HTMLDivElement>(null);

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

  const footerLinks = [
    {
      title: "Collections",
      links: ["Men", "Women", "New Arrivals", "Essentials", "Sale"],
    },
    {
      title: "Experience",
      links: [
        "Contact",
        "Shipping & Delivery",
        "Returns",
        "FAQs",
        "Track Order",
      ],
    },
    {
      title: "Maison Velmora",
      links: ["Our Story", "Craftsmanship", "Sustainability", "Careers"],
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="bg-[#050505] text-gray-400 text-xs md:text-sm tracking-wide opacity-0 translate-y-10 transition-all duration-1000"
    >
      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-12 md:py-20">
        {/* Top Section */}
        <div className="flex flex-col gap-10 md:grid md:grid-cols-4 md:gap-16">
          
          {/* Brand */}
          <div className="space-y-5">
            <Image
              src="/images/velmora-gdd.png"
              alt="Velmora"
              width={120}
              height={30}
              className="md:w-[150px]"
            />

            <p className="text-gray-500 leading-relaxed max-w-xs">
              A study in refined elegance. Velmora blends timeless silhouettes
              with modern expression for those who embody quiet luxury.
            </p>

            {/* Newsletter */}
            <div>
              <h3 className="text-white text-[10px] uppercase tracking-[0.3em] mb-3">
                Join Velmora
              </h3>

              <div className="flex border-b border-gray-700">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-transparent w-full py-1.5 text-white placeholder-gray-600 outline-none text-xs"
                />
                <button className="text-white text-xs uppercase tracking-widest hover:opacity-60 transition">
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Accordion */}
          <div className="md:hidden space-y-6">
            {footerLinks.map((col, i) => (
              <FooterAccordion key={i} {...col} />
            ))}
          </div>

          {/* Desktop Grid */}
          {footerLinks.map((col, i) => (
            <div key={i} className="hidden md:block">
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
                      <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="flex flex-col justify-end mt-6 md:mt-0">
            <p className="text-white text-base md:text-lg tracking-wide">
              +91 781 7835 909
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Mon – Sat / 10:00 – 19:00
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[10px] md:text-[11px] text-gray-600">
          
          <span>
            © {new Date().getFullYear()} Velmora. All rights reserved.
          </span>

          {/* Policies */}
          <div className="flex gap-4 md:gap-6">
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
          <div className="flex gap-4 md:gap-5 text-sm">
            <Link href="#" className="hover:opacity-70 transition">
              <FaInstagram />
            </Link>
            <Link href="#" className="hover:opacity-70 transition">
              <FaPinterest />
            </Link>
            <Link href="#" className="hover:opacity-70 transition">
              <FaFacebook />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}