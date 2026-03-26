"use client";

import Link from "next/link";
import { Product } from "../../data/product";
import { useMemo, useState, useEffect } from "react";
import { Heart, SlidersHorizontal } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ShopSection({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ===================== STATE =====================
  const [sort, setSort] = useState("popular");
  const [category, setCategory] = useState<string[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [price, setPrice] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);

  // ===================== URL → STATE =====================
  useEffect(() => {
    const cat = searchParams.get("category")?.split(",") || [];
    const br = searchParams.get("brand")?.split(",") || [];
    const sz = searchParams.get("size")?.split(",") || [];
    const col = searchParams.get("color")?.split(",") || [];
    const pr = Number(searchParams.get("price")) || 1000;

    setCategory(cat);
    setBrand(br);
    setSize(sz);
    setColor(col);
    setPrice(pr);
  }, [searchParams]);

  // ===================== UPDATE URL =====================
  const updateURL = (
    newCategory = category,
    newBrand = brand,
    newSize = size,
    newColor = color,
    newPrice = price
  ) => {
    const params = new URLSearchParams();

    if (newCategory.length) params.set("category", newCategory.join(","));
    if (newBrand.length) params.set("brand", newBrand.join(","));
    if (newSize.length) params.set("size", newSize.join(","));
    if (newColor.length) params.set("color", newColor.join(","));
    if (newPrice !== 1000) params.set("price", String(newPrice));

    router.push(`?${params.toString()}`);
  };

  // ===================== TOGGLE FILTER =====================
  const toggle = (
    value: string,
    state: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newState = state.includes(value)
      ? state.filter((v) => v !== value)
      : [...state, value];

    setter(newState);

    // update URL
    if (setter === setCategory) updateURL(newState, brand, size, color, price);
    else if (setter === setBrand) updateURL(category, newState, size, color, price);
    else if (setter === setSize) updateURL(category, brand, newState, color, price);
    else if (setter === setColor) updateURL(category, brand, size, newState, price);
  };

  // ===================== UNIQUE VALUES =====================
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand.name))];
  const sizes = [...new Set(products.flatMap(p => p.variations.sizes))];
  const colors = [...new Set(products.flatMap(p => p.variations.colors))];

  // ===================== FILTERED PRODUCTS =====================
  const filteredProducts = useMemo(() => {
    let data = products;

    if (category.length)
      data = data.filter(p => category.includes(p.category));

    if (brand.length)
      data = data.filter(p => brand.includes(p.brand.name));

    if (size.length)
      data = data.filter(p =>
        p.variations.sizes.some(s => size.includes(s))
      );

    if (color.length)
      data = data.filter(p =>
        p.variations.colors.some(c => color.includes(c))
      );

    data = data.filter(p => p.price <= price);

    if (sort === "low") data.sort((a, b) => a.price - b.price);
    if (sort === "high") data.sort((a, b) => b.price - a.price);
    if (sort === "latest") data.sort((a, b) => b.id - a.id);

    return data;
  }, [products, category, brand, size, color, price, sort]);

  // ===================== JSX =====================
  return (
    <section>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">

        {/* MOBILE FILTER TOGGLE */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 border px-4 py-2 rounded-full text-sm"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>

        {/* FILTER SIDEBAR */}
        <div
          className={`bg-white border rounded-2xl p-6 space-y-6 h-fit
            ${showFilters ? "block" : "hidden"} lg:block`}
        >
          <h3 className="font-semibold text-lg">Filters</h3>

          {/* CATEGORY */}
          <div>
            <h4 className="font-medium mb-2">Category</h4>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => toggle(c, category, setCategory)}
                className={`block text-sm ${category.includes(c) ? "text-black font-medium" : "text-gray-500"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <hr />

          {/* BRAND */}
          <div>
            <h4 className="font-medium mb-2">Brand</h4>
            {brands.map(b => (
              <button
                key={b}
                onClick={() => toggle(b, brand, setBrand)}
                className={`block text-sm ${brand.includes(b) ? "text-black font-medium" : "text-gray-500"}`}
              >
                {b}
              </button>
            ))}
          </div>

          <hr />

          {/* PRICE */}
          <div>
            <h4 className="font-medium mb-2">Price: ₹{price}</h4>
            <input
              type="range"
              min={0}
              max={1000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-black"
            />
          </div>

          <hr />

          {/* COLORS */}
          <div>
            <h4 className="font-medium mb-2">Colors</h4>
            <div className="flex flex-wrap gap-2">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => toggle(c, color, setColor)}
                  className={`px-3 py-1 text-xs border rounded-full ${color.includes(c) ? "bg-black text-white" : ""}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <hr />

          {/* SIZE */}
          <div>
            <h4 className="font-medium mb-2">Size</h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map(s => (
                <button
                  key={s}
                  onClick={() => toggle(s, size, setSize)}
                  className={`px-3 py-1 border rounded-full text-sm ${size.includes(s) ? "bg-black text-white" : "hover:bg-black hover:text-white"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* RESET FILTER */}
          <button
            onClick={() => {
              setCategory([]);
              setBrand([]);
              setSize([]);
              setColor([]);
              setPrice(1000);
              updateURL([], [], [], [], 1000);
            }}
            className="w-full bg-black text-white py-2 rounded-full"
          >
            Reset Filters
          </button>
        </div>

        {/* PRODUCTS */}
        <div className="lg:col-span-3">
          {/* TOP BAR */}
          <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} products
            </p>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm bg-transparent outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="latest">Latest</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>
          </div>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="group">
                <div className="relative bg-[#f1f1f1] rounded-2xl p-4 sm:p-6 h-56 sm:h-72 flex items-center justify-center overflow-hidden">

                  <button className="absolute top-3 left-3 bg-white p-2 rounded-full shadow">
                    <Heart size={16} />
                  </button>

                  <img
                    src={product.images[0]}
                    className="absolute h-full object-contain group-hover:opacity-0 transition"
                  />
                  <img
                    src={product.images[1] || product.images[0]}
                    className="absolute h-full object-contain opacity-0 group-hover:opacity-100 transition"
                  />

                  <div className="absolute bottom-0 w-full translate-y-full group-hover:translate-y-0 transition">
                    <button className="w-full bg-black text-white py-2 sm:py-3 text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-medium text-sm sm:text-base line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="text-yellow-500 text-xs sm:text-sm">
                    ★ {product.rating}
                  </div>

                  <div className="flex gap-2 text-sm">
                    {product.originalPrice && (
                      <span className="line-through text-gray-400">
                        ₹{product.originalPrice}
                      </span>
                    )}
                    <span className="font-semibold">₹{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}