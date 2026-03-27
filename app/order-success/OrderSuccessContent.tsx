"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams?.get("orderId");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="bg-white p-8 rounded-2xl text-center max-w-md w-full shadow-lg">

        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4 animate-pulse" />

        <h1 className="text-2xl font-bold">Order Successful</h1>

        {orderId && (
          <p className="mt-3 text-green-600 font-semibold">#{orderId}</p>
        )}

        <p className="text-sm text-gray-500 mt-2">
          Redirecting to homepage...
        </p>

        <div className="flex gap-4 mt-6">
          <Link href="/" className="flex-1 bg-black text-white py-2 rounded-lg">
            Home
          </Link>
          <Link href="/orders" className="flex-1 border py-2 rounded-lg">
            Orders
          </Link>
        </div>
      </div>
    </div>
  );
}