"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ChevronRightIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon
} from "@heroicons/react/24/outline";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  isNew?: boolean;
  bestSeller?: boolean;
  category?: string;
  slug?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your products • {filteredProducts.length} items
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <Link
                href="/admin/products/create"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Add Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center mb-6">
              📦
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {search ? "Try a different search term" : "Get started by creating your first product"}
            </p>
            <Link
              href="/admin/products/create"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Create First Product
              <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-1">
                  {product.isNew && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">NEW</span>
                  )}
                  {product.bestSeller && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">🔥</span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.stock === 0 && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Stock: {product.stock}</span>
                    {product.category && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-200">
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium text-sm"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center"
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {filteredProducts.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Products</div>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                ₹{filteredProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Value</div>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {filteredProducts.filter(p => p.stock === 0).length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Out of Stock</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}