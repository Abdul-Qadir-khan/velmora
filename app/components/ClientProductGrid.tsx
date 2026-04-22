"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        const parsed = JSON.parse(stored) as Product[];
        setWishlist(parsed);
      }
    } catch (error) {
      console.error("Wishlist load error:", error);
    }
  }, []);

  // Replace your entire generateSlug + productsWithSlugs with this:
const generateSlug = (name: string) =>
  name?.toLowerCase().replace(/\s+/g, "-");

const productsWithSlugs = useMemo(() => {
  return products.map(product => ({
    ...product,
    slug: product.slug || generateSlug(product.name || 'product'), // ✅ Matches BestSellers 100%
  }));
}, [products]);

  // 🔥 FIXED: Syntax error (ONLY CHANGE)
  const updateSearchParams = useCallback((newParams: Record<string, string | null>) => {
    const currentParams = new URLSearchParams(searchParamsClient.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') { // ✅ FIXED: was "value === undefined"
        currentParams.delete(key);
      } else {
        currentParams.set(key, value);
      }
    });

    const queryString = currentParams.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [searchParamsClient, router, pathname]);

  // 🔥 FIXED: ID comparison (ONLY CHANGE)
  const toggleWishlist = (product: Product, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    setWishlist((prev) => {
      const exists = prev.some((p) => String(p.id) === String(product.id)); // ✅ FIXED
      const updated = exists
        ? prev.filter((p) => String(p.id) !== String(product.id)) // ✅ FIXED
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
    // ✅ Your API expects SLUG only, NOT full object
    await addToCart(product.slug, 1);
    
    toast.success(`${product.name} added to cart! 🎉`, {
      duration: 3000,
      position: "top-right",
    });
  } catch (error) {
    console.error("Add to cart error:", error);
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

  // 🔥 FIXED: ID type (ONLY CHANGE)
  const isWishlisted = (id: any) => wishlist.some((p) => String(p.id) === String(id)); // ✅ FIXED

  if (!products.length) {
    return (
      <div className="col-span-full text-center py-20 text-gray-500">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold text-gray-600 mb-2">No products found</h3>
          <p>Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* YOUR FILTERS - 100% UNCHANGED */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg lg:block hidden sticky top-24">
        <h3 className="font-bold text-xl mb-6">Filters</h3>

        <div className="mb-8">
          <h4 className="font-semibold mb-4 text-lg border-b pb-2">Categories</h4>
          {["all", "T-Shirt", "electronics", "clothing", "mens-wear", "womens-wear"].map((cat) => (
            <button
              key={cat}
              className={`block w-full text-left py-3 px-4 rounded-xl mb-3 transition-all border-2 text-sm font-medium ${searchParamsClient.get("category") === cat
                  ? "bg-linear-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-lg border-blue-500"
                  : "bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-200 text-slate-800 hover:text-blue-700"
                }`}
              onClick={() => updateSearchParams({ category: cat === "all" ? null : cat })}
            >
              {cat === "all" ? "All Products" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h4 className="font-semibold mb-4 text-lg border-b pb-2">Price Range</h4>
          <div className="space-y-2">
            {[
              { label: "Under ₹500", value: "under-500" },
              { label: "₹500 - ₹2,000", value: "500-2000" },
              { label: "Above ₹2,000", value: "above-2000" },
            ].map(({ label, value }) => (
              <button
                key={value}
                className={`w-full py-3 px-4 rounded-xl border-2 text-left transition-all text-sm ${searchParamsClient.get("price") === value
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg border-emerald-500"
                    : "bg-gray-50 hover:bg-emerald-50 border-gray-200 hover:border-emerald-200 hover:text-emerald-700"
                  }`}
                onClick={() => updateSearchParams({ price: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h4 className="font-semibold mb-4 text-lg border-b pb-2">Size</h4>
          <div className="grid grid-cols-3 gap-2">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                className={`py-3 px-3 rounded-lg font-medium transition-all border-2 text-sm ${searchParamsClient.get("size") === size
                    ? "bg-linear-to-r from-purple-500 to-violet-500 text-white border-purple-500 shadow-lg"
                    : "bg-gray-50 hover:bg-purple-50 border-gray-200 hover:border-purple-200 hover:text-purple-700"
                  }`}
                onClick={() => updateSearchParams({ size: size })}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h4 className="font-semibold mb-4 text-lg border-b pb-2">Brand</h4>
          {["All", "Nike", "Adidas", "Puma", "Levis"].map((brand) => {
            const brandValue = brand.toLowerCase();
            return (
              <button
                key={brand}
                className={`block w-full py-3 px-4 rounded-xl mb-2 transition-all border-2 text-sm ${searchParamsClient.get("brand") === brandValue
                    ? "bg-linear-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg border-orange-500"
                    : "bg-gray-50 hover:bg-orange-50 border-gray-200 hover:border-orange-200 hover:text-orange-700"
                  }`}
                onClick={() => updateSearchParams({ brand: brand === "All" ? null : brandValue })}
              >
                {brand}
              </button>
            );
          })}
        </div>

        <button
          className="w-full py-3 px-4 bg-linear-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all mt-6 text-sm"
          onClick={() => router.push("/shop")}
        >
          Clear All Filters
        </button>
      </div>

      <div className="lg:col-span-3">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold">
            Products ({products.length})
            {searchParamsClient.get("category") && (
              <span className="ml-2 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {searchParamsClient.get("category")}
              </span>
            )}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsWithSlugs.map((product: Product & { slug: string }) => {
            const imageSrc = getProductImage(product.images);

            return (
              // 🔥 FIXED: Key (ONLY CHANGE)
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
                </div>

                <div className="p-6">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="block hover:no-underline"
                  >
                    <h3 className="font-semibold text-lg line-clamp-1 mb-2 hover:text-blue-600 transition-colors">
                      {product.name || 'Unnamed Product'}
                    </h3>
                  </Link>

                  <div className="flex items-center mb-3">
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
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    
                    <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-linear-to-r from-black to-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-900 hover:to-gray-950 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transform"
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
    </div>
  );
}