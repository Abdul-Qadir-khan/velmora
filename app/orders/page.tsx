"use client";

import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/get-orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const json = await res.json();
        setOrders(json);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* BANNER */}
      <section className="bg-black text-white py-16 text-center relative overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Orders</h1>
        <p className="text-gray-300 text-lg">Track all your purchases in one place</p>
        {/* Optional subtle background circle */}
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-yellow-500/20 rounded-full animate-pulse"></div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <img
              src="/no-orders.png" // you can add an illustration here
              alt="No orders"
              className="mx-auto w-64 mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2">No Orders Found</h2>
            <p className="text-gray-400">Looks like you haven’t placed any orders yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <OrderCard
                key={order.orderId}
                orderId={order.orderId}
                total={order.total}
                status={order.status || "Processing"} // default to Processing
                date={order.date || new Date().toISOString()}
                items={order.items}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}