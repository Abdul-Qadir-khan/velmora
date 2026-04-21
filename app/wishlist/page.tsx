"use client";

import { useWishlist } from '@/app/context/WishlistContext';
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '@/app/context/CartContext';  // ✅ FIXED PATH

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

  // ✅ FIXED: Added undefined type
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
      className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/shop/${productSlug}`}>
        <div className="relative h-56 bg-gray-100">
          <Image
            src={imageSrc}
            alt={product.name || "Product"}
            fill
            className="object-contain p-4"
            sizes="300px"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/shop/${productSlug}`}>
          <h3 className="font-semibold text-gray-900 truncate text-lg leading-tight">
            {product.name || "Unnamed Product"}
          </h3>
        </Link>

        <p className="text-lg font-bold mt-2 text-gray-900">
          ₹{Number(product.price || 0).toLocaleString()}
        </p>

        <div className="flex items-center justify-between mt-4 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 flex-1 justify-center"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(product.id);
            }}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Remove from wishlist"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function WishlistPage() {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();

  const removeItem = (id: string | number) => {
    removeFromWishlist(id);
  };

  // ✅ FIXED: Use correct CartContext API (slug + quantity)
  const handleAddToCart = async (product: Product) => {
    try {
      const slug = product.slug || product.name?.toLowerCase().replace(/\s+/g, '-');
      
      console.log("✅ Adding to cart (slug):", slug);
      
      // Call CartContext with correct API
      await addToCart(slug, 1);
      
      // Remove from wishlist AFTER success
      removeFromWishlist(product.id);
      console.log("✅ Removed from wishlist");
      
    } catch (error) {
      console.error("❌ Cart add failed:", error);
    }
  };

  const getUniqueKey = (product: Product, index: number): string => {
    return `${String(product.id || `fallback-${Date.now()}`)}-${index}`;
  };

  return (
    <>
      {/* Header */}
      <section className="px-4 md:px-12 pt-24 pb-8 bg-gradient-to-r from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
              Your Wishlist
            </h1>
            <p className="text-xl text-gray-300 font-light">
              {wishlistCount} item{wishlistCount !== 1 ? 's' : ''} saved for later ❤️
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="px-4 md:px-12 py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center shadow-xl">
                <ShoppingCart className="w-14 h-14 text-gray-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-xl text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                You haven't saved any products yet. Browse our collection and add your favorites!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-black to-gray-800 text-white text-lg font-semibold rounded-2xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1"
              >
                Start Shopping
                <ShoppingCart size={20} />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <AnimatePresence mode="popLayout">
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