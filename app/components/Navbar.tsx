"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingCart, User, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FaCartPlus, FaNotesMedical, FaShopify, FaShoppingBag, FaUserAlt } from "react-icons/fa";

// const { wishlistCount } useWishlist();

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // Add client detection

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const { cartCount } = useCart();
  // const [wishlistCount, setWishlistCount] = useState(0);
  const { wishlistCount } = useWishlist(); // ✅ get wishlistCount from context

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Detect client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "New", href: "/new" },
    { name: "Sale", href: "/sale" },
  ];

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
          ? "bg-white py-4 text-black"
          : "bg-transparent py-6 text-white"
          }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-0 flex items-center justify-between">

          {/* MOBILE MENU BUTTON */}
          <button onClick={() => setMobileOpen(true)} className="md:hidden">
            <Menu size={26} />
          </button>

          {/* LEFT NAV (DESKTOP) */}
          <nav className="hidden md:flex gap-10 text-lg font-light tracking-wide">


            {/* SIMPLE LINKS */}
            <Link href="/shop" className="relative group flex items-center gap-2">
              {/* <FaShoppingBag/> */}
              Shop
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="relative group flex items-center gap-2">
              {/* <FaNotesMedical/> */}
              About
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="relative group flex items-center gap-2">
              {/* <FaUserAlt/> */}
              Contact Us
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>

          </nav>

          {/* LOGO */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/images/lycoonwear.png"
              alt="Lycoonwear"
              width={isScrolled ? 70 : 90}
              height={32}
              className={`
    transition-all duration-500 
    hover:scale-105 
    ${isScrolled ? '' : 'invert'}
  `}
              priority
            />
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-4 md:gap-6">

            {/* SEARCH */}
            <button onClick={() => setSearchOpen(true)}>
              <Search className="hover:opacity-70 transition" />
            </button>

            {/* USER */}
            <Link href="/payment" className="hidden md:block relative">
              <User className="hover:opacity-70 transition cursor-pointer hidden md:block" />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden md:block relative">
              <Heart className="hover:opacity-70 transition" />
              {isClient && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-black text-white w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/checkout" className="hidden md:block relative">
              <ShoppingCart className="hover:opacity-70 transition" />
              {isClient && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-black text-white w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black z-[999] flex items-center justify-center">
          <div className="w-full max-w-xl px-6">
            <input
              autoFocus
              type="text"
              placeholder="Search Lycoon Wear..."
              className="w-full bg-transparent border-b border-gray-600 text-white text-2xl py-3 outline-none"
            />
          </div>

          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 text-white"
          >
            <X size={28} />
          </button>
        </div>
      )}

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[998] transition ${mobileOpen ? "visible" : "invisible"
          }`}
      >
        {/* OVERLAY */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* MENU PANEL */}
        <div
          className={`absolute left-0 top-0 h-full w-full bg-white text-black p-8 transform transition duration-500 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* TOP BAR */}
          <div className="flex justify-between mb-10">
            <span className="text-lg tracking-[0.3em]">
              <Link href="/">
                <Image
                  src="/images/lycoonwear.png"
                  alt="Lycoon Wear"
                  width={70}
                  height={30}
                  className="transition-all duration-500"
                />
              </Link>
            </span>
            <button onClick={() => setMobileOpen(false)}>
              <X size={26} />
            </button>
          </div>

          {/* NAV LINKS */}
          <nav className="flex flex-col space-y-6 text-xl font-light">


            {/* SIMPLE LINKS */}
            <Link
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="border-b pb-3"
            >
              Shop
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="border-b pb-3"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="border-b pb-3"
            >
              Contact Us
            </Link>

          </nav>

          {/* BOTTOM ACTIONS */}
          <div className="absolute bottom-10 left-8 right-8 flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} />
              Cart ({isClient ? cartCount : 0})
            </div>

            <div className="flex items-center gap-2">
              <Heart size={18} />
              Wishlist ({isClient ? wishlistCount : 0})
            </div>
          </div>
        </div>
      </div>
    </>
  );
}