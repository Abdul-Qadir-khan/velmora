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
  isSyncing: boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const wishlistCount = wishlist.length;

  const addToWishlist = useCallback((product: Product) => {
    if (wishlist.some(p => String(p.id) === String(product.id))) return;
    
    // 1. OPTIMISTIC UI
    setWishlist(prev => [...prev, { ...product, id: String(product.id) }]);
    
    // 2. SAVE TO COOKIES
    fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
      credentials: 'include'  // ✅ INCLUDE COOKIES
    }).catch(console.error);
  }, [wishlist]);

  const removeFromWishlist = useCallback((id: string | number) => {
    // 1. OPTIMISTIC UI
    setWishlist(prev => prev.filter(p => String(p.id) !== String(id)));
    
    // 2. SAVE TO COOKIES
    fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      credentials: 'include'  // ✅ INCLUDE COOKIES
    }).catch(console.error);
  }, []);

  const isInWishlist = useCallback((id: string | number) => 
    wishlist.some(p => String(p.id) === String(id)), [wishlist]);

  // ✅ FIXED: Initial load ONLY - NO AUTO-SYNC
  useEffect(() => {
    const syncWishlist = async () => {
      setIsSyncing(true);
      try {
        const res = await fetch("/api/wishlist", { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setWishlist(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        // console.error("Initial wishlist load error:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    syncWishlist(); // Load once on mount
  }, []);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      isSyncing
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