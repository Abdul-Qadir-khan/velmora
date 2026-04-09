"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  images: string[];
  selectedSize: string;
  selectedColor: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  // 🔥 FIXED: CORRECT cartCount
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Safe API sync
  const syncWithBackend = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(Array.isArray(data) ? data : []);
        setIsSynced(true);
      }
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load + periodic sync
  useEffect(() => {
    syncWithBackend();
    const interval = setInterval(syncWithBackend, 5000); // 5s sync
    return () => clearInterval(interval);
  }, [syncWithBackend]);

  // 🔥 FIXED: OPTIMISTIC UPDATES - Instant UI + Backend sync
  const addToCart = (item: Omit<CartItem, 'qty'> & { qty?: number }) => {
    const newItem: CartItem = {
      ...item,
      id: Number(item.id),
      qty: item.qty || 1,
      price: Number(item.price),
    };

    // 1. OPTIMISTIC: Update UI instantly
    setCart(prev => {
      const existing = prev.find(c => c.id === newItem.id);
      if (existing) {
        return prev.map(c =>
          c.id === newItem.id 
            ? { ...c, qty: c.qty + newItem.qty }
            : c
        );
      }
      return [...prev, newItem];
    });

    // 2. BACKEND: Sync in background
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    }).catch(console.error);
  };

  const removeFromCart = (id: number) => {
    // 1. OPTIMISTIC: Remove instantly
    setCart(prev => prev.filter(c => Number(c.id) !== id));

    // 2. BACKEND sync
    fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(console.error);
  };

  const clearCart = () => {
    setCart([]);
    fetch("/api/cart", { method: "DELETE" }).catch(console.error);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartCount,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};