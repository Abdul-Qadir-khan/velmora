"use client";

import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";

// ✅ Cart item type
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  images: string[];
  selectedColor?: string;
  selectedSize?: string;
}

// ✅ Cart context type
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("velmora_cart");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) =>
          p.id === item.id &&
          p.selectedSize === item.selectedSize &&
          p.selectedColor === item.selectedColor
      );
      if (existing) {
        return prev.map((p) =>
          p.id === item.id &&
          p.selectedSize === item.selectedSize &&
          p.selectedColor === item.selectedColor
            ? { ...p, qty: p.qty + item.qty }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemToRemove: CartItem) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === itemToRemove.id &&
            item.selectedSize === itemToRemove.selectedSize &&
            item.selectedColor === itemToRemove.selectedColor
          )
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce<number>((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce<number>((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("velmora_cart", JSON.stringify(cart));
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [cart]);

  const contextValue = useMemo(
    () => ({ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }),
    [cart]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};