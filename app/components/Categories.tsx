"use client";

import { FC } from "react";
import Link from "next/link";

interface CategoriesSectionProps {
  filterProducts?: (category: string) => void;
}

const CategoriesSection: FC<CategoriesSectionProps> = ({ filterProducts }) => {
  const categories = [
    { name: "Men's Wear", image: "/images/categories/mens-wear.avif", slug: "mens-wear" },
    { name: "Women's Wear", image: "/images/categories/womens-wear.avif", slug: "womens-wear" },
    { name: "Accessories", image: "/images/categories/accessories.avif", slug: "accessories" },
    { name: "Kids Wear", image: "/images/categories/kids-wear.avif", slug: "kids-wear" },
    { name: "Night Wear", image: "/images/categories/night-wear.avif", slug: "night-wear" },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 bg-slate-50/50 backdrop-blur-sm border-t border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-8 gap-2">
          <div className="w-px h-6 bg-gradient-to-b from-slate-300 to-transparent" />
          <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900 tracking-tight">Categories</h2>
          <div className="w-px h-6 bg-gradient-to-b from-slate-300 to-transparent" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group relative block p-2 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-xl hover:shadow-primary/10 border border-white/50 hover:border-slate-200 hover:bg-white transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]"
              onClick={() => filterProducts?.(category.slug)}
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-24 sm:h-28 lg:h-32 object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent opacity-0 backdrop-blur-sm group-hover:opacity-100 transition-all duration-400" />
              </div>

              <div className="mt-3 px-1">
                <h3 className="text-sm lg:text-base font-medium text-slate-900 group-hover:text-slate-800 text-center leading-tight transition-colors duration-300">
                  {category.name}
                </h3>
                <div className="mx-auto mt-2 w-4 h-0.5 bg-gradient-to-r from-transparent via-slate-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-center rounded-full" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;