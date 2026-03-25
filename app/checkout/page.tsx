"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, removeFromCart } = useCart();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce(
    (acc: number, item: any) => acc + item.price * item.qty,
    0
  );

  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  return (<>
    <section className="bg-black text-white pt-12 pb-5">
      <div className="max-w-7xl mx-auto mt-10 text-center">
        <h1 className="text-5xl">Checkout</h1>
        <ul className="flex flex-wrap text-white gap-4 mt-4 text-center mx-auto justify-center">
          <li><Link href="/">Home</Link></li>
            <li><Link href="/">Shop</Link></li>
            <li><Link href="/">Checkout</Link></li>
        </ul>
      </div>
    </section>
    <section className="bg-[#f7f7f7] min-h-screen pt-28 pb-16 px-6 md:px-12">

      <div className="max-w-7xl mx-auto">

        {/* ================= STEP INDICATOR ================= */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-6 text-sm">

            {["Cart", "Shipping", "Payment"].map((label, i) => (
              <div key={i} className="flex items-center gap-2">

                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border ${step === i + 1
                    ? "bg-black text-white"
                    : "text-gray-400"
                    }`}
                >
                  {i + 1}
                </div>

                <span
                  className={
                    step === i + 1 ? "text-black" : "text-gray-400"
                  }
                >
                  {label}
                </span>

                {i !== 2 && <div className="w-10 h-[1px] bg-gray-300" />}
              </div>
            ))}

          </div>
        </div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12">

          {/* ================= LEFT ================= */}
          <div className="space-y-10">

            {/* ================= STEP 1: CART ================= */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm">

                <h2 className="text-2xl font-semibold mb-6">
                  Review Your Cart
                </h2>

                <div className="space-y-6">
                  {cart.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-5 border-b pb-5"
                    >
                      <img
                        src={item.images[0]}
                        className="w-20 h-20 object-contain bg-[#f3f3f3] rounded-xl"
                      />

                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.selectedColor} • {item.selectedSize}
                        </p>
                        <p className="text-sm">Qty: {item.qty}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="mt-8 bg-black text-white px-8 py-3 rounded-full"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ================= STEP 2: SHIPPING ================= */}
            {step === 2 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm">

                <h2 className="text-2xl font-semibold mb-6">
                  Shipping Details
                </h2>

                <div className="grid md:grid-cols-2 gap-5">

                  <input
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    className="border p-3 rounded-xl"
                  />

                  <input
                    name="phone"
                    placeholder="Phone"
                    onChange={handleChange}
                    className="border p-3 rounded-xl"
                  />

                  <input
                    name="city"
                    placeholder="City"
                    onChange={handleChange}
                    className="border p-3 rounded-xl"
                  />

                  <input
                    name="pincode"
                    placeholder="Pincode"
                    onChange={handleChange}
                    className="border p-3 rounded-xl"
                  />

                </div>

                <textarea
                  name="address"
                  placeholder="Full Address"
                  onChange={handleChange}
                  className="border p-3 rounded-xl w-full mt-5"
                />

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="border px-6 py-3 rounded-full"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setStep(3)}
                    className="bg-black text-white px-8 py-3 rounded-full"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: PAYMENT ================= */}
            {step === 3 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm">

                <h2 className="text-2xl font-semibold mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4">

                  <div className="border p-4 rounded-xl flex justify-between">
                    <span>Cash on Delivery</span>
                    <input type="radio" name="payment" defaultChecked />
                  </div>

                  <div className="border p-4 rounded-xl flex justify-between opacity-50">
                    <span>Online Payment (Coming Soon)</span>
                  </div>

                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="border px-6 py-3 rounded-full"
                  >
                    Back
                  </button>

                  <button className="bg-black text-white px-8 py-3 rounded-full">
                    Place Order
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ================= RIGHT SUMMARY ================= */}
          <div className="sticky top-28 h-fit">
            <div className="bg-white rounded-3xl p-8 shadow-md">

              <h2 className="text-xl font-semibold mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>

                <div className="flex justify-between font-semibold pt-4 border-t">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section></>

  );
}