"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: any) => {
  // ✅ Lazy initialization to prevent useEffect delay
  const [cart, setCart] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("velmora_cart");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  // ✅ Add item
  const addToCart = (item: any) => {
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

  // ✅ Remove item
  const removeFromCart = (itemToRemove: any) => {
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

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // ✅ Throttle localStorage writes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("velmora_cart", JSON.stringify(cart));
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [cart]);

  // ✅ Memoize context value
  const contextValue = useMemo(
    () => ({ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }),
    [cart]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);