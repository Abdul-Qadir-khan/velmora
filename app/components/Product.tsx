"use client";

import Link from "next/link";
import { Product } from "../../types/product"; // ✅ Fixed path (no @/)
import { useMemo, useState, useEffect, useCallback, useTransition } from "react";
import { Heart, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast"; // ✅ Missing import

export default function ShopSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [sort, setSort] = useState("popular");
  const [category, setCategory] = useState<string[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [price, setPrice] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition(); // ✅ Added

  // Slug fallback generator
  const generateSlug = useCallback((name: string) =>
    name?.toLowerCase().replace(/\s+/g, "-"), []);

  // Normalize image URLs
  const getValidImage = useCallback((img?: string) => {
    if (!img) return "/placeholder.png";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return img.startsWith("/") ? img : `/${img}`;
  }, []);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products/");
        const json = await res.json();
        const data: Product[] = json.products || [];

        const normalized = data.map((p: any) => { // ✅ any for API data
          let imgs: string[] = [];
          try {
            imgs = Array.isArray(p.images)
              ? p.images
              : p.images
                ? typeof p.images === 'string' ? JSON.parse(p.images) : [String(p.images)]
                : [];
          } catch {
            imgs = [];
          }

          imgs = imgs.map(getValidImage).filter(Boolean);

          return {
            ...p,
            id: Number(p.id),
            stringId: String(p.id),
            slug: p.slug || generateSlug(p.name),
            images: imgs.length ? imgs : ["/placeholder.png"],
            price: Number(p.price) || 0,
          } as Product;
        });

        setAllProducts(normalized);
      } catch (err) {
        // console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [generateSlug, getValidImage]);

  // Sync filters with URL params
  useEffect(() => {
    const cat = searchParams.get("category")?.split(",") || [];
    const br = searchParams.get("brand")?.split(",") || [];
    const sz = searchParams.get("size")?.split(",") || [];
    const col = searchParams.get("color")?.split(",") || [];
    const pr = Number(searchParams.get("price")) || 10000;

    setCategory(cat);
    setBrand(br);
    setSize(sz);
    setColor(col);
    setPrice(pr);
  }, [searchParams]);

  // Load wishlist
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) setWishlist(JSON.parse(stored));
    } catch {
      setWishlist([]);
    }
  }, []);

  const updateURL = useCallback((
    newCategory = category,
    newBrand = brand,
    newSize = size,
    newColor = color,
    newPrice = price
  ) => {
    startTransition(() => { // ✅ Smooth transitions
      const params = new URLSearchParams();
      if (newCategory.length) params.set("category", newCategory.join(","));
      if (newBrand.length) params.set("brand", newBrand.join(","));
      if (newSize.length) params.set("size", newSize.join(","));
      if (newColor.length) params.set("color", newColor.join(","));
      if (newPrice !== 10000) params.set("price", String(newPrice));
      router.push(`?${params.toString()}`);
    });
  }, [category, brand, size, color, price, router]);

  const toggle = useCallback((
    value: string,
    state: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newState = state.includes(value)
      ? state.filter((v) => v !== value)
      : [...state, value];

    setter(newState);

    if (setter === setCategory) updateURL(newState, brand, size, color, price);
    else if (setter === setBrand) updateURL(category, newState, size, color, price);
    else if (setter === setSize) updateURL(category, brand, newState, color, price);
    else updateURL(category, brand, size, newState, price);
  }, [category, brand, size, color, price, updateURL]);

  // ✅ FIXED sizes/colors (type-safe)
  const categories = useMemo(() =>
    [...new Set(allProducts.map((p) => p.category))], [allProducts]);

  const brands = useMemo(() =>
    [...new Set(allProducts.map((p) => p.brand?.name || ''))], [allProducts]);

  const sizes = useMemo(() => {
    const allSizes: string[] = [];
    allProducts.forEach(p => {
      if (p.variations && Array.isArray(p.variations)) {
        p.variations.forEach((v: any) => {
          if (Array.isArray(v.sizes)) allSizes.push(...v.sizes);
        });
      }
    });
    return [...new Set(allSizes)];
  }, [allProducts]);

  const colors = useMemo(() => {
    const allColors: string[] = [];
    allProducts.forEach(p => {
      if (p.variations && Array.isArray(p.variations)) {
        p.variations.forEach((v: any) => {
          if (Array.isArray(v.colors)) allColors.push(...v.colors);
        });
      }
    });
    return [...new Set(allColors)];
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (isLoading) return [];

    let data = allProducts;
    if (category.length) data = data.filter((p) => category.includes(p.category));
    if (brand.length) data = data.filter((p) => brand.includes(p.brand?.name || ''));
    if (size.length)
      data = data.filter((p) => {
        if (!p.variations) return false;
        return p.variations.some((v: any) => v.sizes?.some((s: string) => size.includes(s)));
      });
    if (color.length)
      data = data.filter((p) => {
        if (!p.variations) return false;
        return p.variations.some((v: any) => v.colors?.some((c: string) => color.includes(c)));
      });
    data = data.filter((p) => (p.price || 0) <= price);

    if (sort === "low") data.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "high") data.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === "latest") data.sort((a, b) => {
      const aId = Number(a.id);
      const bId = Number(b.id);
      return bId - aId;
    });

    return data;
  }, [allProducts, category, brand, size, color, price, sort, isLoading]);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      const updated = exists
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product];

      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    const firstVariation = product.variations[0];

    // ✅ FORCE cast to string before parsing
    const sizesRaw = (firstVariation?.sizes as any) as string;
    const colorsRaw = (firstVariation?.colors as any) as string;

    const sizes = sizesRaw ? JSON.parse(sizesRaw) as string[] : [];
    const colors = colorsRaw ? JSON.parse(colorsRaw) as string[] : [];

   // Product.tsx - Line 225 replacement:
const handleAddToCart = async () => {
  try {
    // ✅ Send ONLY SLUG to API (your backend finds everything else)
    await addToCart(product.slug, 1);
    
    toast.success(`${product.name} added to cart! 🎉`);
  } catch (error) {
    // console.error("Add to cart error:", error);
    toast.error("Failed to add to cart");
  }
};

    toast.success(`${product.name} added to cart! 🛒`);
  }, [addToCart]);

  const handleResetFilters = useCallback(() => {
    setCategory([]);
    setBrand([]);
    setSize([]);
    setColor([]);
    setPrice(10000);
    updateURL([], [], [], [], 10000);
  }, [updateURL]);

  if (isLoading || isPending) {
    return (
      <section>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
        {/* MOBILE FILTER TOGGLE */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 border px-4 py-2 rounded-full text-sm mb-4"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>

        {/* FILTER SIDEBAR */}
        <div
          className={`bg-white border rounded-2xl p-6 space-y-6 h-fit ${showFilters ? "block" : "hidden"
            } lg:block`}
        >
          <h3 className="font-semibold text-lg">Filters</h3>

          <div>
            <h4 className="font-medium mb-2">Category</h4>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => toggle(c, category, setCategory)}
                className={`block text-sm py-1 w-full text-left hover:bg-gray-50 px-2 rounded ${category.includes(c) ? "text-black font-medium bg-gray-100" : "text-gray-500"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>

          <hr />

          <div>
            <h4 className="font-medium mb-2">Brand</h4>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => toggle(b, brand, setBrand)}
                className={`block text-sm py-1 w-full text-left hover:bg-gray-50 px-2 rounded ${brand.includes(b) ? "text-black font-medium bg-gray-100" : "text-gray-500"
                  }`}
              >
                {b}
              </button>
            ))}
          </div>

          <hr />

          <div>
            <h4 className="font-medium mb-2">Price: ₹{price}</h4>
            <input
              type="range"
              min={0}
              max={10000}
              value={price}
              onChange={(e) => {
                setPrice(Number(e.target.value));
                updateURL(category, brand, size, color, Number(e.target.value));
              }}
              className="w-full accent-black h-2 bg-gray-200 rounded-lg"
            />
          </div>

          <hr />

          <div>
            <h4 className="font-medium mb-2">Colors</h4>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => toggle(c, color, setColor)}
                  className={`px-3 py-1 text-xs border rounded-full transition-all ${color.includes(c)
                    ? "bg-black text-white shadow-md"
                    : "hover:bg-gray-100 hover:shadow-sm"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <hr />

          <div>
            <h4 className="font-medium mb-2">Size</h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(s, size, setSize)}
                  className={`px-3 py-1 border rounded-full text-sm transition-all ${size.includes(s)
                    ? "bg-black text-white shadow-md"
                    : "hover:bg-gray-100 hover:shadow-sm hover:text-black"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleResetFilters}
            className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-colors font-medium"
          >
            Reset Filters
          </button>
        </div>

        {/* PRODUCTS */}
        <div className="lg:col-span-3">
          <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {allProducts.length} products
            </p>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm bg-transparent outline-none border rounded-full px-3 py-1 hover:bg-gray-50"
            >
              <option value="popular">Most Popular</option>
              <option value="latest">Latest</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 col-span-full">
              No products found matching your filters. Try adjusting your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlist.some(
                  (p) => String(p.id) === String(product.id)
                );

                return (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-xl overflow-hidden shadow transition-transform duration-500 hover:scale-[1.03] hover:shadow-lg"
                  >
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 left-3 bg-white p-2 rounded-full shadow z-10 opacity-70 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    >
                      <Heart
                        size={16}
                        className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400"}
                      />
                    </button>

                    <div className="relative h-56 sm:h-72 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="absolute h-full w-auto max-w-full object-contain transition-all duration-500 ease-in-out transform group-hover:scale-105 group-hover:opacity-0"
                      />
                      <img
                        src={product.images[1] || product.images[0]}
                        alt={product.name}
                        className="absolute h-full w-auto max-w-full object-contain opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:scale-105"
                      />
                    </div>

                    <div className="absolute bottom-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-linear-to-t from-black/90 to-transparent">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-black text-white py-2 sm:py-3 text-sm flex items-center justify-center gap-1 hover:bg-gray-800 transition-colors backdrop-blur-sm"
                      >
                        <ShoppingCart size={16} /> Add to Cart
                      </button>
                    </div>

                    <div className="p-4">
                      {/* <Link href={`/shop/${product.slug}`}> */}
                      <Link href={`/shop/${product.slug || generateSlug(product.name)}`}>
                        <h3 className="font-medium text-sm sm:text-base line-clamp-1 hover:text-black transition-colors group-hover:underline">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${i < Math.round(product.rating || 0)
                              ? "fill-yellow-400 stroke-yellow-500"
                              : "fill-gray-300 stroke-gray-400"
                              }`}
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            strokeWidth="1"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.564-.955L10 0l2.946 5.955 6.564.955-4.755 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>

                      <div className="flex gap-2 text-sm mt-1">
                        {product.originalPrice && (
                          <span className="line-through text-gray-400">₹{product.originalPrice}</span>
                        )}
                        <span className="font-semibold text-black">₹{product.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}