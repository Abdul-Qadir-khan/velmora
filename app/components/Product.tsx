"use client";

import Link from "next/link";
import { Product } from "../../data/product";
import { useMemo, useState, useEffect } from "react";
import { Heart, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function ShopSection({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [sort, setSort] = useState("popular");
  const [category, setCategory] = useState<string[]>([]);
  const [brand, setBrand] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [color, setColor] = useState<string[]>([]);
  const [price, setPrice] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);

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

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

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

  const toggle = (
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
    else if (setter === setColor) updateURL(category, brand, size, newState, price);
  };

  const categories = [...new Set(products.map((p) => p.category))];
  const brands = [...new Set(products.map((p) => p.brand.name))];
  const sizes = [...new Set(products.flatMap((p) => p.variations.sizes))];
  const colors = [...new Set(products.flatMap((p) => p.variations.colors))];

  const filteredProducts = useMemo(() => {
    let data = products;
    if (category.length) data = data.filter((p) => category.includes(p.category));
    if (brand.length) data = data.filter((p) => brand.includes(p.brand.name));
    if (size.length)
      data = data.filter((p) => p.variations.sizes.some((s) => size.includes(s)));
    if (color.length)
      data = data.filter((p) => p.variations.colors.some((c) => color.includes(c)));
    data = data.filter((p) => p.price <= price);

    if (sort === "low") data.sort((a, b) => a.price - b.price);
    if (sort === "high") data.sort((a, b) => b.price - a.price);
    if (sort === "latest") data.sort((a, b) => b.id - a.id);

    return data;
  }, [products, category, brand, size, color, price, sort]);

  const toggleWishlist = (product: Product) => {
    let updated: Product[];
    if (wishlist.find((p) => p.id === product.id)) {
      updated = wishlist.filter((p) => p.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      images: product.images,
    });

    if (wishlist.find((p) => p.id === product.id)) {
      const updated = wishlist.filter((p) => p.id !== product.id);
      setWishlist(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
    }

    alert(`${product.name} added to cart`);
  };

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
          className={`bg-white border rounded-2xl p-6 space-y-6 h-fit ${
            showFilters ? "block" : "hidden"
          } lg:block`}
        >
          <h3 className="font-semibold text-lg">Filters</h3>

          <div>
            <h4 className="font-medium mb-2">Category</h4>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => toggle(c, category, setCategory)}
                className={`block text-sm ${
                  category.includes(c) ? "text-black font-medium" : "text-gray-500"
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
                className={`block text-sm ${
                  brand.includes(b) ? "text-black font-medium" : "text-gray-500"
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
              max={1000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-black"
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
                  className={`px-3 py-1 text-xs border rounded-full ${
                    color.includes(c) ? "bg-black text-white" : ""
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
                  className={`px-3 py-1 border rounded-full text-sm ${
                    size.includes(s)
                      ? "bg-black text-white"
                      : "hover:bg-black hover:text-white transition-colors"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

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

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.some((p) => p.id === product.id);

              return (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-xl overflow-hidden shadow transition-transform duration-500 hover:scale-[1.03] hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 left-3 bg-white p-2 rounded-full shadow z-10 opacity-70 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Heart
                      size={16}
                      className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400"}
                    />
                  </button>

                  <div className="relative h-56 sm:h-72 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.images[0]}
                      className="absolute h-full object-contain transition-all duration-500 ease-in-out transform group-hover:scale-105 group-hover:opacity-0"
                    />
                    <img
                      src={product.images[1] || product.images[0]}
                      className="absolute h-full object-contain opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute bottom-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-black text-white py-2 sm:py-3 text-sm flex items-center justify-center gap-1 hover:bg-gray-800 transition-colors"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                  </div>

                  <div className="p-4">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-medium text-sm sm:text-base line-clamp-1 hover:text-black transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                            i < Math.round(product.rating)
                              ? "fill-yellow-400"
                              : "fill-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
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
        </div>
      </div>
    </section>
  );
}