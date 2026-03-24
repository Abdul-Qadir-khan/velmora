"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center transition-all duration-300 hover:shadow-2xl">

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16 animate-bounce" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-500 mt-2">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order ID Card */}
        {orderId ? (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Your Order ID</p>
            <p className="text-lg font-semibold text-green-700 tracking-wide mt-1">
              #{orderId}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-red-500 font-medium">
            No order ID found in the URL.
          </p>
        )}

        <p className="text-sm text-gray-500 mt-3">
          Please save this order ID for tracking your order.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">

          <Link
            href="/orders"
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Track Order
          </Link>

          <Link
            href="/"
            className="flex-1 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
}