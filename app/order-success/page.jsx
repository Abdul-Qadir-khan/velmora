"use client";

import { useRouter } from "next/navigation";

export default function OrderSuccess() {

  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow text-center">

        <h1 className="text-3xl font-bold mb-4">
          🎉 Order Placed Successfully
        </h1>

        <p className="text-gray-600 mb-6">
          Your order will be delivered soon.  
          Payment method: Cash on Delivery.
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