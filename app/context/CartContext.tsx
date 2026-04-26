"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  images: any;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (slug: string, quantity?: number, selectedSize?: string, selectedColor?: string) => Promise<void>; // ✅ FIXED: Added size/color params
  removeFromCart: (productId: string | number, size?: string, color?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const syncWithBackend = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      
      const { cart: serverCart } = await res.json();
      
      // ✅ PERFECT: Already transforms size/color correctly
      const uiCart: CartItem[] = serverCart.map((item: any) => ({
        id: item.productId || item.product?.id,
        name: item.product?.name || "Unknown Product",
        price: parseFloat(item.product?.price || 0),
        qty: item.quantity || 1,
        images: item.product?.images,
        selectedSize: item.selectedSize || "M",     // ✅ SHOWS SELECTED SIZE
        selectedColor: item.selectedColor || "#000", // ✅ SHOWS SELECTED COLOR
      }));
      
      setCart(uiCart);
      
    } catch (error) {
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  // ✅ FIXED: Now accepts size/color parameters
  const addToCart = async (
    slug: string, 
    quantity: number = 1, 
    selectedSize?: string, 
    selectedColor?: string
  ) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          slug, 
          quantity,
          selectedSize,   // ✅ SEND SELECTED SIZE
          selectedColor   // ✅ SEND SELECTED COLOR
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add to cart');
      }
      
      await syncWithBackend();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string | number, size?: string, color?: string) => {
  try {
    setIsLoading(true);
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        productId, 
        selectedSize: size, 
        selectedColor: color 
      }),  // ✅ Now sends size/color for precise removal
    });
    
    if (!res.ok) throw new Error('Failed to remove from cart');
    await syncWithBackend();
  } catch (error) {
    throw error;
  } finally {
    setIsLoading(false);
  }
};

  const clearCart = async () => {
    try {
      await fetch("/api/cart", { method: "DELETE" });
      setCart([]);
    } catch (error) {
      // Silent fail
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,        // ✅ Now supports size/color
      removeFromCart,
      clearCart,
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