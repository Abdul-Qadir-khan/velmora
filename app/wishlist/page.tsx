"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

interface Product {
  id: string | number;
  name: string;
  slug?: string;
  price: number;
  images: string[] | string;
  originalPrice?: number;
  rating?: number;
  bestSeller?: boolean;
  brand?: { name: string; logo?: string };
  category?: string;
}

interface WishlistItemProps {
  product: Product;
  onRemove: (id: string | number) => void;
  onAddToCart: (product: Product) => void;
}

function WishlistItem({ product, onRemove, onAddToCart }: WishlistItemProps) {
  const productSlug = product.slug || 
    (product.name ? product.name.toLowerCase().replace(/\s+/g, "-") : "product");
  
  // 🔥 PERFECT IMAGE FIX - No more URL errors!
  const getValidImage = (images: string[] | string | undefined): string => {
    if (!images) return "/placeholder.png";
    
    let imgArray: string[] = [];
    if (typeof images === "string") {
      try {
        imgArray = JSON.parse(images);
      } catch {
        imgArray = [images];
      }
    } else if (Array.isArray(images)) {
      imgArray = images;
    }
    
    // Find first VALID image
    const firstValid = imgArray.find(img => 
      img && 
      typeof img === 'string' && 
      img.trim() && 
      img !== '' &&
      !img.startsWith('undefined') &&
      !img.includes('null')
    );
    
    return firstValid || "/placeholder.png";
  };

  const imageSrc = getValidImage(product.images);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition"
    >
      <Link href={`/shop/${productSlug}`}>
        <div className="relative h-56 bg-gray-100">
          {/* ✅ SAFE IMAGE - No more errors */}
          <Image
            src={imageSrc}
            alt={product.name || "Product"}
            fill
            className="object-contain p-4"
            sizes="300px"
            priority={false}
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/shop/${productSlug}`}>
          <h3 className="font-semibold text-gray-900 truncate">
            {product.name || "Unnamed Product"}
          </h3>
        </Link>

        <p className="text-lg font-bold mt-2 text-gray-900">
          ₹{Number(product.price || 0).toLocaleString()}
        </p>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 text-sm bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>

          <button
            onClick={() => onRemove(product.id)}
            className="text-red-500 hover:text-red-700 transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setIsLoading(true);
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("wishlist");
          if (stored) {
            const wishlistIds = JSON.parse(stored) as (string | number)[];
            
            if (wishlistIds.length > 0) {
              // 🔥 Safe API call
              const params = new URLSearchParams();
              wishlistIds.slice(0, 20).forEach(id => params.append('ids', String(id))); // Limit 20
              
              const response = await fetch(`/api/products?${params}`);
              if (response.ok) {
                const data = await response.json();
                const products: Product[] = (data.products || [])
                  .map((p: any) => ({
                    ...p,
                    id: String(p.id),
                    slug: p.slug || p.name?.toLowerCase().replace(/\s+/g, "-")
                  }))
                  .filter((p: Product) => p.id && p.name);
                
                setWishlist(products);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const updateWishlist = (newItems: Product[]) => {
    setWishlist(newItems);
    try {
      if (typeof window !== "undefined") {
        const ids = newItems.map(p => p.id);
        localStorage.setItem("wishlist", JSON.stringify(ids));
      }
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
  };

  const removeItem = (id: string | number) => {
    const updated = wishlist.filter((item) => String(item.id) !== String(id));
    updateWishlist(updated);
  };

  const handleAddToCart = (product: Product) => {
    try {
      addToCart({
        id: Number(product.id),
        name: product.name || "Product",
        price: Number(product.price),
        qty: 1,
        images: Array.isArray(product.images) ? product.images : [String(product.images)],
        selectedSize: "M",
        selectedColor: "#000000",
      });
      
      removeItem(product.id);
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const getUniqueKey = (product: Product, index: number): string => {
    return `${String(product.id || `fallback-${Date.now()}`)}-${index}`;
  };

  if (isLoading) {
    return (
      <section className="min-h-screen px-4 md:px-12 py-16 bg-gray-50 flex items-center justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl w-full">
          {[...Array(8)].map((_, i) => (
            <div key={`skeleton-${i}`} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    // ... rest of JSX unchanged - same as before
    <>
      <section className="px-4 md:px-12 pt-30 pb-5 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Your Wishlist ({wishlist.length})
            </h1>
            <p className="text-gray-500 mt-2">
              Save items you love and buy them later
            </p>
          </div>
        </div>
      </section>

      <section className="min-h-screen px-4 md:px-12 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 mb-8">
                Browse products and add your favorites ❤️
              </p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <AnimatePresence>
                {wishlist.map((product, index) => (
                  <WishlistItem
                    key={getUniqueKey(product, index)}
                    product={product}
                    onRemove={removeItem}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </>
  );
}