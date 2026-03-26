"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X, Search, ShoppingCart, User, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { cartCount } = useCart();

  // Improved scroll handler with debouncing
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close modals on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
        setOpenMenu(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Close search overlay on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen]);

  const toggleMenu = useCallback((menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  }, [openMenu]);

  const closeAllMenus = useCallback(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setOpenMenu(null);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search - navigate to search page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  }, [searchQuery]);

  const navLinks = [
    { 
      name: "Men", 
      href: "/men",
      megaMenu: true,
      subcategories: [
        { title: "Clothing", items: ["T-Shirts", "Shirts", "Jeans", "Jackets"] },
        { title: "Collections", items: ["New Arrivals", "Essentials", "Best Sellers"] }
      ],
      images: [
        { src: "/images/categories/mens-wear.avif", alt: "Summer Edit", label: "Summer Edit" },
        { src: "/images/categories/womens-wear.avif", alt: "Minimal Fits", label: "Minimal Fits" }
      ]
    },
    { 
      name: "Women", 
      href: "/women",
      megaMenu: true,
      subcategories: [
        { title: "Clothing", items: ["Dresses", "Tops", "Denim", "Outerwear"] },
        { title: "Collections", items: ["New Arrivals", "Essentials", "Trending"] }
      ],
      images: [
        { src: "/images/categories/night-wear.avif", alt: "New Season", label: "New Season" },
        { src: "/images/categories/kids-wear.avif", alt: "Evening Wear", label: "Evening Wear" }
      ]
    },
    { name: "New", href: "/new", megaMenu: false },
    { name: "Sale", href: "/sale", megaMenu: false },
  ];

  const renderMegaMenu = (link: any, index: number) => (
    <div 
      key={index}
      className="absolute left-0 top-full w-screen bg-white/95 backdrop-blur-xl border border-gray-200 text-black opacity-0 invisible 
                 group-hover:visible group-hover:opacity-100 transition-all duration-300 shadow-2xl z-50"
      style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
        {/* Subcategories */}
        <div className="md:col-span-2 space-y-6">
          {link.subcategories.map((cat: any, i: number) => (
            <div key={i}>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4">
                {cat.title}
              </h4>
              <ul className="space-y-2">
                {cat.items.map((item: string, j: number) => (
                  <li key={j}>
                    <Link 
                      href="/shop" 
                      className="block py-1.5 text-gray-700 hover:text-black hover:underline decoration-1 underline-offset-4 transition-all duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="md:col-span-2 grid grid-cols-2 gap-6">
          {link.images.map((img: any, i: number) => (
            <Link href="/shop" key={i} className="group relative overflow-hidden rounded-xl">
              <Image
                src={img.src}
                alt={img.alt}
                width={300}
                height={250}
                className="w-full h-60 object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-medium text-sm drop-shadow-lg">
                {img.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md ${
          isScrolled
            ? "bg-white/95 py-4 shadow-sm border-b border-gray-200 text-black"
            : "bg-transparent/80 py-6 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* MOBILE MENU BUTTON */}
          <button 
            onClick={() => setMobileOpen(true)} 
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-sm font-medium tracking-wide">
            {navLinks.map((link, index) => (
              <div key={index} className={`group relative ${link.megaMenu ? '' : 'inline-block'}`}>
                <Link 
                  href={link.href}
                  className="flex items-center gap-1 py-2 px-1 relative hover:text-black/90 transition-colors duration-200"
                >
                  {link.name}
                  {link.megaMenu && (
                    <span className="transition-transform duration-200 group-hover:rotate-180">
                      <ChevronDown size={14} />
                    </span>
                  )}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full origin-left rounded-full" />
                </Link>
                
                {link.megaMenu && renderMegaMenu(link, index)}
              </div>
            ))}
          </nav>

          {/* LOGO */}
          <Link href="/" className="flex-shrink-0" aria-label="Home">
            <Image
              src={isScrolled ? "/images/velmora-d.png" : "/images/velmora-white.png"}
              alt="Velmora"
              width={isScrolled ? 110 : 130}
              height={32}
              className="transition-all duration-500 hover:scale-105 active:scale-95"
              priority
            />
          </Link>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* SEARCH */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 lg:hover:bg-white/20 transition-all duration-200 group"
              aria-label="Search"
            >
              <Search size={20} className="group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* USER */}
            <button className="p-2 rounded-lg hover:bg-white/10 lg:hover:bg-white/20 transition-all duration-200 group hidden xl:block">
              <User size={20} className="group-hover:scale-110 transition-transform duration-200" />
            </button>

            {/* CART */}
            <Link 
              href="/checkout" 
              className="relative p-2 rounded-lg hover:bg-white/10 lg:hover:bg-white/20 transition-all duration-200 group"
              aria-label={`View cart, ${cartCount} items`}
            >
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform duration-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium shadow-lg animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Search Velmora"
        >
          <div ref={searchRef} className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Velmora..."
                className="w-full bg-white/10 backdrop-blur-sm border-0 border-b-2 border-white/30 text-white text-xl lg:text-2xl py-6 px-4 outline-none 
                           placeholder-white/70 focus:border-white focus:placeholder-white/50 transition-all duration-300 rounded-lg"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                aria-label="Search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 group"
            aria-label="Close search"
          >
            <X size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[998] transition-all duration-500 ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        {/* OVERLAY */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeAllMenus}
          aria-hidden="true"
        />

        {/* MENU PANEL */}
        <div
          ref={mobileMenuRef}
          className={`absolute left-0 top-0 h-full w-full max-w-sm bg-white text-black shadow-2xl transform transition-transform duration-500 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          } overflow-y-auto`}
        >
          {/* TOP BAR */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex-shrink-0" onClick={closeAllMenus}>
                <Image
                  src="/images/velmora-d.png"
                  alt="Velmora"
                  width={140}
                  height={36}
                  className="hover:scale-105 transition-transform duration-200"
                />
              </Link>
              <button 
                onClick={closeAllMenus}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                aria-label="Close menu"
              >
                <X size={24} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="p-6 pb-24 space-y-1">
            {navLinks.map((link, index) => (
              <div key={index} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => toggleMenu(link.name.toLowerCase())}
                  className="w-full flex justify-between items-center py-6 px-2 text-lg font-light hover:bg-gray-50 rounded-xl transition-all duration-200"
                >
                  <span>{link.name}</span>
                  <span className="transition-transform duration-200">
                    {openMenu === link.name.toLowerCase() ? 
                      <ChevronUp size={20} /> : 
                      <ChevronDown size={20} />
                    }
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openMenu === link.name.toLowerCase() ? "max-h-96 mt-4 opacity-100" : "max-h-0 mt-0 opacity-0"
                  }`}
                >
                  <div className="pl-6 space-y-3 mb-6">
                    {link.subcategories?.map((cat: any, i: number) => (
                      <div key={i}>
                        <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                          {cat.title}
                        </h5>
                        <ul className="space-y-2">
                          {cat.items.map((item: string, j: number) => (
                            <li key={j}>
                              <Link 
                                href="/shop" 
                                onClick={closeAllMenus}
                                className="block py-2 text-base text-gray-700 hover:text-black hover:pl-2 transition-all duration-200"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mobile images */}
                  {link.images && (
                    <div className="grid grid-cols-2 gap-4 px-2">
                      {link.images.map((img: any, i: number) => (
                        <Link 
                          href="/shop" 
                          key={i}
                          onClick={closeAllMenus}
                          className="group relative rounded-2xl overflow-hidden shadow-lg"
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={200}
                            height={150}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <p className="absolute bottom-2 left-3 text-white font-medium text-sm drop-shadow-lg">
                            {img.label}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </nav>

          {/* BOTTOM ACTIONS */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row gap-4">
            <Link 
              href="/account"
              onClick={closeAllMenus}
              className="flex items-center justify-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-200 text-sm font-medium"
            >
              <User size={20} />
              Account
            </Link>
            <Link 
              href="/checkout"
              onClick={closeAllMenus}
              className="flex items-center justify-center gap-3 p-4 bg-black text-white hover:bg-gray-900 rounded-2xl transition-all duration-200 text-sm font-medium relative"
            >
              <ShoppingCart size={20} />
              Cart ({cartCount || 0})
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}