"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Types
interface CartProduct {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size: string;
  color: string;
  image: string;
}

interface OrderForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

// Cart Step
const CartStep = ({
  cart,
  removeFromCart,
  onNext,
}: {
  cart: CartProduct[];
  removeFromCart: (id: number) => void;
  onNext: () => void;
}) => (
  <div className="bg-white p-6 rounded-2xl">
    <h2 className="text-xl font-semibold mb-6">Your Cart</h2>
    {cart.length === 0 ? (
      <p>Your cart is empty</p>
    ) : (
      cart.map((item, idx) => (
        <div key={idx} className="flex gap-4 border-b pb-4 mb-4">
          <img
            src={item.image || "/placeholder.png"}
            className="w-16 h-16 object-contain"
          />
          <div className="flex-1">
            <p>{item.name}</p>
            <p className="text-sm">Qty: {item.qty}</p>
            <p className="text-sm">Price: ₹{item.price}</p>
            <p className="text-sm">Color: {item.color}</p>
            <p className="text-sm">Size: {item.size}</p>
          </div>
          <button
            onClick={() => removeFromCart(idx)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      ))
    )}
    <button
      disabled={cart.length === 0}
      onClick={onNext}
      className="mt-6 bg-black text-white px-6 py-2 rounded-full disabled:opacity-40"
    >
      Continue
    </button>
  </div>
);

// Shipping Step
const ShippingStep = ({
  form,
  errors,
  onChange,
  onBack,
  onNext,
}: {
  form: OrderForm;
  errors: Partial<Record<keyof OrderForm, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBack: () => void;
  onNext: () => void;
}) => (
  <div className="bg-white p-6 rounded-2xl">
    <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
    <div className="grid md:grid-cols-2 gap-4">
      {(["name", "email", "phone", "city", "pincode"] as (keyof OrderForm)[]).map(
        (field) => (
          <div key={field}>
            <input
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={onChange}
              className={`border p-3 rounded-xl w-full ${
                errors[field] ? "border-red-500" : ""
              }`}
            />
            {errors[field] && (
              <p className="text-red-500 text-xs">{errors[field]}</p>
            )}
          </div>
        )
      )}
    </div>
    <div className="mt-4">
      <textarea
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={onChange}
        className={`border p-3 rounded-xl w-full ${
          errors.address ? "border-red-500" : ""
        }`}
      />
      {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
    </div>

    <div className="flex gap-4 mt-6">
      <button onClick={onBack} className="border px-6 py-2 rounded-full">
        Back
      </button>
      <button onClick={onNext} className="bg-black text-white px-6 py-2 rounded-full">
        Continue
      </button>
    </div>
  </div>
);

// Payment Step
const PaymentStep = ({
  onBack,
  onPlaceOrder,
  loading,
}: {
  onBack: () => void;
  onPlaceOrder: () => void;
  loading: boolean;
}) => (
  <div className="bg-white p-6 rounded-2xl">
    <h2 className="text-xl font-semibold mb-6">Payment</h2>
    <div className="border p-4 rounded-xl mb-4 flex justify-between">
      Cash on Delivery
      <input type="radio" defaultChecked />
    </div>
    <div className="flex gap-4 mt-6">
      <button onClick={onBack} className="border px-6 py-2 rounded-full">
        Back
      </button>
      <button
        onClick={onPlaceOrder}
        className="bg-black text-white px-6 py-2 rounded-full"
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  </div>
);

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OrderForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderForm, string>>>({});
  const [placingOrder, setPlacingOrder] = useState(false);

  // Fetch cart from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(storedCart);
      setLoadingCart(false);
    }
  }, []);

  const removeFromCart = (idx: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(idx, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof OrderForm, string>> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Enter valid email";
    if (!/^[6-9]\d{9}$/.test(form.phone)) newErrors.phone = "Enter valid phone number";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = "Enter valid pincode";
    if (!form.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateStep2()) {
      setStep(2);
      return;
    }
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    setPlacingOrder(true);
    try {
      const orderId = `VEL${Math.floor(100000 + Math.random() * 900000)}`;
      // Simulate API call
      setTimeout(() => {
        localStorage.removeItem("cart"); // clear cart
        router.push(`/order-success?orderId=${orderId}`);
      }, 1000);
    } catch (err: any) {
      alert(err.message || "Order failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loadingCart) return <p>Loading cart...</p>;

  return (
    <>
      <section className="bg-black text-white pt-12 pb-5 text-center">
        <h1 className="text-4xl md:text-5xl mt-10">Checkout</h1>
      </section>

      <section className="bg-[#f7f7f7] min-h-screen pt-20 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-10">
            {["Cart", "Shipping", "Payment"].map((label, i) => (
              <div key={i} className="flex items-center gap-2 mx-3 text-sm">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                    step === i + 1 ? "bg-black text-white" : "text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={step === i + 1 ? "text-black" : "text-gray-400"}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">
            <div className="space-y-8">
              {step === 1 && (
                <CartStep cart={cart} removeFromCart={removeFromCart} onNext={() => setStep(2)} />
              )}
              {step === 2 && (
                <ShippingStep
                  form={form}
                  errors={errors}
                  onChange={handleChange}
                  onBack={() => setStep(1)}
                  onNext={() => validateStep2() && setStep(3)}
                />
              )}
              {step === 3 && (
                <PaymentStep onBack={() => setStep(2)} onPlaceOrder={handlePlaceOrder} loading={placingOrder} />
              )}
            </div>

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
              {subtotal >= 500 && (
                <p className="text-green-600 text-sm mt-2">You qualify for free shipping!</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}