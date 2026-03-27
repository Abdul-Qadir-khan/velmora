"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<any>({});

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

  const validateStep2 = () => {
    let newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.match(/^[6-9]\d{9}$/))
      newErrors.phone = "Enter valid phone number";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.pincode.match(/^\d{6}$/))
      newErrors.pincode = "Enter valid pincode";
    if (!form.address.trim())
      newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const subtotal = cart.reduce(
    (acc: number, item: any) => acc + item.price * item.qty,
    0
  );

  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const orderId = Math.floor(100000 + Math.random() * 900000);

    clearCart();
    router.push(`/order-success?orderId=${orderId}`);
  };

  return (
    <>
      {/* HEADER */}
      <section className="bg-black text-white pt-12 pb-5 text-center">
        <h1 className="text-4xl md:text-5xl mt-10">Checkout</h1>
      </section>

      <section className="bg-[#f7f7f7] min-h-screen pt-20 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          {/* STEP INDICATOR */}
          <div className="flex justify-center mb-10">
            {["Cart", "Shipping", "Payment"].map((label, i) => (
              <div key={i} className="flex items-center gap-2 mx-3 text-sm">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${step === i + 1 ? "bg-black text-white" : "text-gray-400"}`}>
                  {i + 1}
                </div>
                <span className={step === i + 1 ? "text-black" : "text-gray-400"}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">

            {/* LEFT */}
            <div className="space-y-8">

              {/* STEP 1 */}
              {step === 1 && (
                <div className="bg-white p-6 rounded-2xl">
                  <h2 className="text-xl font-semibold mb-6">Your Cart</h2>

                  {cart.length === 0 ? (
                    <p>Your cart is empty</p>
                  ) : (
                    cart.map((item: any, i: number) => (
                      <div key={i} className="flex gap-4 border-b pb-4 mb-4">
                        <img src={item.images[0]} className="w-16 h-16 object-contain" />
                        <div className="flex-1">
                          <p>{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.selectedColor} • {item.selectedSize}
                          </p>
                          <p className="text-sm">Qty: {item.qty}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">
                          Remove
                        </button>
                      </div>
                    ))
                  )}

                  <button
                    disabled={cart.length === 0}
                    onClick={() => setStep(2)}
                    className="mt-6 bg-black text-white px-6 py-2 rounded-full disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="bg-white p-6 rounded-2xl">
                  <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>

                  <div className="grid md:grid-cols-2 gap-4">

                    {["name", "phone", "city", "pincode"].map((field) => (
                      <div key={field}>
                        <input
                          name={field}
                          placeholder={field}
                          onChange={handleChange}
                          className={`border p-3 rounded-xl w-full ${errors[field] ? "border-red-500" : ""}`}
                        />
                        {errors[field] && (
                          <p className="text-red-500 text-xs">{errors[field]}</p>
                        )}
                      </div>
                    ))}

                  </div>

                  <div className="mt-4">
                    <textarea
                      name="address"
                      placeholder="Address"
                      onChange={handleChange}
                      className={`border p-3 rounded-xl w-full ${errors.address ? "border-red-500" : ""}`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs">{errors.address}</p>
                    )}
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(1)} className="border px-6 py-2 rounded-full">
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (validateStep2()) setStep(3);
                      }}
                      className="bg-black text-white px-6 py-2 rounded-full"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="bg-white p-6 rounded-2xl">
                  <h2 className="text-xl font-semibold mb-6">Payment</h2>

                  <div className="border p-4 rounded-xl mb-4 flex justify-between">
                    Cash on Delivery
                    <input type="radio" defaultChecked />
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(2)} className="border px-6 py-2 rounded-full">
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-black text-white px-6 py-2 rounded-full"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="bg-white p-6 rounded-2xl h-fit sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>

              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-3">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}