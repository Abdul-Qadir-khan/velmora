"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingCart, User, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

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
          <nav className="hidden md:flex gap-10 text-sm tracking-wide">

            {/* MEN */}
            <div className="group">
              <span className="cursor-pointer relative">
                Men
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
              </span>

              {/* MEGA MENU */}
              <div className="absolute left-0 top-full w-full bg-white border-t-1 border-gray-300 text-black opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-500 shadow-xl">
                <div className="max-w-7xl mx-auto px-20 py-12 grid grid-cols-4 gap-10">

                  {/* LINKS */}
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 mb-4">Clothing</h4>
                    <ul className="space-y-2">
                      <li><Link href="/shop">T-Shirts</Link></li>
                      <li><Link href="/shop">Shirts</Link></li>
                      <li><Link href="/shop">Jeans</Link></li>
                      <li><Link href="/shop">Jackets</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-gray-500 mb-4">Collections</h4>
                    <ul className="space-y-2">
                      <li><Link href="/shop">New Arrivals</Link></li>
                      <li><Link href="/shop">Essentials</Link></li>
                      <li><Link href="/shop">Best Sellers</Link></li>
                    </ul>
                  </div>

                  {/* IMAGE 1 */}
                  <div className="group cursor-pointer">
                    <img
                      src="/images/categories/mens-wear.avif"
                      className="w-full h-[250px] object-cover transition duration-500 group-hover:scale-105"
                    />
                    <p className="mt-3 text-sm">Summer Edit</p>
                  </div>

                  {/* IMAGE 2 */}
                  <div className="group cursor-pointer">
                    <img
                      src="/images/categories/womens-wear.avif"
                      className="w-full h-[250px] object-cover transition duration-500 group-hover:scale-105"
                    />
                    <p className="mt-3 text-sm">Minimal Fits</p>
                  </div>

                </div>
              </div>
            </div>

            {/* WOMEN */}
            <div className="group">
              <span className="cursor-pointer relative">
                Women
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
              </span>

              <div className="absolute left-0 top-full w-full bg-white border-t-1 border-gray-300 text-black opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-500 shadow-xl">
                <div className="max-w-7xl mx-auto px-20 py-12 grid grid-cols-4 gap-10">

                  <div>
                    <h4 className="text-xs uppercase text-gray-500 mb-4">Clothing</h4>
                    <ul className="space-y-2">
                      <li><Link href="/shop">Dresses</Link></li>
                      <li><Link href="/shop">Tops</Link></li>
                      <li><Link href="/shop">Denim</Link></li>
                      <li><Link href="/shop">Outerwear</Link></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-gray-500 mb-4">Collections</h4>
                    <ul className="space-y-2">
                      <li><Link href="/shop">New Arrivals</Link></li>
                      <li><Link href="/shop">Essentials</Link></li>
                      <li><Link href="/shop">Trending</Link></li>
                    </ul>
                  </div>

                  <div>
                    <img
                      src="/images/categories/night-wear.avif"
                      className="w-full h-[250px] object-cover transition duration-500 hover:scale-105"
                    />
                    <p className="mt-3 text-sm">New Season</p>
                  </div>

                  <div>
                    <img
                      src="/images/categories/kids-wear.avif"
                      className="w-full h-[250px] object-cover transition duration-500 hover:scale-105"
                    />
                    <p className="mt-3 text-sm">Evening Wear</p>
                  </div>

                </div>
              </div>
            </div>

            {/* SIMPLE LINKS */}
            <Link href="/new" className="relative group">
              New
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link href="/sale" className="relative group">
              Sale
              <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>

          </nav>

          {/* LOGO */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src={
                isScrolled
                  ? "/images/velmora-d.png"
                  : "/images/velmora-white.png"
              }
              alt="Velmora"
              width={isScrolled ? 100 : 120}
              height={30}
              className="transition-all duration-500"
            />
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-4 md:gap-6">

            {/* SEARCH */}
            <button onClick={() => setSearchOpen(true)}>
              <Search className="hover:opacity-70 transition" />
            </button>

            {/* USER */}
            <User className="hover:opacity-70 transition cursor-pointer hidden md:block" />

            {/* Wishlist */}
            <Link href="/wishlist" className="relative">
              <Heart className="hover:opacity-70 transition" />
              {isClient && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-black text-white w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/checkout" className="relative">
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
              placeholder="Search Velmora..."
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
                  src="/images/velmora-d.png"
                  alt="Velmora"
                  width={120}
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

            {/* MEN */}
            <div>
              <button
                onClick={() => toggleMenu("men")}
                className="w-full flex justify-between items-center border-b pb-3"
              >
                Men
                <span className="text-lg">{openMenu === "men" ? "−" : "+"}</span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ${openMenu === "men" ? "max-h-60 mt-4" : "max-h-0"
                  }`}
              >
                <ul className="space-y-3 text-base text-gray-600 pl-2">
                  <li><Link href="/shop">T-Shirts</Link></li>
                  <li><Link href="/shop">Shirts</Link></li>
                  <li><Link href="/shop">Jeans</Link></li>
                  <li><Link href="/shop">Jackets</Link></li>
                </ul>
              </div>
            </div>

            {/* WOMEN */}
            <div>
              <button
                onClick={() => toggleMenu("women")}
                className="w-full flex justify-between items-center border-b pb-3"
              >
                Women
                <span className="text-lg">{openMenu === "women" ? "−" : "+"}</span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ${openMenu === "women" ? "max-h-60 mt-4" : "max-h-0"
                  }`}
              >
                <ul className="space-y-3 text-base text-gray-600 pl-2">
                  <li><Link href="/shop">Dresses</Link></li>
                  <li><Link href="/shop">Tops</Link></li>
                  <li><Link href="/shop">Denim</Link></li>
                  <li><Link href="/shop">Outerwear</Link></li>
                </ul>
              </div>
            </div>

            {/* SIMPLE LINKS */}
            <Link
              href="/new"
              onClick={() => setMobileOpen(false)}
              className="border-b pb-3"
            >
              New
            </Link>

            <Link
              href="/sale"
              onClick={() => setMobileOpen(false)}
              className="border-b pb-3"
            >
              Sale
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