// app/context/WishlistContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  // Load wishlist IDs from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("wishlist");
      setWishlistIds(stored ? JSON.parse(stored) : []);
    }
  }, []);

  // Fetch full product data from API when wishlistIds change
  useEffect(() => {
    if (wishlistIds.length === 0) {
      setWishlist([]);
      return;
    }

    const fetchWishlistProducts = async () => {
      try {
        const res = await fetch(`/api/products?ids=${wishlistIds.join(",")}`);
        const data: Product[] = await res.json();
        setWishlist(data);
      } catch (err) {
        console.error("Failed to fetch wishlist products", err);
      }
    };

    fetchWishlistProducts();
  }, [wishlistIds]);

  const updateLocalStorage = (ids: number[]) => {
    setWishlistIds(ids);
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(ids));
    }
  };

  const addToWishlist = (productId: number) => {
    if (!wishlistIds.includes(productId)) {
      updateLocalStorage([...wishlistIds, productId]);
    }
  };

  const removeFromWishlist = (productId: number) => {
    updateLocalStorage(wishlistIds.filter((id) => id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};