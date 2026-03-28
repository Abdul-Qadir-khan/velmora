"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useParams } from "next/navigation";
import { products } from "../../../data/product";
import { useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link"

export default function ProductDetails() {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      ...product,
      id: product.id ?? product.slug!,
      selectedSize,
      selectedColor,
      qty,
    });
  };

  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const product = products.find((p) => p.slug === slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [wish, setWish] = useState(false);

  if (!product) return <p className="p-10">Product not found</p>;

  const discount =
    product.originalPrice &&
    Math.round(
      ((product.originalPrice - product.price) /
        product.originalPrice) *
      100
    );

  return (
    <>
      <section className="bg-black text-white pt-12 pb-5">
        <div className="max-w-7xl mx-auto mt-10 text-center">
          <h1 className="text-5xl">Product</h1>
          <ul className="flex flex-wrap text-white gap-4 mt-4 text-center mx-auto justify-center">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/">Shop</Link></li>
            <li><Link href="/">Product</Link></li>
          </ul>
        </div>
      </section>
      <section className="px-6 md:px-12 py-10 bg-white mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

          {/* ================= IMAGES ================= */}
          <div className="flex gap-4">

            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 object-contain border rounded cursor-pointer transition ${selectedImage === i ? "border-black" : "border-gray-200"
                    }`}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-[#f6f6f6] rounded-2xl flex items-center justify-center p-6 overflow-hidden group">
              <img
                src={product.images[selectedImage]}
                className="h-[420px] object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="space-y-6 sticky top-24 h-fit">

            {/* Brand */}
            <p className="text-sm text-gray-500">{product.brand.name}</p>

            {/* Title */}
            <h1 className="text-4xl font-semibold leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="text-yellow-500 text-sm">
              ★ {product.rating} / 5
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              {product.originalPrice && (
                <span className="line-through text-gray-400 text-lg">
                  ₹{product.originalPrice}
                </span>
              )}
              <span className="text-3xl font-semibold">
                ₹{product.price}
              </span>

              {discount && (
                <span className="bg-red-100 text-red-500 text-sm px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* COLORS */}
            <div>
              <h4 className="font-medium mb-2">Select Color</h4>
              <div className="flex gap-2">
                {product.variations.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-1 border rounded-full text-sm ${selectedColor === c
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
              <div className="flex gap-2">
                {product.variations.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-1 border rounded-full text-sm ${selectedSize === s
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
            <div className="flex items-center gap-4">

              {/* ADD TO CART */}
              <button
                disabled={!selectedSize || !selectedColor}
                onClick={handleAddToCart}
                className={`px-8 py-3 rounded-full text-white transition-all ${selectedSize && selectedColor
                  ? "bg-black hover:bg-gray-800 hover:scale-105"
                  : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                Add to Cart
              </button>

              {/* BUY NOW */}
              <button
                disabled={!selectedSize || !selectedColor}
                onClick={() => {
                  handleAddToCart();
                  router.push("/checkout");
                }}
                className={`px-8 py-3 rounded-full border transition-all ${selectedSize && selectedColor
                  ? "hover:bg-black hover:text-white hover:scale-105"
                  : "opacity-50 cursor-not-allowed"
                  }`}
              >
                Buy Now
              </button>

              {/* WISHLIST */}
              <button
                onClick={() => setWish(!wish)}
                className={`p-3 rounded-full border transition ${wish ? "text-red-500 border-red-500" : ""
                  }`}
              >
                <Heart size={18} />
              </button>

            </div>

            {/* STOCK */}
            <p className="text-sm text-gray-500">
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </p>

          </div>
        </div>

        {/* ================= SPECS ================= */}
        <div className="max-w-7xl mx-auto mt-20">
          <h2 className="text-2xl font-semibold mb-6">Specifications</h2>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            {Object.entries(product.variations.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RELATED PRODUCTS ================= */}
        <div className="max-w-7xl mx-auto mt-20">
          <h2 className="text-2xl font-semibold mb-6">You may also like</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`}>
                <div className="bg-[#f1f1f1] p-4 rounded-xl text-center hover:shadow">
                  <img src={p.images[0]} className="h-40 mx-auto object-contain" />
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