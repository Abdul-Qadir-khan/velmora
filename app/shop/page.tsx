"use client";

import { useState } from "react";
import Link from "next/link";
import ProductSection from "../components/Product"; // Importing your Product Section
import CategoriesSection from "../components/Categories"; // Categories for filtering products
import { products } from "../../data/product"; // Assuming products data is available

export default function ShopPage() {
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Function to filter products by category (called from Categories Section)
  const filterProducts = (category: string) => {
    const filtered = category === "all" ? products : products.filter(product => product.category === category);
    setFilteredProducts(filtered);
  };

  return (
    <div>
      {/* Category Thumbnail Banner */}
      <section
        className="relative w-full h-80 bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/category-banner.jpg")' }} // Replace with your desired banner image
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex justify-center items-center text-white">
          <h2 className="text-4xl font-bold">Explore Our Categories</h2>
        </div>
      </section>

      {/* Categories Section */}
      <CategoriesSection filterProducts={filterProducts} /> {/* Pass filterProducts function */}

      {/* Product Section - Display Products */}
      <div className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Shop Our Collection</h2>
          {/* <ProductSection /> Pass filtered products to Product Section */}
          <ProductSection products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}