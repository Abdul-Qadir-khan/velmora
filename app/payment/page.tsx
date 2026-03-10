"use client";

import { useRouter } from "next/navigation";

export default function PaymentPage() {

  const router = useRouter();

  return (
    <div className="px-6 md:px-20 py-20 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-10">
        Payment
      </h1>

      <div className="max-w-xl bg-white p-8 rounded-2xl shadow">

        <h2 className="text-xl font-semibold mb-6">
          Choose Payment Method
        </h2>

        <div className="space-y-4">

          <label className="flex gap-3 border p-4 rounded-lg">
            <input type="radio" name="payment" defaultChecked />
            Credit / Debit Card
          </label>

          <label className="flex gap-3 border p-4 rounded-lg">
            <input type="radio" name="payment" />
            UPI
          </label>

          <label className="flex gap-3 border p-4 rounded-lg">
            <input type="radio" name="payment" />
            Cash on Delivery
          </label>

        </div>

        <button
          onClick={() => router.push("/order-success")}
          className="w-full bg-black text-white py-3 rounded-lg mt-8"
        >
          Pay Now
        </button>

      </div>

    </div>
  );
}