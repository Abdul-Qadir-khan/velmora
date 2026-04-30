"use client";

import { usePathname } from "next/navigation"; // 🔥 For active tab detection
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Home, ShoppingBag, Grid3X3, User, Menu, X, Search, ShoppingCart, Heart, Loader2, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname(); // 🔥 Track current page

  const router = useRouter();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  // 🔥 DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 🔥 SEARCH FUNCTION (Fixed)
  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      console.log('🔍 Searching:', query);
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      console.log('📡 Response:', response.status);
      const data = await response.json();
      console.log('📦 Data:', data);

      const products = data.products || [];
      setSearchResults(products.slice(0, 6));
    } catch (error) {
      console.error("🔥 Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      searchProducts(debouncedSearch);
    }
  }, [debouncedSearch, searchProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 🔥 HEADER */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-white py-4 text-black shadow-lg" : "bg-transparent py-6 text-white"
        }`}>
        <div className="max-w-7xl mx-auto px-5 md:px-0 flex items-center justify-between">
          {/* Mobile menu button */}
          {/* <button onClick={() => setMobileOpen(true)} className="md:hidden p-1">
            <Menu size={26} />
          </button> */}

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-10 text-md font-light tracking-wide">
            <Link href="/shop" className="relative group">
              Shop
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="relative group">
              About
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="relative group">
              Contact Us
              <span className="absolute left-0 -bottom-1 w-0 h-px bg-current transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 z-10">
            <Image
              src="/images/lycoonwear-logo.png"
              alt="Lycoonwear"
              width={isScrolled ? 70 : 90}
              height={32}
              className={`transition-all duration-500 ${isScrolled ? "" : "invert"}`}
              priority
            />
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1 hover:scale-110 transition"
            >
              <Search size={24} className="cursor-pointer hover:opacity-70 transition" />
            </button>

            <Link href="/wishlist" className="relative p-1 hover:scale-110 transition hidden md:block">
              <Heart size={24} className="cursor-pointer hover:opacity-70 transition" />
              {isClient && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/checkout" className="relative p-1 hover:scale-110 transition hidden md:block">
              <ShoppingCart size={24} className="cursor-pointer hover:opacity-70 transition" />
              {isClient && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

        <Link href="/wishlist" className="relative p-1 hover:scale-110 transition md:hidden block">
          <Heart size={24} className="cursor-pointer hover:opacity-70 transition" />
          {isClient && wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">
              {wishlistCount}
            </span>
          )}
        </Link>

      </div>
    </header >

      {/* 🔥 SEARCH OVERLAY */ }
  {
    searchOpen && (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999] flex flex-col">
        {/* Search bar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 flex-1">
            <Search className="text-gray-400 shrink-0" size={24} />
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products (try 'black' or 't-shirt')..."
                className="w-full bg-transparent border-0 text-white text-xl outline-none placeholder-gray-400"
              />
            </form>
          </div>
          <button onClick={closeSearch} className="p-2 hover:bg-gray-800/50 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {isSearching ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 className="animate-spin mr-3" size={28} />
              <span className="text-lg">Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold text-white mb-6">
                {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found
              </h3>
              <div className="space-y-3">
                {searchResults.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    onClick={closeSearch}
                    className="group flex items-center gap-4 p-4 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/20"
                  >
                    <div className="w-16 h-16 bg-linear-to-br from-gray-700 to-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate group-hover:text-blue-400 transition">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-400 truncate">{product.category}</p>
                      <p className="text-xl font-bold text-white mt-1">₹{product.price}</p>
                    </div>
                    <ChevronRight className="text-gray-500 group-hover:text-white shrink-0" size={20} />
                  </Link>
                ))}
              </div>
              <button
                onClick={handleSearchSubmit}
                className="w-full mt-8 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                View All {searchResults.length} Results
              </button>
            </>
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center h-80 text-center text-gray-400">
              <Search className="mx-auto mb-6 opacity-30" size={64} />
              <h3 className="text-2xl font-bold mb-3">No products found</h3>
              <p className="text-lg mb-6">Try "black", "t-shirt", or "baseball"</p>
              <button
                onClick={handleSearchSubmit}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-medium transition"
              >
                Search "{searchQuery}"
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-center text-gray-400">
              <Search className="mx-auto mb-6 opacity-30" size={64} />
              <h3 className="text-2xl font-bold mb-3">Search Products</h3>
              <p className="text-lg">Try "black t-shirt" or "baseball"</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  {/* 🔥 BOTTOM TABS MOBILE MENU - APP STYLE */ }
  <div className="fixed bottom-0 left-0 right-0 z-[999] md:hidden">
    {/* Blur Background */}
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/10 to-transparent backdrop-blur-sm" />

    {/* Glass Effect Container */}
    <div className="relative bg-white/90 backdrop-blur-xl border-t border-white/50 shadow-2xl">
      <div className="grid grid-cols-4 gap-2 p-3 max-w-4xl mx-auto h-20">

        {/* 1. Home */}
        <Link
          href="/"
          className="group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 hover:bg-blue-50 active:bg-blue-100"
        >
          <div className="relative">
            <Home size={24} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
            {pathname === "/" && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm" />
            )}
          </div>
          <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-blue-600">Home</span>
        </Link>

        {/* 2. Shop */}
        <Link
          href="/shop"
          className="group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 hover:bg-emerald-50 active:bg-emerald-100"
        >
          <div className="relative">
            <ShoppingBag size={24} className="text-gray-600 group-hover:text-emerald-600 transition-colors" />
            {pathname === "/shop" && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-600 rounded-full border-2 border-white shadow-sm" />
            )}
          </div>
          <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-emerald-600">Shop</span>
        </Link>

        {/* 4. Cart */}
        <Link
          href="/cart"
          className="group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 hover:bg-orange-50 active:bg-orange-100"
        >
          <div className="relative">
            <ShoppingCart size={24} className="text-gray-600 group-hover:text-orange-600 transition-colors" />
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                {cartCount > 99 ? "99+" : cartCount}
              </div>
            )}
            {pathname === "/cart" && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-600 rounded-full border-2 border-white shadow-sm" />
            )}
          </div>
          <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-orange-600">Cart</span>
        </Link>

        {/* 5. Profile */}
        <Link
          href="/profile"
          className="group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 hover:bg-indigo-50 active:bg-indigo-100"
        >
          <div className="relative">
            <User size={24} className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
            {pathname === "/profile" && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-sm" />
            )}
          </div>
          <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-indigo-600">Profile</span>
        </Link>

      </div>
    </div>
  </div>
    </>
  );
}