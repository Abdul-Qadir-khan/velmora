// app/context/CartContext.tsx - FIXED VERSION
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  images: any;  // Keep flexible
  selectedSize?: string;
  selectedColor?: string;
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

  // 🔧 FIXED: Sync with backend + transform data properly
  const syncWithBackend = useCallback(async () => {
    try {
      console.log("🔄 Syncing cart with backend...");
      setIsLoading(true);
      
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      
      const { cart: serverCart } = await res.json();
      console.log("📦 Raw server cart:", serverCart);
      
      // 🔑 TRANSFORM Prisma data to Checkout format
      const uiCart: CartItem[] = serverCart.map((item: any) => {
        console.log("🖼️ Processing item images:", item.product?.images);
        
        return {
          id: item.productId || item.product?.id,
          name: item.product?.name || "Unknown Product",
          price: parseFloat(item.product?.price || 0),
          qty: item.quantity || 1,  // ✅ Prisma uses 'quantity'
          images: item.product?.images,  // ✅ Pass raw images (string or array)
          selectedSize: item.selectedSize || "M",
          selectedColor: item.selectedColor || "#000000",
        };
      });
      
      console.log("✅ Transformed cart:", uiCart);
      setCart(uiCart);
      
    } catch (error) {
      console.error("Cart sync error:", error);
      setCart([]); // Empty on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  const addToCart = async (slug: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, quantity }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to add to cart');
      }
      
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