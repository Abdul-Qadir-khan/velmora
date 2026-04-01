"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import Link from "next/link";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size: string;
  color: string;
  image: string;
};

const safeParseArray = (data: any): string[] => {
  try {
    if (Array.isArray(data)) return data;
    if (typeof data === "string") return JSON.parse(data);
    return [];
  } catch {
    return [];
  }
};

const safeParseObject = (data: any): Record<string, any> => {
  try {
    if (typeof data === "object" && data !== null) return data;
    if (typeof data === "string") return JSON.parse(data);
    return {};
  } catch {
    return {};
  }
};

const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};

const addToCart = (item: CartItem) => {
  const cart = getCart();
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
};

interface ProductClientProps {
  product: any;
  recommendedProducts?: any[];
}

export default function ProductClient({
  product,
  recommendedProducts = [],
}: ProductClientProps) {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [wish, setWish] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  const images = safeParseArray(product.images);
  const variationRaw = product.variations?.[0] || {};
  const variation = {
    colors: safeParseArray(variationRaw.colors),
    sizes: safeParseArray(variationRaw.sizes),
    specs: safeParseObject(variationRaw.specs),
  };

  const normalizedRecommended = recommendedProducts.map((p) => ({
    ...p,
    images: safeParseArray(p.images),
  }));

  const discount =
    product.originalPrice &&
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("Please select color and size");
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty,
      size: selectedSize,
      color: selectedColor,
      image: images[0] || "/placeholder.png",
    });
    alert("Added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleCarouselScroll = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const scroll = carouselRef.current.clientWidth / 2;
    carouselRef.current.scrollBy({
      left: dir === "left" ? -scroll : scroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-12">
      {/* PRODUCT GRID */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* LEFT: IMAGE & THUMBNAILS */}
        <div className="flex gap-4">
          {/* Vertical thumbnails for desktop */}
          <div className="hidden md:flex flex-col gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 object-contain border rounded-lg cursor-pointer transition-transform duration-200 ${
                  selectedImage === i ? "border-black scale-105" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1">
            <img
              src={images[selectedImage] || "/placeholder.png"}
              className="w-full h-[500px] md:h-[600px] object-contain rounded-2xl shadow-lg"
            />

            {/* Mobile thumbnails */}
            <div className="flex gap-2 mt-4 md:hidden overflow-x-auto">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 object-contain border rounded-lg cursor-pointer transition-transform duration-200 ${
                    selectedImage === i ? "border-black scale-105" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: PRODUCT DETAILS */}
        <div className="space-y-6 sticky top-24">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
            <button
              onClick={() => setWish(!wish)}
              className={`p-3 rounded-full border flex items-center justify-center transition ${
                wish ? "text-red-500 border-red-500 bg-red-50" : "hover:bg-gray-50"
              }`}
            >
              <Heart size={20} />
            </button>
          </div>

          <p className="text-gray-500">{product.brand?.name}</p>

          {/* PRICE */}
          <div className="flex items-center gap-3">
            {product.originalPrice && (
              <span className="line-through text-gray-400 text-lg">₹{product.originalPrice}</span>
            )}
            <span className="text-2xl md:text-3xl font-bold">₹{product.price}</span>
            {discount && (
              <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* COLOR */}
          <div>
            <h4 className="font-medium mb-2">Select Color</h4>
            <div className="flex flex-wrap gap-2">
              {variation.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-4 py-1 border rounded-full text-sm ${
                    selectedColor === c
                      ? "bg-black text-white"
                      : "hover:bg-black hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div>
            <h4 className="font-medium mb-2">Select Size</h4>
            <div className="flex flex-wrap gap-2">
              {variation.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-1 border rounded-full text-sm ${
                    selectedSize === s
                      ? "bg-black text-white"
                      : "hover:bg-black hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1 border rounded-full hover:bg-gray-100 transition"
            >
              -
            </button>
            <span>{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1 border rounded-full hover:bg-gray-100 transition"
            >
              +
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              disabled={!selectedSize || !selectedColor}
              onClick={handleAddToCart}
              className={`px-6 py-3 rounded-full text-white transition ${
                selectedSize && selectedColor ? "bg-black hover:bg-gray-800" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>
            <button
              disabled={!selectedSize || !selectedColor}
              onClick={handleBuyNow}
              className="px-6 py-3 rounded-full border hover:bg-gray-50 transition"
            >
              Buy Now
            </button>
          </div>

          <p className="text-sm text-gray-500">
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </p>
        </div>
      </div>

      {/* RECOMMENDED PRODUCTS */}
      {normalizedRecommended.length > 0 && (
        <section className="mt-16">
          <h3 className="text-xl md:text-2xl font-semibold mb-6">You may also like</h3>
          <div className="relative">
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden md:block"
              onClick={() => handleCarouselScroll("left")}
            >
              ◀
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden md:block"
              onClick={() => handleCarouselScroll("right")}
            >
              ▶
            </button>

            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
            >
              {normalizedRecommended.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`}>
                  <div className="flex-shrink-0 w-40 md:w-48 bg-gray-50 p-4 rounded-xl text-center hover:shadow-lg transition snap-start">
                    <img src={p.images[0] || "/placeholder.png"} className="h-32 md:h-40 mx-auto object-contain" />
                    <p className="mt-2 text-sm font-medium">{p.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}