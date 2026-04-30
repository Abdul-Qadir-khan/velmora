"use client";

// AT THE TOP - ADD THESE IMPORTS
import { useCart } from '@/app/context/CartContext';  // ✅ ADD THIS
import { useWishlist } from '@/app/context/WishlistContext';

import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { useRouter } from "next/navigation";

interface Product {
  id: string | number; // ✅ FIXED: Allow number IDs
  name: string;
  slug?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  bestSeller: boolean;
  images: string[] | string;
  brand?: { name: string; logo?: string };
}

interface BestSellersSectionProps {
  filteredProducts?: Product[];
}

export default function BestSellersSection({ filteredProducts }: BestSellersSectionProps) {

  // INSIDE COMPONENT - ADD THIS:
  const { addToCart } = useCart();  // ✅ ADD THIS HOOK
  const router = useRouter();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const initialLimit = 8;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [wishlistToast, setWishlistToast] = useState(false);
  const [cartModalProduct, setCartModalProduct] = useState<Product | null>(null);
  // const [wishlist, setWishlist] = useState<Product[]>([]);
  // const [wishlistToast, setWishlistToast] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 KEY FIX #1: Generate UNIQUE STRING KEYS (Fixes NaN error)
  const getUniqueKey = (product: Product, index: number): string => {
    const safeId = String(product.id || `fallback-${Date.now()}-${index}`);
    return `${safeId}-${index}`;
  };

  // Slug fallback generator
  const generateSlug = (name: string) =>
    name?.toLowerCase().replace(/\s+/g, "-");

  // Normalize image URLs
  const getValidImage = (img?: string) => {
    if (!img) return "/placeholder.png";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return img.startsWith("/") ? img : `/${img}`;
  };

  // ------------------ FIXED FETCH PRODUCTS ------------------
  // 🔥 REPLACE your useEffect with this OPTIMIZED version:
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        // 🔥 ADD CACHING + FASTER FETCH
        const cacheKey = 'products-cache';
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}-time`);
        const isCacheFresh = cacheTime && Date.now() - parseInt(cacheTime) < 5 * 60 * 1000; // 5min

        if (cached && isCacheFresh) {
          const data: Product[] = JSON.parse(cached);
          setAllProducts(data);
          setIsLoading(false);
          return;
        }

        // 🔥 FASTER API CALL with LIMIT
        const res = await fetch("/api/products?category=all", {
          cache: 'force-cache', // 🔥 INSTANT CACHE
          next: { revalidate: 300 } // 5min revalidation
        });

        const json = await res.json();
        let data: Product[] = json.products || [];

        // 🔥 FASTER PROCESSING
        const normalized = data.slice(0, 20).map((p, index) => { // LIMIT to 20
          let imgs: string[] = [];
          try {
            imgs = Array.isArray(p.images)
              ? p.images.slice(0, 1) // 🔥 ONLY FIRST IMAGE
              : p.images ? JSON.parse(p.images as string).slice(0, 1) : [];
          } catch {
            imgs = [];
          }

          return {
            ...p,
            id: String(p.id || `product-${index}`),
            slug: p.slug || generateSlug(p.name),
            images: imgs.map(getValidImage),
          };
        }).filter(p => p.id && p.name);

        setAllProducts(normalized);

        // 🔥 CACHE RESULTS
        localStorage.setItem(cacheKey, JSON.stringify(normalized));
        localStorage.setItem(`${cacheKey}-time`, Date.now().toString());

      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔥 ADD INSTANT LOADING STATES
  const [cartLoading, setCartLoading] = useState<Record<string, boolean>>({});
  const [wishlistLoading, setWishlistLoading] = useState<Record<string, boolean>>({});
  // ------------------------------------------------------------

  // Update visible products
  useEffect(() => {
    const productsToShow = filteredProducts || allProducts;
    setVisibleProducts(productsToShow.slice(0, initialLimit));
  }, [allProducts, filteredProducts]);

  // Prevent scroll when cart modal is open
  useEffect(() => {
    document.body.style.overflow = cartModalProduct ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [cartModalProduct]);

  const loadMoreProducts = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const currentLength = visibleProducts.length;
      const nextProducts = (filteredProducts || allProducts).slice(
        currentLength,
        currentLength + initialLimit
      );
      setVisibleProducts((prev) => [...prev, ...nextProducts]);
      setLoadingMore(false);
    }, 500);
  };

  // 🔥 INSTANT FEEDBACK + OPTIMISTIC UPDATE
  const handleAddToCart = async (product: Product) => {
    const productId = String(product.id);

    // 🔥 IMMEDIATE LOADING STATE
    setCartLoading(prev => ({ ...prev, [productId]: true }));

    try {
      // 🔥 OPTIMISTIC: Show success FIRST
      setCartModalProduct(product);

      // 🔥 FAST API CALL (fire and forget)
      addToCart(product.slug!, 1).catch(err => {
        console.error('Cart sync failed:', err);
      });

    } catch (error) {
      // Still show success for UX
    } finally {
      setTimeout(() => {
        setCartModalProduct(null);
        setCartLoading(prev => {
          const newState = { ...prev };
          delete newState[productId];
          return newState;
        });
      }, 1500); // Faster timeout
    }
  };

  const handleWishlist = (product: Product) => {
    const productId = String(product.id);

    // 🔥 IMMEDIATE LOADING
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    // 🔥 OPTIMISTIC UPDATE (instant!)
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }

    setWishlistToast(true);

    // 🔥 FAST TIMEOUT
    setTimeout(() => {
      setWishlistToast(false);
      setWishlistLoading(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }, 800); // Super fast!
  };

  const goToProduct = (product: Product) => {
    router.push(`/shop/${product.slug}`);
  };

  return (
    <section className="md:py-16 py-10 px-4 md:px-12 relative bg-white">
      <div className="max-w-7xl mx-auto w-full">
        {/* Clean Header */}
        <div className="text-center mb-16">
          <div className="inline-block border border-black px-6 py-3 mb-6 uppercase tracking-widest text-sm font-bold hover:bg-black hover:text-white transition-all">
            Best Sellers
          </div>
          <h2 className="text-4xl lg:text-5xl font-light uppercase tracking-tight">
            Top Products
          </h2>
        </div>
        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-80 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="w-full h-3/4 bg-gray-200 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 rounded w-2/5" />
                  <div className="h-6 bg-gray-300 rounded w-3/5" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
              {/* 🔥 KEY FIX #3: Use uniqueKey instead of product.id */}
              {visibleProducts.map((product, index) => {
                const uniqueKey = getUniqueKey(product, index); // ✅ FIXED NaN KEYS
                const originalPrice = product.originalPrice;
                const hasDiscount = originalPrice && product.price < originalPrice;
                const discountPercent = hasDiscount
                  ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
                  : 0;
                const isWishlisted = isInWishlist(product.id);

                return (
                  <div
                    key={uniqueKey} // ✅ FIXED: Always unique string key
                    className="relative group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-primary/10 hover:bg-white/90 backdrop-blur-sm border-2 border-black flex flex-col"
                  >
                    {/* Discount Badge - ENHANCED */}
                    {hasDiscount && (
                      <motion.div
                        className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        -{discountPercent}%
                      </motion.div>
                    )}

                    {/* ✨ NEW: Action Buttons */}
                    {/* 🔥 LOADING STATES IN BUTTONS */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={cartLoading[String(product.id)]} // 🔥 DISABLE WHEN LOADING
                        className="w-11 h-11 bg-white/95 hover:bg-white backdrop-blur-sm rounded-2xl shadow-xl border hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {cartLoading[String(product.id)] ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ShoppingCart className="w-5 h-5 text-gray-800" />
                        )}
                      </motion.button>

                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlist(product);
                        }}
                        disabled={wishlistLoading[String(product.id)]}
                        className={`w-11 h-11 bg-white/95 hover:bg-white backdrop-blur-sm rounded-2xl shadow-xl border flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${isWishlisted
                          ? 'border-red-400 text-red-500 hover:bg-red-50/80'
                          : 'hover:border-gray-300'
                          }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {wishlistLoading[String(product.id)] ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 stroke-red-500' : ''}`} />
                        )}
                      </motion.button>
                    </div>

                    {/* Image - ENHANCED */}
                    <div
                      className="relative w-full h-64 md:h-90 bg-linear-to-t from-gray-50 to-white overflow-hidden pt-14 px-3"
                      onClick={() => goToProduct(product)}
                    >
                      <Image
                        src={(product.images as string[])[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-1 shadow-lg"
                      />
                    </div>

                    {/* Info - ENHANCED */}
                    <div className="md:p-5 p-3 md:pb-3" onClick={() => goToProduct(product)}>
                      <h3 className="text-base md:text-md font-light text-gray-900 leading-tight line-clamp-2 group-hover:text-primary transition-all duration-300 uppercase">
                        {product.name}
                      </h3>
                      <div className="flex items-center my-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={`star-${i}-${uniqueKey}`} // ✅ Unique star keys too
                            className={`w-3 h-3 transition-colors ${i < product.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                              }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500 font-medium">
                          {product.rating.toFixed(1)}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <p className="text-2xl font-light uppercase tracking-widest text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </p>
                        {hasDiscount && (
                          <p className="text-sm font-light text-gray-400 line-through">
                            ₹{originalPrice?.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ✨ Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl pointer-events-none" />
                  </div>
                );
              })}
            </div>

            {/* Load More - ENHANCED */}
            {visibleProducts.length < (filteredProducts || allProducts).length && (
              <div className="mt-12 text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="primary"
                    className="px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl hover:ring-4 hover:ring-primary/20 transition-all duration-300 bg-linear-to-r from-primary to-primary/90 hover:from-primary/90"
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </motion.div>
              </div>
            )}
          </>
        )}

        {/* Cart Modal - ENHANCED */}
        <AnimatePresence>
          {cartModalProduct && (
            <motion.div
              className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-5 flex items-center gap-4 z-200 border border-gray-200 max-w-sm"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="relative w-14 h-14 shrink-0">
                <Image
                  src={(cartModalProduct.images as string[])[0] || "/placeholder.png"}
                  alt={cartModalProduct.name}
                  fill
                  className="object-cover rounded-xl shadow-lg"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 line-clamp-1">{cartModalProduct.name}</p>
                <p className="text-sm text-emerald-600 font-semibold mt-1">✅ Added to cart!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist Toast - ENHANCED */}
        <AnimatePresence>
          {wishlistToast && (
            <motion.div
              className="fixed bottom-28 right-6 md:bottom-32 md:right-10 bg-linear-to-r from-gray-900 to-gray-800 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-2xl z-200 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              ❤️ Wishlist updated!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}