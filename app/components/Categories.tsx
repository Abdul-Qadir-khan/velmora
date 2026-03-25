"use client";

import { FC } from "react"; // FC (Functional Component) from React

// Define the props type to accept the filterProducts function
interface CategoriesSectionProps {
  filterProducts: (category: string) => void;
}

const CategoriesSection: FC<CategoriesSectionProps> = ({ filterProducts }) => {
  const categories = [
    { name: "Men's Wear", image: "/images/categories/mens-wear.avif", slug: "mens-wear" },
    { name: "Women's Wear", image: "/images/categories/womens-wear.avif", slug: "womens-wear" },
    { name: "Accessories", image: "/images/categories/accessories.avif", slug: "accessories" },
    { name: "Kids Wear", image: "/images/categories/kids-wear.avif", slug: "kids-wear" },
    { name: "Night Wear", image: "/images/categories/night-wear.avif", slug: "night-wear" }, // "All" category for showing all products
  ];

  return (
    <section className="py-12 px-6 md:px-12 bg-primary/5">
      <div className="md:max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="text-center md:mb-10 mb-4">
          <h2 className="text-3xl md:text-4xl font-bold mt-4 md:leading-tight leading-tighter text-gray-900">
            Select a Category
            <span className="block text-gray-400 text-sm md:text-lg mt-2 font-medium">
              Browse through our curated categories
            </span>
          </h2>
        </div>

        {/* Categories Horizontal Scrolling */}
        <div className="overflow-x-auto scrollbar-hide mx-auto flex md:justify-center">
          <div className="flex space-x-8 py-6">
            {categories.map((category) => (
              <div
                key={category.slug}
                className="relative flex flex-col items-center cursor-pointer group"
                onClick={() => filterProducts(category.slug)} // On hover, clicking the circle now also triggers filterProducts
              >
                {/* Category Image Circle */}
                <div className="relative md:w-40 md:h-40 w-30 h-30 rounded-full overflow-hidden bg-gray-200 shadow-lg transition-all duration-500 group-hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"  // Lazy load images for better performance
                  />
                </div>

                {/* Category Name Below Circle */}
                <h3 className="text-center mt-3 md:text-xl text-lg font-semibold text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;