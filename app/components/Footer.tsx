"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaFacebook, FaInstagram, FaPinterest } from "react-icons/fa";

function FooterAccordion({ title, links }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 pb-3 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-2 text-gray-400 uppercase tracking-[0.3em] text-[10px]"
      >
        {title}
        <span className="text-white text-sm">{open ? "−" : "+"}</span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-32 mt-3" : "max-h-0"
        }`}
      >
        <ul className="space-y-2">
          {links.map((link: any, i: number) => (
            <li key={i}>
              <Link href={link.href} className="block py-1 text-gray-500 hover:text-white text-xs">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function LycoonWearFooter() {
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
      links: [
        { label: "Men", href: "/shop" },
        { label: "Women", href: "/shop" },
        { label: "New Arrivals", href: "/shop" },
        { label: "Sale", href: "/shop" },
      ],
    },
    {
      title: "Experience",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "Shipping & Delivery", href: "/shipping-delivery" },
        { label: "Returns", href: "/returns" },
        { label: "FAQs", href: "/faqs" },
      ],
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="bg-[#050505] text-gray-400 text-xs md:text-sm tracking-wide"
    >
      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-start">
          
          {/* Brand */}
          <div className="space-y-4">
            <Image
              src="/images/lycoonwear.png"
              alt="Lycoon Wear"
              width={70}
              height={30}
              className="invert"
            />

            <p className="text-gray-500 leading-relaxed max-w-xs text-[13px]">
              A study in refined elegance. Lycoon Wearblends timeless silhouettes
              with modern expression for those who embody quiet luxury.
            </p>

            <div>
              <h3 className="text-white text-[10px] uppercase tracking-[0.3em] mb-3">
                Join Lycoon Wear
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
          <div className="md:hidden col-span-1 space-y-4">
            {footerLinks.map((col, i) => (
              <FooterAccordion key={i} {...col} />
            ))}
          </div>

          {/* Desktop Grid */}
          {footerLinks.map((col, i) => (
            <div key={i} className="hidden md:block">
              <h3 className="text-gray-500 uppercase tracking-[0.35em] text-[10px] mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link: any, idx: number) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="relative inline-block hover:text-white transition group text-sm"
                    >
                      {link.label}
                      <span className="absolute left-0 -bottom-1 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="flex flex-col md:justify-end space-y-2">
            <a 
              href="tel:+917817835909"
              className="text-white text-base md:text-lg tracking-wide hover:opacity-80 transition"
            >
              +91 781 7835 909
            </a>
            <p className="text-gray-600 text-xs">
              Mon – Sat / 10:00 – 19:00
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-3 flex flex-col lg:flex-row items-center justify-between gap-4 text-[10px] md:text-[11px] text-gray-600">
          
          <span className="order-3 lg:order-1">
            © {new Date().getFullYear()} Lycoon Wear. All rights reserved.
          </span>

          {/* Policies - Right Side */}
          <div className="flex gap-4 order-2 lg:order-2">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Cookies", href: "/cookies" }
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative group hover:text-white transition"
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Social Icons - Left on Mobile, Right on Desktop */}
          <div className="flex gap-4 text-sm order-1 lg:order-3">
            <Link href="https://instagram.com/velmora" className="hover:opacity-70 transition">
              <FaInstagram />
            </Link>
            <Link href="https://pinterest.com/velmora" className="hover:opacity-70 transition">
              <FaPinterest />
            </Link>
            <Link href="https://facebook.com/velmora" className="hover:opacity-70 transition">
              <FaFacebook />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}