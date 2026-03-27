// app/orders/OrderCard.tsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // for expand/collapse icon
import Link from "next/link";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface OrderCardProps {
  orderId: string;
  total: number;
  status: string;
  date: string;
  items?: OrderItem[];
}

export default function OrderCard({ orderId, total, status, date, items = [] }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  const statusColors: Record<string, string> = {
    Processing: "text-yellow-500",
    Shipped: "text-blue-500",
    Delivered: "text-green-500",
    Cancelled: "text-red-500",
  };

  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
      {/* Top row: Order summary */}
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <p className="font-semibold">Order #{orderId}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
          <p className={`text-sm font-medium ${statusColors[status] || "text-gray-500"}`}>
            Status: {status}
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <p className="font-semibold">₹{total}</p>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </div>
      </div>

      {/* Expandable section */}
      {expanded && items.length > 0 && (
        <div className="mt-4 border-t pt-4 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <p>{item.name} x {item.qty}</p>
              <p>₹{item.price * item.qty}</p>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold border-t pt-2">
            <p>Total</p>
            <p>₹{total}</p>
          </div>
          <Link
            href={`/order-success?orderId=${orderId}`}
            className="mt-2 inline-block text-blue-600 hover:underline text-sm"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  );
}