"use client"
import { Suspense } from "react";
import { useState, useEffect } from "react";
import ProductSection from "../../../components/Product";
import CategoriesSection from "../../../components/Categories";
import { products, Product } from "../../../../data/product";

interface CategoryPageProps {
  categoryName: string;
  bannerImage: string;
}

export default function CategoryPage({ categoryName, bannerImage }: CategoryPageProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!categoryName) {
      console.error('Category name is required');
      return; // Handle the case when categoryName is missing
    }

    const filtered = products.filter(
      (p) => p.category && p.category.toLowerCase() === categoryName.toLowerCase()
    );
    setFilteredProducts(filtered);
  }, [categoryName]);

  return (
    <div>
      {/* Banner */}
      <section
        className="relative w-full h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex justify-center items-center text-white">
          <h2 className="text-4xl font-bold">{categoryName}</h2>
        </div>
      </section>

      {/* Products */}
      <div className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Shop {categoryName}</h2>
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductSection products={filteredProducts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}