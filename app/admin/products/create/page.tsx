"use client";

import ProductForm from "@/app/components/admin/ProductForm";
import Link from "next/link";

export default function CreateProductPage() {
  return (
    <>
    <section className="bg-black py-12"></section>
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-500">Fill the details below to create a new product.</p>
        </div>
        <Link
          href="/admin/products"
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          Back to Products
        </Link>
      </div>

      {/* Product Form */}
      <ProductForm />
    </div>
    </>
  );
}