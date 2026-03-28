"use client";

import { FC } from "react";
import Link from "next/link";

// Define props (optional now, since navigation is handled here)
interface CategoriesSectionProps {
  filterProducts?: (category: string) => void; // optional
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
    <section className="py-12 px-5 md:px-12 bg-primary/5">
      <div className="md:max-w-7xl w-full mx-auto">
        
        {/* Header */}
        <div className="text-center md:mb-10 mb-4">
          <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900">
            Select a Category
            <span className="block text-gray-400 text-sm md:text-lg mt-2 font-medium">
              Browse through our curated categories
            </span>
          </h2>
        </div>

        {/* Categories */}
        <div className="overflow-x-auto scrollbar-hide mx-auto flex md:justify-center">
          <div className="flex space-x-8 py-6">

            {categories.map((category) => (
              <Link
                href={`/category/${category.slug}`}
                key={category.slug}
                className="flex flex-col items-center group"
                onClick={() => filterProducts?.(category.slug)} // optional
              >
                {/* Image Circle */}
                <div className="relative md:w-40 md:h-40 w-28 h-28 rounded-full overflow-hidden bg-gray-200 shadow-lg transition-all duration-500 group-hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                </div>

                {/* Name */}
                <h3 className="text-center mt-3 md:text-xl text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
              </Link>

            ))}

          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;