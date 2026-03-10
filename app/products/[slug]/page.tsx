"use client";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import { products } from "../../../data/product";
import Link from "next/link";
import TestimonialSection from "@/app/components/Testimonials";

// new
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const discount =
    product.originalPrice &&
    Math.round(
      ((product.originalPrice - product.price) /
        product.originalPrice) *
      100
    );

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const relatedProducts = products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

    const router = useRouter();
const { addToCart } = useCart();
  return (
    <>
      <section className="py-12 bg-black"></section>
      <div className="bg-gray-50">

        {/* ================= MAIN SECTION ================= */}
        <section className="px-5 md:px-20 md:py-24 py-12 flex flex-col lg:flex-row gap-12">

          {/* LEFT SIDE - IMAGE GALLERY */}
          <div className="flex-1 max-w-xl md:sticky md:top-0 md:h-fit">

            <div
              onMouseMove={handleMouseMove}
              className="relative overflow-hidden mt-5 md:mt-0 rounded-xl md:rounded-3xl shadow-2xl group bg-white"
            >
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full md:h-130 object-cover transition-transform cursor-crosshair duration-300 group-hover:scale-150"
                style={{
                  transformOrigin: `${position.x}% ${position.y}%`,
                }}
              />

              {/* Glass Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-5 top-1/2 -translate-y-1/2 
              backdrop-blur-md bg-white/40 
              hover:bg-black hover:text-white
              border border-white/50
              shadow-xl
              rounded-full min-w-12 min-h-12 w-12 h-12 flex items-center justify-center
              transition-all duration-300 hover:scale-110"
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-5 top-1/2 -translate-y-1/2 
              backdrop-blur-md bg-white/40 
              hover:bg-black hover:text-white
              border border-white/50
              shadow-xl
              rounded-full min-w-12 min-h-12 w-12 h-12 flex items-center justify-center
              transition-all duration-300 hover:scale-110"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 mt-5 justify-center overflow-x-auto py-2">
              {product.images.map((img, idx) => (
                <img
                  key={img}
                  src={img}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-15 md:w-20 h-15 md:h-20 object-cover rounded-md md:rounded-xl border-2 cursor-pointer transition ${idx === currentImageIndex
                    ? "border-black scale-105"
                    : "border-transparent"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - DETAILS */}
          <div className="flex-1 max-w-lg">

            <h1 className="text-2xl md:text-4xl font-extrabold text-[#0B1F3A] md:mb-4 mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3 md:mb-6">
              <span className="text-yellow-500 text-lg">★★★★★</span>
              <span className="text-gray-600 text-sm">
                {product.rating} out of 5
              </span>
            </div>

            {/* PRICING CARD */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border">

              <div className="flex items-center gap-4">
                <span className="text-4xl font-extrabold text-black">
                  ${product.price}
                </span>

                {product.originalPrice && (
                  <>
                    <span className="line-through text-gray-400 text-xl">
                      ${product.originalPrice}
                    </span>

                    <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-semibold">
                      SAVE {discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-green-600 text-sm mt-4">
                ● In stock. Order today to get it by <strong>March 10</strong>
              </p>

              <p className="text-gray-500 text-sm mt-2">
                Free Shipping + 30 Day Money Back Guarantee
              </p>
            </div>

            {/* DESCRIPTION BLOCK */}
            <div className="md:space-y-6 space-y-3 md:mb-10 mb-5">

              <h2 className="text-xl md:text-2xl font-bold text-[#0B1F3A]">
                Advanced Security. Zero Compromise.
              </h2>

              <p className="text-gray-700 leading-relaxed">
                {product.description} Built with cutting-edge surveillance
                technology, this device ensures crystal-clear monitoring,
                real-time alerts, and unmatched reliability. Whether installed
                indoors or outdoors, it performs flawlessly in all conditions.
              </p>

              <ul className="space-y-2 text-gray-700">
                <li>✔ Ultra HD video clarity</li>
                <li>✔ Smart motion detection alerts</li>
                <li>✔ Weather-resistant construction</li>
                <li>✔ Seamless mobile integration</li>
              </ul>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <p className="text-blue-800 font-medium">
                  Designed for modern homes and businesses that demand reliable,
                  intelligent protection.
                </p>
              </div>
            </div>

            {/* ADD TO CART */}
            {/* <button className="w-full bg-black text-white py-4 rounded-xl md:rounded-2xl text-lg font-semibold hover:bg-gray-900 transition">
              Add to Cart
            </button> */}

            <button
  onClick={() => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      qty: 1,
    });

    router.push("/checkout");
  }}
  className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:bg-gray-900 transition"
>
  Buy Now
</button>

            {/* TRUST SECTION */}
            <div className="mt-8 space-y-4 text-sm text-gray-600">
              <div className="flex md:gap-4 gap-2 flex-wrap">
                <span>🔒 Secure Checkout</span>
                <span>🚚 Free Shipping</span>
                <span>💳 All Major Cards Accepted</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                90-Day 200% Happiness Guarantee. If you're not satisfied,
                we’ll make it right.
              </div>
            </div>

            {/* ================= ACCORDION SECTION ================= */}
            <div className="mt-2 md:mt-5 bg-white rounded-2xl shadow-md divide-y border">

              {["Description", "Specifications", "Shipping & Returns"].map(
                (item) => (
                  <div key={item}>
                    <button
                      onClick={() => toggleSection(item)}
                      className="w-full text-left px-6 py-5 flex justify-between items-center font-semibold"
                    >
                      {item}
                      <span>{openSection === item ? "−" : "+"}</span>
                    </button>

                    {openSection === item && (
                      <div className="px-6 pb-6 text-gray-600 text-sm">
                        {item === "Description" &&
                          "This product is engineered with premium materials and smart surveillance technology to ensure long-term reliability."}

                        {item === "Specifications" &&
                          Object.entries(product.variations.specs).map(
                            ([key, value]) => (
                              <p key={key}>
                                <strong>{key}:</strong> {value}
                              </p>
                            )
                          )}

                        {item === "Shipping & Returns" &&
                          "Free shipping within 3-5 business days. 30-day hassle-free returns guaranteed."}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

        </section>

        {/* ================= REVIEWS ================= */}
        <TestimonialSection />

        {/* ================= RELATED PRODUCTS ================= */}
        <section className="bg-gray-50 px-6 md:px-20 py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center md:mb-12 mb-6">
            Related Products
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4"
              >
                <img
                  src={item.images[0]}
                  className="h-48 w-full object-cover rounded-xl"
                />
                <h3 className="mt-4 font-semibold">{item.name}</h3>
                <p className="text-black font-bold mt-2">
                  ${item.price}
                </p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}