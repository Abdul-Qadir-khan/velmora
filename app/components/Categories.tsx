"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Added for better images
import { useSearchParams } from "next/navigation";

const CategoriesSection: FC = () => {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";

  const categories = [
    { name: "All Products", image: "/images/categories/all-products.jpg", slug: "all" },
    { name: "Men's Wear", image: "/images/categories/mens-wear.avif", slug: "mens-wear" },
    { name: "Women's Wear", image: "/images/categories/womens-wear.avif", slug: "womens-wear" },
    { name: "Accessories", image: "/images/categories/accessories.avif", slug: "accessories" },
    { name: "Kids Wear", image: "/images/categories/kids-wear.avif", slug: "kids-wear" },
    { name: "Night Wear", image: "/images/categories/night-wear.avif", slug: "night-wear" },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 bg-linear-to-b from-slate-50/70 to-white/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Clean Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-slate-900 via-gray-800 to-slate-900 bg-clip-text text-transparent mb-2">
            Shop by Category
          </h2>
          <div className="w-20 h-1 mx-auto bg-linear-to-r from-blue-500 to-purple-600 rounded-full shadow-sm" />
        </div>

        {/* Simple Clean Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className={`
                group relative block p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl 
                border-2 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] h-full
                ${selectedCategory === category.slug
                  ? "border-blue-500 bg-linear-to-br from-blue-50/80 to-indigo-50/80 shadow-2xl shadow-blue-200/50 ring-2 ring-blue-200/50 -translate-y-1 scale-[1.01]"
                  : "border-transparent hover:border-blue-200 hover:shadow-blue-100/50"
                }
              `}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-xl h-32 mb-4 shadow-lg">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
                {/* Subtle overlay */}
                <div className={`absolute inset-0 bg-linear-to-t from-black/10 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 ${
                  selectedCategory === category.slug ? 'opacity-20' : ''
                }`} />
              </div>

              {/* Category Name */}
              <h3 className={`font-semibold text-sm lg:text-base text-center leading-tight transition-all duration-300 ${
                selectedCategory === category.slug
                  ? "text-blue-700 font-bold drop-shadow-sm"
                  : "text-slate-800 group-hover:text-slate-900"
              }`}>
                {category.name}
              </h3>

              {/* Active Indicator */}
              {selectedCategory === category.slug && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;