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
  cartCount: number;
  addToCart: (slug: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string | number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Sync with backend API
  const syncWithBackend = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart");
      if (res.ok) {
        const { cart: serverCart } = await res.json();
        
        // Transform server data to UI format
        const uiCart: CartItem[] = serverCart.map((item: any) => ({
          id: item.productId,
          name: item.product.name,
          price: parseFloat(item.product.price),
          qty: item.quantity,
          images: Array.isArray(item.product.images) ? item.product.images : [item.product.images],
          selectedSize: "M",
          selectedColor: "#000000",
        }));
        
        setCart(uiCart);
      }
    } catch (error) {
      console.error("Cart sync error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load ONLY (no auto-sync)
  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  const addToCart = async (slug: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      
      // Call your existing Prisma API
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, quantity }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add to cart');
      }

      // Refresh cart from server
      await syncWithBackend();
      
    } catch (error) {
      console.error("addToCart error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string | number) => {
    try {
      setIsLoading(true);
      
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error('Failed to remove from cart');

      // Refresh cart
      await syncWithBackend();
      
    } catch (error) {
      console.error("removeFromCart error:", error);
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
      console.error("clearCart error:", error);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,
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