"use client";

import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
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
  const initialLimit = 8;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [cartModalProduct, setCartModalProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistToast, setWishlistToast] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        const json = await res.json(); // <-- was missing extraction
        const data: Product[] = json.products || []; // <-- extract array properly

        const normalized = data.map((p) => {
          let imgs: string[] = [];
          try {
            imgs = Array.isArray(p.images)
              ? p.images
              : p.images
              ? JSON.parse(p.images)
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
        });

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

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
  }, []);

  // Prevent scroll when cart modal is open
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
    const exists = wishlist.some((p) => p.id === product.id);
    const updated = exists
      ? wishlist.filter((p) => p.id !== product.id)
      : [...wishlist, product];
    updateWishlist(updated);
    setWishlistToast(true);
    setTimeout(() => setWishlistToast(false), 1500);
  };

  const goToProduct = (product: Product) => {
    router.push(`/products/${product.slug}`);
  };

  return (
    <section className="py-16 px-4 md:px-12 bg-gradient-to-t from-primary/5 to-transparent relative">
      <div className="max-w-7xl mx-auto w-full">
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

        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No products found.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
              {visibleProducts.map((product) => {
                const originalPrice = product.originalPrice;
                const hasDiscount = originalPrice && product.price < originalPrice;
                const discountPercent = hasDiscount
                  ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
                  : 0;
                const isWishlisted = wishlist.some((p) => p.id === product.id);

                return (
                  <div
                    key={product.id}
                    className="relative group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    {/* Popular Badge */}
                    {product.bestSeller && (
                      <motion.div
                        className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold uppercase px-2 py-1 rounded"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        Popular
                      </motion.div>
                    )}

                    {/* Discount Badge */}
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
                    <div
                      className="relative w-full h-64 md:h-72 bg-gray-100 overflow-hidden"
                      onClick={() => goToProduct(product)}
                    >
                      <Image
                        src={(product.images as string[])[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw,
                               (max-width: 1024px) 50vw,
                               25vw"
                        className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4" onClick={() => goToProduct(product)}>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < product.rating ? "text-yellow-500" : "text-gray-300"}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">{product.rating}/5</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <p className="text-lg md:text-xl font-bold text-gray-900">${product.price}</p>
                        {hasDiscount && (
                          <p className="text-gray-400 line-through text-sm">${originalPrice}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {visibleProducts.length < (filteredProducts || allProducts).length && (
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
                src={(cartModalProduct.images as string[])[0] || "/placeholder.png"}
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