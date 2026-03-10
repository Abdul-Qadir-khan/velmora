"use client";

import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();

  const [payment, setPayment] = useState("cod");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: ""
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      alert("Please fill all required fields");
      return;
    }

    const orderId = "ORD-" + Date.now();

    await fetch("/api/send-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, ...form, payment, items: cart, total })
    });

    router.push(`/order-success?orderId=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6 md:px-20">
      <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">

        {/* LEFT SIDE */}
        <div className="bg-white p-8 rounded-xl shadow space-y-6">
          <h2 className="text-2xl font-bold">Shipping Details</h2>

          <input name="name" placeholder="Full Name" onChange={handleChange} className="border p-3 rounded w-full"/>
          <input name="email" placeholder="Email Address" onChange={handleChange} className="border p-3 rounded w-full"/>
          <input name="phone" placeholder="Phone Number" onChange={handleChange} className="border p-3 rounded w-full"/>
          <input name="address" placeholder="Street Address" onChange={handleChange} className="border p-3 rounded w-full"/>

          <div className="grid grid-cols-2 gap-4">
            <input name="city" placeholder="City" onChange={handleChange} className="border p-3 rounded"/>
            <input name="zip" placeholder="Zip Code" onChange={handleChange} className="border p-3 rounded"/>
          </div>

          {/* PAYMENT */}
          <div className="pt-6">
            <h3 className="font-semibold mb-4 text-lg">Payment Method</h3>
            <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">
              <input type="radio" checked={payment === "cod"} onChange={() => setPayment("cod")}/>
              <span>Cash on Delivery</span>
            </label>
            <p className="text-sm text-gray-500 mt-2">Pay when your order arrives at your doorstep.</p>
          </div>

          <button onClick={placeOrder} className="w-full bg-black text-white py-3 rounded-lg mt-6">Place Order</button>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-8 rounded-xl shadow h-fit">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <img src={item.image} className="w-14 h-14 object-cover rounded"/>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                </div>
                <p>${item.price * item.qty}</p>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-4 space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>${total}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>$0</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total}</span></div>
          </div>
        </div>

      </div>
    </div>
  );
}