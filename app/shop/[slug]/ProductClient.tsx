"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Heart, X } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

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
  const [activeTab, setActiveTab] = useState("description");
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select color and size");
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
    toast.success("Added to cart!");
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

  return (<>
    <section className="bg-black text-white pt-12 pb-5 text-center">
      <h1 className="text-4xl md:text-5xl mt-10"></h1>
    </section>

    <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 space-y-16">
      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* LEFT: IMAGES */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex flex-row md:flex-col order-2 md:order-1 gap-2 md:overflow-hidden overflow-x-auto mt-4 pe-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(i)}
                className={`w-15 h-15 max-w-15 max-h-15 object-contain border rounded-lg cursor-pointer transition-transform duration-200 ${selectedImage === i ? "border-black" : "border-gray-300"
                  }`}
              />
            ))}
          </div>

          <div
            className="relative group rounded-2xl order-1 md:order-2 overflow-hidden shadow-lg cursor-zoom-in bg-gray-100"
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={images[selectedImage] || "/placeholder.png"}
              className="w-full h-100  md:h-150 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {discount && (
              <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{discount}%
              </span>
            )}
          </div>

        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="flex flex-col space-y-6 sticky top-24">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
              <p className="text-gray-500 font-medium">{product.brand?.name}</p>
            </div>
            <button
              onClick={() => setWish(!wish)}
              className={`p-3 rounded-full border flex items-center justify-center transition ${wish ? "text-red-500 border-red-500 bg-red-50" : "hover:bg-gray-50"
                }`}
            >
              <Heart size={20} />
            </button>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-3">
            {product.originalPrice && (
              <span className="line-through text-gray-400 text-lg">
                ₹{product.originalPrice}
              </span>
            )}
            <span className="text-2xl md:text-3xl font-bold">₹{product.price}</span>
          </div>

          {/* BADGES */}
          <div className="flex flex-wrap gap-2">
            {product.stock > 0 && (
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">
                In Stock
              </span>
            )}
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
              Free Shipping
            </span>
          </div>

          {/* COLOR & SIZE */}
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-medium mb-2">Color</h4>
              <div className="flex gap-2 flex-wrap">
                {variation.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-1 border rounded-full text-sm transition-all ${selectedColor === c
                      ? "bg-black text-white scale-110 shadow-lg"
                      : "hover:bg-black hover:text-white"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Size</h4>
              <div className="flex gap-2 flex-wrap">
                {variation.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-1 border rounded-full text-sm transition-all ${selectedSize === s
                      ? "bg-black text-white scale-110 shadow-lg"
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
                className="px-3 py-1 border rounded-full hover:bg-gray-100 transition-transform hover:scale-110"
              >
                -
              </button>
              <span className="text-lg">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-1 border rounded-full hover:bg-gray-100 transition-transform hover:scale-110"
              >
                +
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              disabled={!selectedSize || !selectedColor}
              onClick={handleAddToCart}
              className={`px-6 py-3 rounded-full text-white transition transform ${selectedSize && selectedColor
                ? "bg-black hover:bg-gray-800 hover:scale-105"
                : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Add to Cart
            </button>
            <button
              disabled={!selectedSize || !selectedColor}
              onClick={handleBuyNow}
              className="px-6 py-3 rounded-full border hover:bg-gray-50 transition transform hover:scale-105"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="pt-6 space-y-4 overflow-x-auto">
        <div className="flex md:gap-4 border-b border-gray-300 flex-wrap">
          {["description", "specs", "shipping", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-all ${activeTab === tab
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="pt-4 text-gray-700 space-y-2">
          {activeTab === "description" && <p>{product.description}</p>}
          {activeTab === "specs" && (
            <ul className="list-disc ml-6 space-y-1">
              {Object.entries(variation.specs).map(([k, v]) => (
                <li key={k}>
                  <span className="font-medium">{k}:</span> {v}
                </li>
              ))}
            </ul>
          )}
          {activeTab === "shipping" && (
            <ul className="list-disc ml-6 space-y-1 text-sm text-gray-500">
              <li>Free shipping on orders above ₹499</li>
              <li>30-day easy returns</li>
              <li>Cash on delivery available</li>
            </ul>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-2">
              <p className="text-gray-600">⭐⭐⭐⭐☆ (12 Reviews)</p>
              <p className="text-sm text-gray-500">
                “Excellent quality, luxurious feel!” – Customer A
              </p>
              <p className="text-sm text-gray-500">
                “Highly recommend, fits perfectly.” – Customer B
              </p>
              <button className="mt-2 px-4 py-2 border rounded-full hover:bg-gray-50 transition">
                Write a Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RECOMMENDED PRODUCTS */}
      {normalizedRecommended.length > 0 && (
        <section className="mt-16">
          <h3 className="text-xl md:text-2xl font-semibold mb-6">
            You may also like
          </h3>
          <div className="relative">
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden md:block hover:scale-110 transition"
              onClick={() => handleCarouselScroll("left")}
            >
              ◀
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden md:block hover:scale-110 transition"
              onClick={() => handleCarouselScroll("right")}
            >
              ▶
            </button>

            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
            >
              {normalizedRecommended.map((p) => (
                <Link key={p.id} href={`/shop/${p.slug}`}>
                  <div className="shrink-0 w-40 md:w-48 bg-gray-50 p-4 rounded-xl text-center hover:shadow-lg hover:scale-105 transition snap-start cursor-pointer">
                    <img
                      src={p.images[0] || "/placeholder.png"}
                      className="h-32 md:h-40 mx-auto object-contain transition-transform duration-300"
                    />
                    <p className="mt-2 text-sm font-medium">{p.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MOBILE STICKY ADD TO CART */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-between items-center shadow-lg z-50">
        <div>
          <p className="font-medium">₹{product.price}</p>
          {discount && (
            <span className="text-xs text-red-500">-{discount}%</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            disabled={!selectedSize || !selectedColor}
            onClick={handleAddToCart}
            className="px-4 py-2 rounded-full bg-black text-white text-sm"
          >
            Add to Cart
          </button>
          <button
            disabled={!selectedSize || !selectedColor}
            onClick={handleBuyNow}
            className="px-4 py-2 rounded-full border text-sm"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-gray-700 transition"
          >
            <X size={24} />
          </button>
          <div className="relative max-w-3xl w-full p-4">
            <img
              src={images[selectedImage] || "/placeholder.png"}
              className="w-full h-[80vh] object-contain"
            />
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 object-contain border rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 ${selectedImage === i ? "border-white scale-110" : "border-gray-400"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </>

  );
}