"use client";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Heart } from "lucide-react";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size: string;
  color: string;
  image: string;
};

const getCart = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart") || "[]");
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

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleSwipe = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : prev));
    }
    if (touchEndX.current - touchStartX.current > 50) {
      setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  const variation = product.variations?.[0] || { colors: [], sizes: [], specs: {} };
  const discount =
    product.originalPrice &&
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;

    const item: CartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      qty,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
    };

    addToCart(item);
    alert("Added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const handleCarouselScroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth / 2;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const seoTitle = product.seoTitle || product.name;
  const seoDescription = product.description || "";
  const seoKeywords = product.keywords || "";

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={product.images[0]} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* HEADER */}
      <section className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">{product.name}</h1>
          <ul className="flex justify-center gap-4 mt-4 text-sm md:text-base">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li>{product.name}</li>
          </ul>
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-12 grid md:grid-cols-2 gap-12">
        {/* IMAGES */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden relative group order-1 md:order-2">
            <img
              src={product.images[selectedImage]}
              className="w-full h-[320px] md:h-[500px] object-contain transition-transform duration-500 group-hover:scale-110"
              onTouchStart={(e) => (touchStartX.current = e.changedTouches[0].screenX)}
              onTouchEnd={(e) => {
                touchEndX.current = e.changedTouches[0].screenX;
                handleSwipe();
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
              }}
            />
          </div>

          {/* THUMBNAILS */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible order-2 md:order-1">
            {product.images.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 md:w-20 md:h-20 object-contain border rounded-full cursor-pointer shrink-0 transition-transform duration-200 ${
                  selectedImage === i ? "border-black border-2" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="space-y-6 md:sticky md:top-24">
          <p className="text-sm text-gray-500">{product.brand?.name}</p>
          <h2 className="text-2xl md:text-4xl font-semibold">{product.name}</h2>
          <div className="text-yellow-500 text-sm">★ {product.rating} / 5</div>

          {/* PRICE */}
          <div className="flex items-center gap-3">
            {product.originalPrice && (
              <span className="line-through text-gray-400 text-lg">₹{product.originalPrice}</span>
            )}
            <span className="text-2xl md:text-3xl font-bold">₹{product.price}</span>
            {discount && (
              <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded-full">-{discount}%</span>
            )}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* COLORS */}
          <div>
            <h4 className="font-medium mb-2">Select Color</h4>
            <div className="flex flex-wrap gap-2">
              {variation.colors.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-4 py-1 border rounded-full text-sm ${
                    selectedColor === c ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* SIZES */}
          <div>
            <h4 className="font-medium mb-2">Select Size</h4>
            <div className="flex flex-wrap gap-2">
              {variation.sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-1 border rounded-full text-sm ${
                    selectedSize === s ? "bg-black text-white" : "hover:bg-black hover:text-white"
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
          <div className="flex flex-wrap gap-3">
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
            <button
              onClick={() => setWish(!wish)}
              className={`p-3 rounded-full border flex items-center justify-center transition ${
                wish ? "text-red-500 border-red-500 bg-red-50" : "hover:bg-gray-50"
              }`}
            >
              <Heart size={20} />
            </button>
          </div>

          <p className="text-sm text-gray-500">
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </p>
        </div>
      </section>

      {/* SPECIFICATIONS */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <h3 className="text-xl md:text-2xl font-semibold mb-6">Specifications</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          {Object.entries(variation.specs).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b pb-2">
              <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* RECOMMENDED PRODUCTS (SWIPEABLE) */}
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-12 relative">
        <h3 className="text-xl md:text-2xl font-semibold mb-6">You may also like</h3>

        <div className="hidden md:grid grid-cols-4 gap-6">
          {recommendedProducts.slice(0, 4).map((p: any) => (
            <Link key={p.id} href={`/products/${p.slug}`}>
              <div className="bg-gray-50 p-4 rounded-xl text-center hover:shadow-lg transition">
                <img src={p.images[0]} className="h-32 md:h-40 mx-auto object-contain" />
                <p className="mt-2 text-sm font-medium">{p.name}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile swipeable */}
        <div className="md:hidden relative">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
            onClick={() => handleCarouselScroll("left")}
          >
            ◀
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
            onClick={() => handleCarouselScroll("right")}
          >
            ▶
          </button>

          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
          >
            {recommendedProducts.map((p: any) => (
              <Link key={p.id} href={`/products/${p.slug}`}>
                <div className="flex-shrink-0 w-40 bg-gray-50 p-4 rounded-xl text-center hover:shadow-lg transition snap-start">
                  <img src={p.images[0]} className="h-32 mx-auto object-contain" />
                  <p className="mt-2 text-sm font-medium">{p.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}