"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

interface Product {
  id: string | number;
  name: string;
  slug?: string;
  price: number;
  images: string[] | string;
}

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const wishlistCount = wishlist.length;

  // 🔥 OPTIMISTIC: Instant UI updates
  const addToWishlist = (product: Product) => {
    if (wishlist.some(p => String(p.id) === String(product.id))) return;
    
    // 1. INSTANT UI update
    setWishlist(prev => [...prev, { ...product, id: String(product.id) }]);
    
    // 2. Backend sync (fire & forget)
    fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    }).catch(console.error);
  };

  const removeFromWishlist = (id: string | number) => {
    // 1. INSTANT UI update
    setWishlist(prev => prev.filter(p => String(p.id) !== String(id)));
    
    // 2. Backend sync
    fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(console.error);
  };

  const isInWishlist = (id: string | number) => 
    wishlist.some(p => String(p.id) === String(id));

  // Periodic backend sync (every 5s)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          setWishlist(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Wishlist sync error:", e);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};