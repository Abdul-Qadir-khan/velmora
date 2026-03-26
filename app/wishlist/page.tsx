"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../data/product";
import { ShoppingCart, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
const [wishlist, setWishlist] = useState<Product[]>([]);

// Load wishlist
useEffect(() => {
const stored = localStorage.getItem("wishlist");
if (stored) setWishlist(JSON.parse(stored));
}, []);

// Update localStorage
const updateWishlist = (items: Product[]) => {
setWishlist(items);
localStorage.setItem("wishlist", JSON.stringify(items));
};

// Remove item
const removeItem = (id: number) => {
const updated = wishlist.filter(item => item.id !== id);
updateWishlist(updated);
};

// Add to cart (UI only)
const handleAddToCart = (product: Product) => {
alert(`${product.name} added to cart`);
};

return ( <section className="min-h-screen px-4 md:px-12 py-16 bg-gray-50"> <div className="max-w-7xl mx-auto">

    {/* Header */}
    <div className="mb-10">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
        Your Wishlist
      </h1>
      <p className="text-gray-500 mt-2">
        Save items you love and buy them later
      </p>
    </div>

    {/* Empty State */}
    {wishlist.length === 0 ? (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-700">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 mt-2">
          Browse products and add your favorites ❤️
        </p>

        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        <AnimatePresence>
          {wishlist.map(product => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition"
            >
              {/* Image */}
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-56 bg-gray-100">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <p className="text-lg font-bold mt-2 text-gray-900">
                  ${product.price}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4">

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-2 text-sm bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    <ShoppingCart size={16} />
                    Add
                  </button>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

      </div>
    )}

  </div>
</section>

);
}
