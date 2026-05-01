"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo, useTransition } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";
import type { Product } from "../../types/product";

interface Props {
  initialProducts: Product[];
  searchParams: any;
}

export default function ClientProductGrid({ initialProducts, searchParams }: Props) {
  const searchParamsClient = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { addToCart } = useCart();
  const [products] = useState(initialProducts);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        const parsed = JSON.parse(stored) as Product[];
        setWishlist(parsed);
      }
    } catch (error) {
      // console.error("Wishlist load error:", error);
    }
  }, []);

  const generateSlug = (name: string) =>
    name?.toLowerCase().replace(/\s+/g, "-");

  const productsWithSlugs = useMemo(() => {
    return products.map(product => ({
      ...product,
      slug: product.slug || generateSlug(product.name || 'product'),
    }));
  }, [products]);

  const updateSearchParams = useCallback((newParams: Record<string, string | null>) => {
    startTransition(() => {
      const currentParams = new URLSearchParams(searchParamsClient.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === '') {
          currentParams.delete(key);
        } else {
          currentParams.set(key, value);
        }
      });

      const queryString = currentParams.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    });
  }, [searchParamsClient, router, pathname, startTransition]);

  const toggleWishlist = (product: Product, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    setWishlist((prev) => {
      const exists = prev.some((p) => String(p.id) === String(product.id));
      const updated = exists
        ? prev.filter((p) => String(p.id) !== String(product.id))
        : [...prev, product];

      try {
        localStorage.setItem("wishlist", JSON.stringify(updated));
        toast.success(
          exists ? `${product.name} removed from wishlist` : `${product.name} added to wishlist!`
        );
        return updated;
      } catch (error) {
        toast.error("Failed to update wishlist");
        return prev;
      }
    });
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.slug, 1);
      toast.success(`${product.name} added to cart! 🎉`, {
        duration: 3000,
        position: "top-right",
      });
    } catch (error) {
      // console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    }
  };

  const getProductImage = (images: any): string => {
    if (!images || images === null || images === undefined || images === "") {
      return "https://via.placeholder.com/400x500/6B7280/FFFFFF?text=No+Image";
    }

    let imgArray: string[] = [];
    if (typeof images === "string") {
      try {
        imgArray = JSON.parse(images);
      } catch (e) {
        imgArray = [images];
      }
    } else if (Array.isArray(images)) {
      imgArray = images;
    } else {
      imgArray = [images];
    }

    if (imgArray.length > 0) {
      const firstImage = imgArray[0];
      if (typeof firstImage === "string" && firstImage.trim()) {
        return firstImage;
      }
    }
    return "https://via.placeholder.com/400x500/6B7280/FFFFFF?text=Product";
  };

  const isWishlisted = (id: any) => wishlist.some((p) => String(p.id) === String(id));

  if (!products.length) {
    return null; // ✅ Let parent handle empty state
  }

  return (
    <div className={`transition-all duration-300 ${isPending ? 'opacity-75 blur-sm' : 'opacity-100 blur-none'}`}>
      {/* ✅ SMOOTH FULLSCREEN LOADING */}
      {isPending && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-light text-slate-700">Filtering products...</p>
          </div>
        </div>
      )}

      {/* ✅ FIXED: Single grid - Perfect responsive layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {productsWithSlugs.map((product: Product & { slug: string }) => {
          const imageSrc = getProductImage(product.images);

          return (
            <div key={String(product.id)} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative h-64 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
                <button
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 hover:bg-white/100 transition-all z-20 border"
                  onClick={(e) => toggleWishlist(product, e)}
                >
                  <Heart size={20} className={isWishlisted(product.id) ? "fill-red-500 text-red-500 scale-110" : "text-gray-500 hover:text-red-500"} />
                </button>

                <img
                  src={imageSrc}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x500/6B7280/FFFFFF?text=Product";
                  }}
                />
                
                {/* Badges */}
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold tracking-wide">
                    New
                  </span>
                )}
                {product.bestSeller && (
                  <span className="absolute bottom-4 left-4 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold tracking-wide">
                    Best Seller
                  </span>
                )}
              </div>

              <div className="p-2">
                <Link href={`/shop/${product.slug}`} className="block hover:no-underline">
                  <h3 className="font-semibold text-base line-clamp-1 hover:text-cyan-600 transition-colors">
                    {product.name || 'Unnamed Product'}
                  </h3>
                </Link>

                {/* Brand */}
                {product.brand?.name && (
                  <p className="text-xs text-slate-500 font-normal">
                    {product.brand.name}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center mb-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 transition-all ${i < (product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-1.058a1 1 0 00-1.175 0l-2.8 1.058c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-slate-500">({product.rating?.toFixed(1) || '0'})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-linear-to-r from-black to-gray-900 text-white py-3 px-6 rounded-xl font-light hover:from-gray-900 hover:to-gray-950 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transform"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}