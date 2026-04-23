"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// ✅ Add proper typing
type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  isNew?: boolean;
  bestSeller?: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      // console.log("API response:", data); // 🔍 Debug

      // ✅ Fix: handle different API formats safely
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // ✅ Update UI instantly
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <>
      <section className="bg-black py-12"></section>

      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products</h1>

          <Link
            href="/admin/products/create"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            Add Product
          </Link>
        </div>

        {/* ✅ Loading State */}
        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow flex flex-col justify-between"
              >
                <div className="mb-2">
                  <h3 className="font-semibold text-lg">{p.name}</h3>

                  <p className="text-gray-600">
                    ₹{p.price} | Stock: {p.stock}
                  </p>

                  {p.isNew && (
                    <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded text-xs mr-2">
                      New
                    </span>
                  )}

                  {p.bestSeller && (
                    <span className="inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                      Best Seller
                    </span>
                  )}
                </div>

                <div className="flex space-x-2 mt-2">
                  <Link
                    href={`/admin/products/edit/${p.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors text-sm"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}