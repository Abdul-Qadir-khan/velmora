"use client";

import { useCart } from "../context/CartContext";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 min-h-screen px-6 md:px-20 py-16">

      <h1 className="text-3xl font-bold text-center mb-14">
        Secure Checkout
      </h1>

      <div className="grid lg:grid-cols-2 gap-14">

        {/* LEFT SIDE — BILLING */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">

          <h2 className="text-xl font-semibold mb-6">
            Billing Details
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <input
              placeholder="First Name"
              className="border p-3 rounded-lg"
            />

            <input
              placeholder="Last Name"
              className="border p-3 rounded-lg"
            />

            <input
              placeholder="Email"
              className="border p-3 rounded-lg col-span-2"
            />

            <input
              placeholder="Phone"
              className="border p-3 rounded-lg col-span-2"
            />

            <input
              placeholder="Address"
              className="border p-3 rounded-lg col-span-2"
            />

            <input
              placeholder="City"
              className="border p-3 rounded-lg"
            />

            <input
              placeholder="Postal Code"
              className="border p-3 rounded-lg"
            />

          </div>

          {/* Payment */}
          <h3 className="font-semibold mt-8 mb-4">
            Payment Method
          </h3>

          <div className="space-y-3">

            <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">
              <input type="radio" name="payment" defaultChecked />
              Credit / Debit Card
            </label>

            <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">
              <input type="radio" name="payment" />
              UPI Payment
            </label>

            <label className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer">
              <input type="radio" name="payment" />
              Cash on Delivery
            </label>

          </div>

          <button className="w-full bg-black text-white py-4 rounded-xl mt-8 text-lg font-semibold hover:bg-gray-900 transition">
            Place Order
          </button>

        </div>

        {/* RIGHT SIDE — ORDER SUMMARY */}
        <div className="bg-white p-8 rounded-2xl shadow-lg h-fit">

          <h2 className="text-xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="space-y-6">

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
              >
                <div className="flex gap-4 items-center">

                  <img
                    src={item.image}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty {item.qty}
                    </p>
                  </div>

                </div>

                <p className="font-semibold">
                  ${item.price}
                </p>
              </div>
            ))}

          </div>

          {/* Price breakdown */}

          <div className="border-t mt-8 pt-6 space-y-3">

            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? "Free" : `$${shipping}`}
              </span>
            </div>

            <div className="flex justify-between text-lg font-bold pt-4 border-t">
              <span>Total</span>
              <span>${total}</span>
            </div>

          </div>

          {/* Trust badges */}

          <div className="mt-8 text-sm text-gray-500 space-y-2">

            <p>🔒 Secure SSL Encryption</p>
            <p>🚚 Free Shipping</p>
            <p>↩ 30-Day Money Back Guarantee</p>

          </div>

        </div>

      </div>

    </div>
  );
}