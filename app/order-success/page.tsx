"use client";

import { useSearchParams } from "next/navigation";

export default function OrderSuccess() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
        <p className="mt-4">Your Order ID is:</p>
        <p className="text-lg font-semibold mt-2">{orderId}</p>
        <p className="mt-2">Please keep this ID for your records.</p>
      </div>
    </div>
  );
}