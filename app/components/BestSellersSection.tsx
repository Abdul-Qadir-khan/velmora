"use client";

import Image from "next/image";
import Link from "next/link";
import { Product, products } from "../../data/product";
import { ShoppingCart, Heart } from "lucide-react";
import Button from "./Button";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface ProductSectionProps {
filteredProducts?: Product[];
}

export default function BestSellersSection({ filteredProducts }: ProductSectionProps) {
const initialLimit = 8;
const allProducts = filteredProducts || products;

const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
const [cartModalProduct, setCartModalProduct] = useState<Product | null>(null);
const [wishlist, setWishlist] = useState<Product[]>([]);
const [wishlistToast, setWishlistToast] = useState(false);
const [loadingMore, setLoadingMore] = useState(false);
const [isLoading, setIsLoading] = useState(true);

// Update products when filters change
useEffect(() => {
setVisibleProducts(allProducts.slice(0, initialLimit));
}, [filteredProducts]);

// Skeleton loading
useEffect(() => {
const timer = setTimeout(() => setIsLoading(false), 500);
return () => clearTimeout(timer);
}, []);

// Load wishlist
useEffect(() => {
const storedWishlist = localStorage.getItem("wishlist");
if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
}, []);

// Prevent background scroll when modal open
useEffect(() => {
document.body.style.overflow = cartModalProduct ? "hidden" : "auto";
}, [cartModalProduct]);

const updateWishlist = (newWishlist: Product[]) => {
setWishlist(newWishlist);
localStorage.setItem("wishlist", JSON.stringify(newWishlist));
};

const loadMoreProducts = () => {
setLoadingMore(true);
setTimeout(() => {
const currentLength = visibleProducts.length;
const nextProducts = allProducts.slice(currentLength, currentLength + initialLimit);
setVisibleProducts(prev => [...prev, ...nextProducts]);
setLoadingMore(false);
}, 500);
};

const handleAddToCart = (product: Product) => {
setCartModalProduct(product);
setTimeout(() => setCartModalProduct(null), 2000);
};

const handleWishlist = (product: Product) => {
const exists = wishlist.find(p => p.id === product.id);

let updated: Product[];
if (exists) {
  updated = wishlist.filter(p => p.id !== product.id);
} else {
  updated = [...wishlist, product];
}

updateWishlist(updated);
setWishlistToast(true);
setTimeout(() => setWishlistToast(false), 1500);

};

return ( <section className="py-16 px-4 md:px-12 bg-gradient-to-t from-primary/5 to-transparent relative"> <div className="max-w-7xl mx-auto w-full">

    {/* Header */}
    <div className="text-center mb-10 md:mb-16">
      <span className="text-sm uppercase tracking-widest text-accent font-semibold">
        Best Sellers
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mt-4 leading-tight text-gray-900">
        Our Most Popular Products
      </h2>
      <p className="text-gray-500 text-base md:text-xl mt-3 font-medium">
        Shop the best-selling items loved by our customers
      </p>
    </div>

    {/* Skeleton */}
    {isLoading ? (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
        ))}
      </div>
    ) : (
      <>
        {/* Empty State */}
        {visibleProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {visibleProducts.map(product => {
              // ✅ SAFE TYPE HANDLING
              const originalPrice = product.originalPrice;

              const hasDiscount =
                typeof originalPrice === "number" &&
                product.price < originalPrice;

              const discountPercent = hasDiscount
                ? Math.round(
                    ((originalPrice - product.price) / originalPrice) * 100
                  )
                : 0;

              const isWishlisted = wishlist.some(p => p.id === product.id);

              return (
                <div
                  key={product.id}
                  className="relative group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Popular */}
                  {product.bestSeller && (
                    <motion.div
                      className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold uppercase px-2 py-1 rounded"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      Popular
                    </motion.div>
                  )}

                  {/* Discount */}
                  {hasDiscount && (
                    <motion.div
                      className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      -{discountPercent}%
                    </motion.div>
                  )}

                  {/* Image */}
                  <div >
                    <div className="relative w-full h-64 md:h-72 bg-gray-100 overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw,
                               (max-width: 1024px) 50vw,
                               25vw"
                        className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />

                      {product.images[1] && (
                        <Image
                          src={product.images[1]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw,
                                 (max-width: 1024px) 50vw,
                                 25vw"
                          className="absolute inset-0 object-contain opacity-0 group-hover:opacity-100 transition duration-500"
                        />
                      )}

                      {/* Actions */}
                      <div className="absolute inset-0 flex items-center justify-center gap-4 
                      opacity-100 md:opacity-0 md:group-hover:opacity-100 
                      transition duration-300 bg-black/10">

                        <button
                          aria-label="Add to wishlist"
                          onClick={() => handleWishlist(product)}
                          className="p-3 bg-white rounded-full shadow-lg hover:bg-red-50 active:scale-90 transition"
                        >
                          <Heart
                            size={20}
                            className={isWishlisted ? "text-red-500 fill-red-500" : ""}
                          />
                        </button>

                        <button
                          aria-label="Add to cart"
                          onClick={() => handleAddToCart(product)}
                          className="p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/80 active:scale-90 transition"
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center mt-2 transition-transform duration-300 group-hover:scale-105">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < product.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {product.rating}/5
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex items-center gap-2">
                      <p className="text-lg md:text-xl font-bold text-gray-900">
                        ${product.price}
                      </p>

                      {hasDiscount && (
                        <p className="text-gray-400 line-through text-sm">
                          ${originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {visibleProducts.length < allProducts.length && (
          <div className="mt-12 text-center">
            <Button
              variant="primary"
              className="px-10 py-3 text-lg hover:scale-105 transition"
              onClick={loadMoreProducts}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </>
    )}

    {/* Cart Modal */}
    <AnimatePresence>
      {cartModalProduct && (
        <motion.div
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-white shadow-xl rounded-xl p-4 flex items-center gap-4 z-[200]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <Image
            src={cartModalProduct.images[0]}
            alt={cartModalProduct.name}
            width={50}
            height={50}
          />
          <div>
            <p className="font-semibold">{cartModalProduct.name}</p>
            <p className="text-sm text-gray-500">Added to cart!</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Wishlist Toast */}
    <AnimatePresence>
      {wishlistToast && (
        <motion.div
          className="fixed bottom-24 right-6 bg-black text-white px-4 py-2 rounded-lg text-sm z-[200]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
        >
          Wishlist updated
        </motion.div>
      )}
    </AnimatePresence>

  </div>
</section>

);
}
