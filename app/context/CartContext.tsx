// CartContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "../../data/product";

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const updateLocalStorage = (items: Product[]) => {
    setCart(items);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  };

  const addToCart = (product: Product) => {
    if (!cart.find((p) => p.id === product.id)) {
      updateLocalStorage([...cart, product]);
    }
  };

  const removeFromCart = (id: number) => {
    updateLocalStorage(cart.filter((p) => p.id !== id));
  };

  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};