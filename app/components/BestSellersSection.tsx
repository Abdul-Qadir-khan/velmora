"use client";

// AT THE TOP OF YOUR FILE - ADD THIS LINE
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
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        let data: Product[] = json.products || [];

        // 🔥 KEY FIX #2: Normalize IDs to strings + validate
        data = data.map((p, index) => ({
          ...p,
          id: String(p.id || `product-${index}`), // ✅ Convert to string
        }));

        const normalized = data.map((p, index) => {
          let imgs: string[] = [];
          try {
            imgs = Array.isArray(p.images)
              ? p.images
              : p.images
                ? JSON.parse(p.images as string)
                : [];
          } catch {
            imgs = [];
          }

          imgs = imgs.map(getValidImage);

          return {
            ...p,
            slug: p.slug || generateSlug(p.name),
            images: imgs,
          };
        }).filter(p => p.id && p.name); // Remove invalid products

        setAllProducts(normalized);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
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

  const handleAddToCart = (product: Product) => {
    setCartModalProduct(product);
    setTimeout(() => setCartModalProduct(null), 2000);
  };

  const handleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
    setWishlistToast(true);
    setTimeout(() => setWishlistToast(false), 1500);
  };

  const goToProduct = (product: Product) => {
    router.push(`/shop/${product.slug}`);
  };

  return (
    <section className="md:py-16 py-10 px-4 md:px-12 relative bg-white">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header - UNCHANGED */}
        <div className="text-center mb-10 md:mb-16">
          <span className="text-sm uppercase tracking-widest text-accent font-medium">
            Best Sellers
          </span>
          <h2 className="text-2xl sm:text-2xl md:text-4xl font-semibold mt-2 leading-tight text-gray-900">
            Our Most Popular Products
          </h2>
          <p className="text-gray-500 mt-0 text-base md:text-lg font-light">
            Shop the best-selling items loved by our customers
          </p>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={`skeleton-${i}`} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No products found.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
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
                    className="relative group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-primary/10 hover:bg-white/90 backdrop-blur-sm border-2 border-gray-100 flex flex-col"
                  >
                    {/* Popular Badge - ENHANCED */}
                    {product.bestSeller && (
                      <motion.div
                        className="hidden md:block absolute top-3 left-3 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full shadow-lg z-20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        🔥 Popular
                      </motion.div>
                    )}

                    {/* Discount Badge - ENHANCED */}
                    {hasDiscount && (
                      <motion.div
                        className="absolute top-3 right-3 bg-linear-to-r from-amber-400 to-orange-400 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        -{discountPercent}%
                      </motion.div>
                    )}

                    {/* ✨ NEW: Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-11 h-11 bg-white/95 hover:bg-white backdrop-blur-sm rounded-2xl shadow-xl border hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-2xl"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingCart className="w-5 h-5 text-gray-800" />
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlist(product);
                        }}
                        className={`w-11 h-11 bg-white/95 hover:bg-white backdrop-blur-sm rounded-2xl shadow-xl border flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-2xl ${isWishlisted
                          ? 'border-red-400 text-red-500 hover:bg-red-50/80'
                          : 'hover:border-gray-300'
                          }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 stroke-red-500' : ''}`} />
                      </motion.button>
                    </div>

                    {/* Image - ENHANCED */}
                    <div
                      className="relative w-full h-64 md:h-72 bg-linear-to-t from-gray-50 to-white overflow-hidden pt-14 px-3 rounded-xl"
                      onClick={() => goToProduct(product)}
                    >
                      <Image
                        src={(product.images as string[])[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-1 shadow-lg rounded-xl"
                      />
                    </div>

                    {/* Info - ENHANCED */}
                    <div className="md:p-5 p-3 md:pb-3" onClick={() => goToProduct(product)}>
                      <h3 className="text-base md:text-md font-light text-gray-900 leading-tight line-clamp-2 group-hover:text-primary transition-all duration-300">
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
                        <p className="text-md md:text-xl font-black text-gray-900 drop-shadow-sm">
                          ${product.price.toLocaleString()}
                        </p>
                        {hasDiscount && (
                          <p className="text-sm font-light text-gray-400 line-through">
                            ${originalPrice?.toLocaleString()}
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