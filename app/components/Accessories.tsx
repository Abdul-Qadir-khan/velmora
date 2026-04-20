"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const products = [
  {
    name: "Men's T-Shirt",
    category: "T-Shirt",
    image: "/images/categories/mens-wear.avif",
    price: "₹799",
  },
  {
    name: "Slim Fit Jeans",
    category: "Pants",
    image: "/images/categories/jeans.jpg",
    price: "₹1,499",
  },
  {
    name: "Casual Hoodie",
    category: "Hoodies",
    image: "/images/categories/casual-hoodie.jpg",
    price: "₹1,199",
  },
  {
    name: "Premium Attar",
    category: "Fragrance",
    image: "/images/categories/attar.jpg",
    price: "₹899",
  },
  {
    name: "Classic Watch",
    category: "Watches",
    image: "/images/categories/watches.jpg",
    price: "₹4,999",
  },
  {
    name: "Leather Wallet",
    category: "Accessories",
    image: "/images/categories/wallet.jpg",
    price: "₹1,299",
  },
  {
    name: "Sunglasses",
    category: "Eyewear",
    image: "/images/categories/sunglasses.jpg",
    price: "₹1,799",
  },
];

export default function ClothingProductsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#f8f8f8] py-16 md:py-24 px-6 md:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6">
          <div>
            <p className="text-gray-500 uppercase tracking-[0.3em] text-xs mb-4">
              Latest Arrivals
            </p>

            <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-gray-900">
              Refined Style for <br className="hidden md:block" />
              Modern Living
            </h2>
          </div>

          <button className="group text-sm uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition">
            View All Products
            <span className="ml-2 inline-block transform transition group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* IMAGE WITH ANIMATION */}
          <div className="relative h-[380px] md:h-[520px] w-full overflow-hidden bg-[#eee]">
            <AnimatePresence mode="wait">
              <motion.div
                key={products[active].image}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={products[active].image}
                  alt={products[active].name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* TEXT ANIMATION */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white"
                >
                  <p className="text-xs tracking-widest uppercase text-gray-300 mb-2">
                    {products[active].category}
                  </p>

                  <h3 className="text-2xl md:text-4xl font-semibold">
                    {products[active].name}
                  </h3>

                  <p className="mt-2 text-sm md:text-base text-gray-200">
                    {products[active].price}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* SELECTOR WITH SCROLL */}
          <div className="flex flex-col divide-y divide-gray-300 max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent pr-2">
            {products.map((product, idx) => (
              <div
                key={idx}
                onClick={() => setActive(idx)}
                className="group py-5 cursor-pointer flex justify-between items-center transition hover:bg-gray-50 px-2 rounded-lg"
              >
                <div>
                  <h4
                    className={`text-lg md:text-xl font-medium transition ${
                      active === idx
                        ? "text-black"
                        : "text-gray-600 group-hover:text-black"
                    }`}
                  >
                    {product.name}
                  </h4>

                  <p className="text-xs text-gray-400 tracking-wide mt-1">
                    {product.category}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-medium ${
                      active === idx ? "text-black" : "text-gray-500"
                    }`}
                  >
                    {product.price}
                  </span>

                  {/* Animated line */}
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`h-[2px] rounded-full transition-all duration-300 ${
                      active === idx 
                        ? "bg-black w-12 shadow-sm" 
                        : "bg-gray-300 w-6 group-hover:w-8"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Navigation Dots - Mobile */}
        <div className="lg:hidden flex justify-center gap-2 mt-8">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                active === idx ? "bg-black scale-125" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to product ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}