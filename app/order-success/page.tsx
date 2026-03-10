"use client";

import { useRouter } from "next/navigation";

export default function OrderSuccess() {

  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">

      <div className="bg-white p-12 rounded-2xl shadow text-center">

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Order Successful
        </h1>

        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <button
          onClick={() => router.push("/")}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
}