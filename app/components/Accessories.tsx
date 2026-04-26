"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Men's Wear",
    slug: "mens-wear",
    image: "/images/categories/mens-wear.avif",
    products: ["T-Shirts", "Hoodies", "Jackets"],
    featuredPrice: "₹799",
  },
  {
    name: "Denim",
    slug: "denim",
    image: "/images/categories/jeans.jpg",
    products: ["Slim Fit", "Bootcut", "Distressed"],
    featuredPrice: "₹1,499",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "/images/categories/wallet.jpg",
    products: ["Wallets", "Belts", "Sunglasses"],
    featuredPrice: "₹1,299",
  },
  {
    name: "Watches",
    slug: "watches",
    image: "/images/categories/watches.jpg",
    products: ["Classic", "Sport", "Luxury"],
    featuredPrice: "₹4,999",
  },
  {
    name: "Fragrance",
    slug: "fragrance",
    image: "/images/categories/attar.jpg",
    products: ["Attar", "Eau de Parfum", "Body Mist"],
    featuredPrice: "₹899",
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-10 lg:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-6 lg:mb-10">
          <h2 className="text-4xl lg:text-5xl font-light uppercase tracking-tight mb-2">
            Shop by <span className="font-black">Category</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover curated collections across all your favorite styles
          </p>
        </div>

        {/* Category Grid - Clean & Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
          {categories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border hover:border-black h-80 lg:h-96"
            >
              <Link href={`/shop/${category.slug}`} className="block h-full flex flex-col">
                {/* Category Image */}
                <div className="relative flex-1 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                    {category.name}
                  </div>
                </div>

                {/* Product Teaser */}
                <div className="p-6 flex-1 flex flex-col justify-end">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider font-medium text-gray-500">
                      Popular: {category.products.slice(0, 2).join(" • ")}
                    </p>
                    <p className="text-2xl font-light uppercase tracking-widest text-gray-900">
                      {category.featuredPrice}
                    </p>
                  </div>
                  
                  {/* Shop CTA */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm uppercase tracking-wider font-bold text-gray-600 group-hover:text-black transition-colors">
                      Shop Collection
                    </span>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="text-lg font-bold"
                    >
                      →
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Main CTA */}
        <div className="text-center mt-10">
          <Link href="/shop">
            <button className="px-8 py-4 border-2 border-black text-lg uppercase tracking-wider font-medium hover:bg-black hover:text-white transition-all rounded-full shadow-md hover:shadow-xl">
              Browse All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}