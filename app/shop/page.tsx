"use client";

import { useState, Suspense } from "react";
import ProductSection from "../components/Product";
import CategoriesSection from "../components/Categories";
import { products } from "../../data/product";

export const dynamic = "force-dynamic";

export default function ShopPage() {
  const [filteredProducts, setFilteredProducts] = useState(products);

  const filterProducts = (category: string) => {
    const filtered =
      category === "all"
        ? products
        : products.filter((product) => product.category === category);

    setFilteredProducts(filtered);
  };

  return (
    <div>
      {/* Banner */}
      <section
        className="relative w-full h-80 bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/category-banner.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex justify-center items-center text-white">
          <h2 className="text-4xl font-bold">Explore Our Categories</h2>
        </div>
      </section>

      {/* ✅ Wrap Categories */}
      <Suspense fallback={<div className="p-6">Loading categories...</div>}>
        <CategoriesSection filterProducts={filterProducts} />
      </Suspense>

      {/* Products */}
      <div className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">
            Shop Our Collection
          </h2>

          {/* ✅ Wrap ProductSection */}
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductSection products={filteredProducts} />
          </Suspense>

        </div>
      </div>
    </div>
  );
}