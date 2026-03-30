"use client";

import Head from "next/head";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { products } from "../../../data/product";
import { useState, useRef } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function ProductDetails() {
  const router = useRouter();
  const { addToCart } = useCart();

  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  // Find product by slug
  const product = products.find((p) => p.slug === slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [wish, setWish] = useState(false);

  // Swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleSwipe = () => {
    if (!product) return;

    if (touchStartX.current - touchEndX.current > 50) {
      setSelectedImage((prev) =>
        prev < product.images.length - 1 ? prev + 1 : prev
      );
    }

    if (touchEndX.current - touchStartX.current > 50) {
      setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  if (!product) return <p className="p-10">Product not found</p>;

  // Use first variation safely
  const variation = product.variations?.[0] || { colors: [], sizes: [], specs: {} };

  // SEO inside component
  const seoTitle = product.seoTitle || product.name;
  const seoDescription = product.seoDescription || product.description;
  const seoKeywords = product.seoKeywords || product.name;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      id: product.id ?? product.slug,
      selectedSize,
      selectedColor,
      qty,
    });
  };

  const discount =
    product.originalPrice &&
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

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
      <section className="bg-black text-white pt-12 pb-5">
        <div className="max-w-7xl mx-auto mt-10 text-center">
          <h1 className="text-4xl md:text-5xl">Product</h1>
          <ul className="flex flex-wrap text-white gap-4 mt-4 justify-center">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/">Shop</Link>
            </li>
            <li>
              <Link href="/">Product</Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="px-4 md:px-12 py-10 bg-white mt-10 md:mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12">
          {/* ================= IMAGES ================= */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* MAIN IMAGE */}
            <div className="flex-1 bg-[#f6f6f6] rounded-2xl overflow-hidden relative group order-1 md:order-2">
              <img
                src={product.images[selectedImage]}
                className="w-full h-[320px] md:h-[450px] object-contain transition-transform duration-500 group-hover:scale-125"
                onTouchStart={(e) =>
                  (touchStartX.current = e.changedTouches[0].screenX)
                }
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
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 md:w-20 md:h-20 object-contain border rounded cursor-pointer shrink-0 transition active:scale-90 ${
                    selectedImage === i ? "border-black" : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="space-y-6 md:sticky md:top-24 h-fit">
            <p className="text-sm text-gray-500">{product.brand.name}</p>

            <h1 className="text-2xl md:text-4xl font-semibold leading-tight">
              {product.name}
            </h1>

            <div className="text-yellow-500 text-sm">★ {product.rating} / 5</div>

            {/* PRICE */}
            <div className="flex flex-wrap items-center gap-3">
              {product.originalPrice && (
                <span className="line-through text-gray-400 text-base md:text-lg">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="text-2xl md:text-3xl font-semibold">₹{product.price}</span>
              {discount && (
                <span className="bg-red-100 text-red-500 text-xs md:text-sm px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            {/* COLORS */}
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
                className="px-3 py-1 border rounded"
              >
                -
              </button>
              <span>{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3">
              <button
                disabled={!selectedSize || !selectedColor}
                onClick={handleAddToCart}
                className={`px-6 md:px-8 py-3 rounded-full text-white ${
                  selectedSize && selectedColor
                    ? "bg-black hover:bg-gray-800"
                    : "bg-gray-300"
                }`}
              >
                Add to Cart
              </button>

              <button
                disabled={!selectedSize || !selectedColor}
                onClick={() => {
                  handleAddToCart();
                  router.push("/checkout");
                }}
                className="px-6 md:px-8 py-3 rounded-full border"
              >
                Buy Now
              </button>

              <button
                onClick={() => setWish(!wish)}
                className={`p-3 rounded-full border ${
                  wish ? "text-red-500 border-red-500" : ""
                }`}
              >
                <Heart size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-500">
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </p>
          </div>
        </div>

        {/* SPECS */}
        <div className="max-w-7xl mx-auto mt-16 md:mt-20">
          <h2 className="text-xl md:text-2xl font-semibold mb-6">Specifications</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            {Object.entries(variation.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="max-w-7xl mx-auto mt-16 md:mt-20">
          <h2 className="text-xl md:text-2xl font-semibold mb-6">
            You may also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`}>
                <div className="bg-[#f1f1f1] p-4 rounded-xl text-center hover:shadow">
                  <img
                    src={p.images[0]}
                    className="h-32 md:h-40 mx-auto object-contain"
                  />
                  <p className="mt-2 text-sm">{p.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}