"use client";

import { useCart } from '@/app/context/CartContext';
import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

// 🛡️ Safe Image Handler Utility
const getSafeImage = (images: any): string => {
  if (!images) return "/placeholder.png";

  if (Array.isArray(images)) {
    const firstValid = images.find((img: any) =>
      img && typeof img === 'string' && img.trim()
    ) as string;
    return firstValid || "/placeholder.png";
  }

  if (typeof images === 'string' && images.trim()) {
    return images;
  }

  return "/placeholder.png";
};

// 1️⃣ Cart Step Component
const CartStep = ({
  cart,
  removeFromCart,
  onNext,
}: {
  cart: CartProduct[];
  removeFromCart: (productId: string) => void;
  onNext: () => void;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <h2 className="text-2xl font-bold mb-6">Your Cart ({cart.length} items)</h2>
    {cart.length === 0 ? (
      <div className="text-center py-12">
        <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
          <span className="text-4xl text-gray-400">🛒</span>
        </div>
        <p className="text-gray-500 mt-4 text-lg">Your cart is empty</p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Continue Shopping
        </Link>
      </div>
    ) : (
      <>
        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <div key={item.productId} className="flex gap-4 border-b pb-6 last:border-b-0">
              <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={
                    item.image &&
                      typeof item.image === 'string' &&
                      item.image.trim() &&
                      (item.image.startsWith('http') || item.image.startsWith('/'))
                      ? item.image
                      : "/placeholder.png"
                  }
                  alt={item.name || "Product"}
                  fill
                  className="object-cover"
                  sizes="80px"
                  priority={false}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-base">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Qty: {item.qty}</p>
                <p className="text-lg font-bold text-gray-900 mt-1">₹{item.price.toLocaleString()}</p>
                <div className="text-xs text-gray-500 space-y-1 mt-2">
                  <p>Color: <span className="font-medium capitalize">{item.color}</span></p>
                  <p>Size: <span className="font-medium">{item.size}</span></p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-200 whitespace-nowrap"
                title="Remove item"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          disabled={cart.length === 0}
          onClick={onNext}
          className="w-full bg-gradient-to-r from-black to-gray-900 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          Proceed to Shipping →
        </button>
      </>
    )}
  </div>
);

// 2️⃣ Shipping Step
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
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <h2 className="text-2xl font-bold mb-8">Shipping Details</h2>
    <form className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {(["name", "email", "phone", "city", "pincode"] as (keyof OrderForm)[]).map((field) => (
          <div key={field}>
            <input
              name={field}
              type={
                field === "email"
                  ? "email"
                  : field === "phone" || field === "pincode"
                    ? "tel"
                    : "text"
              }
              placeholder={
                field.charAt(0).toUpperCase() +
                field.slice(1).replace(/([A-Z])/g, ' $1')
              }
              value={form[field] as string}
              onChange={onChange}
              className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 font-medium ${errors[field as keyof OrderForm]
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300"
                }`}
            />
            {errors[field as keyof OrderForm] && (
              <p className="text-red-500 text-sm mt-1 font-medium flex items-center gap-1">
                <span className="w-4 h-4">⚠️</span>
                {errors[field as keyof OrderForm]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div>
        <textarea
          name="address"
          placeholder="Full address (street, landmark, etc.)"
          value={form.address}
          onChange={onChange}
          rows={4}
          className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-vertical font-medium ${errors.address
              ? "border-red-300 bg-red-50"
              : "border-gray-200 hover:border-gray-300"
            }`}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1 font-medium flex items-center gap-1">
            <span className="w-4 h-4">⚠️</span>
            {errors.address}
          </p>
        )}
      </div>
    </form>

    <div className="flex gap-4 mt-10">
      <button
        onClick={onBack}
        className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        ← Back to Cart
      </button>
      <button
        onClick={onNext}
        className="flex-1 bg-gradient-to-r from-black to-gray-800 text-white px-8 py-4 rounded-2xl font-semibold hover:from-gray-800 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
      >
        Continue to Payment →
      </button>
    </div>
  </div>
);

// 3️⃣ Payment Step
const PaymentStep = ({
  subtotal,
  total,
  onBack,
  onPlaceOrder,
  loading,
}: {
  subtotal: number;
  total: number;
  onBack: () => void;
  onPlaceOrder: () => void;
  loading: boolean;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg">
    <h2 className="text-2xl font-bold mb-8">Payment Method</h2>

    <div className="space-y-3 mb-10">
      <label className="flex items-center p-5 border-2 border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer transition-all duration-200 hover:shadow-lg group">
        <input
          type="radio"
          name="payment"
          className="mr-4 w-5 h-5 text-black border-2 border-gray-300 group-hover:border-gray-400 focus:ring-emerald-500 focus:ring-2"
          defaultChecked
        />
        <div>
          <div className="font-semibold text-xl text-gray-900">Cash on Delivery</div>
          <div className="text-sm text-gray-600 mt-1">Pay safely when your order arrives</div>
        </div>
      </label>
    </div>

    <div className="border-t pt-8 space-y-4">
      <div className="flex justify-between text-lg">
        <span className="text-gray-700 font-medium">Subtotal</span>
        <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-lg">
        <span className="text-gray-700 font-medium">Shipping</span>
        <span className="font-semibold text-emerald-600">₹50</span>
      </div>
      <div className="flex justify-between text-2xl font-black border-t pt-6 py-4 bg-gray-50 rounded-xl">
        <span className="text-gray-900">Total</span>
        <span className="text-gray-900">₹{total.toLocaleString()}</span>
      </div>
    </div>

    <div className="flex gap-4 mt-10">
      <button
        onClick={onBack}
        className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        ← Back to Shipping
      </button>
      <button
        onClick={onPlaceOrder}
        disabled={loading}
        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
      >
        {loading ? (
          <>
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Placing Order...
          </>
        ) : (
          <>
            <span>✅</span>
            Place Order
          </>
        )}
      </button>
    </div>

    <p className="text-xs text-gray-500 mt-6 text-center">
      🔒 Secure checkout • Incl. all taxes
    </p>
  </div>
);

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, removeFromCart, cartCount } = useCart();

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

  // 🔧 PERFECTLY SAFE Cart Transformation
  const displayCart = useMemo((): CartProduct[] => {
    return cart
      .filter(item => item?.id) // Remove invalid items
      .map(item => ({
        productId: String(item.id),
        name: item.name || "Unknown Product",
        price: Number(item.price) || 0,
        qty: Number(item.qty) || 1,
        size: item.selectedSize || "M",
        color: item.selectedColor || "Black",
        image: getSafeImage(item.images),
      }))
      .filter(item => item.price > 0); // Remove free items
  }, [cart]);

  // 💰 Optimized calculations
  const subtotal = useMemo(() =>
    cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 0), 0), [cart]
  );

  const shipping = useMemo(() => subtotal > 499 ? 0 : 50, [subtotal]);
  const total = subtotal + shipping;
  const isFreeShipping = subtotal >= 499;

  // 📝 Form handlers
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear error immediately
    if (errors[name as keyof OrderForm]) {
      setErrors(prev => ({ ...prev, [name as keyof OrderForm]: '' }));
    }
  }, [errors]);

  const validateStep2 = useCallback(() => {
    const newErrors: Partial<Record<keyof OrderForm, string>> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter valid email";
    if (!/^[6-9]\d{9}$/.test(form.phone)) newErrors.phone = "Enter valid 10-digit phone (starts with 6-9)";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = "Enter valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handlePlaceOrder = useCallback(async () => {
    if (!validateStep2()) {
      setStep(2);
      return;
    }

    if (displayCart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setPlacingOrder(true);
    try {
      const orderId = `VEL${Math.floor(100000 + Math.random() * 900000)}`;

      const orderData = {
        orderId,
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: `${form.address.trim()}, ${form.city.trim()} - ${form.pincode.trim()}`,
        },
        subtotal,
        shipping,
        total,
        items: displayCart,
        timestamp: new Date().toISOString(),
      };

      console.log("📦 Placing order:", orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Clear cart
        await fetch('/api/cart', { method: 'DELETE' });
        router.push(`/order-success?orderId=${orderId}&total=${total}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Order placement failed');
      }
    } catch (error: any) {
      console.error("❌ Order failed:", error);
      alert(`Order failed: ${error.message}`);
    } finally {
      setPlacingOrder(false);
    }
  }, [displayCart, form, subtotal, shipping, total, router, validateStep2]);

  return (
    <>
      {/* 🏠 Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white pt-24 pb-16 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-white via-emerald-100 to-blue-200 bg-clip-text text-transparent mb-6 drop-shadow-2xl leading-tight">
            Checkout
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            {cartCount} item{cartCount !== 1 ? 's' : ''} • ₹{subtotal.toLocaleString()}
            {isFreeShipping && <span className="ml-3 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">Free Shipping</span>}
          </p>
        </div>
      </section>

      {/* 📋 Main Content */}
      <section className="bg-gradient-to-b from-gray-50 to-white min-h-screen pb-24 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto pt-20">
          {/* Progress Bar */}
          <div className="flex justify-center mb-20 max-w-2xl mx-auto">
            {["Cart", "Shipping", "Payment"].map((label, i) => (
              <div key={i} className="flex items-center gap-4 mx-6 group relative">
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl font-bold text-lg transition-all duration-300 group-hover:scale-110 shadow-lg ${step === i + 1
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/50"
                    : step > i + 1
                      ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200 shadow-emerald-200/50"
                      : "bg-gray-200 text-gray-500 border-2 border-gray-300 shadow-sm hover:shadow-md"
                  }`}>
                  {i + 1}
                </div>
                <span className={`font-semibold transition-all duration-300 ${step === i + 1
                    ? "text-gray-900 font-bold scale-105"
                    : "text-gray-500 group-hover:text-gray-700"
                  }`}>
                  {label}
                </span>
                {i < 2 && (
                  <div className={`absolute top-7 left-full w-20 h-1 transition-all duration-300 ${step > i + 1
                      ? "bg-emerald-500"
                      : step === i + 1
                        ? "bg-emerald-200"
                        : "bg-gray-200"
                    }`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
            {/* 📱 Main Content */}
            <div className="space-y-8 lg:max-w-4xl">
              {step === 1 && (
                <CartStep
                  cart={displayCart}
                  removeFromCart={removeFromCart}
                  onNext={() => setStep(2)}
                />
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
                <PaymentStep
                  subtotal={subtotal}
                  total={total}
                  onBack={() => setStep(2)}
                  onPlaceOrder={handlePlaceOrder}
                  loading={placingOrder}
                />
              )}
            </div>

            {/* 💳 Order Summary - Sticky */}
            <div className="lg:sticky lg:top-28 self-start">
              <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                <h3 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-2">
                  <span>💰</span>
                  Order Summary
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-xl py-3 border-b border-gray-100">
                    <span className="text-gray-700 font-semibold">Subtotal ({cartCount} items)</span>
                    <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-xl py-3 border-b border-gray-100">
                    <span className="text-gray-700 font-semibold">Shipping</span>
                    {isFreeShipping ? (
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <span>✨</span>
                        Free
                      </span>
                    ) : (
                      <span className="font-semibold text-gray-900">₹50</span>
                    )}
                  </div>

                  {isFreeShipping && (
                    <div className="flex justify-between text-emerald-600 font-bold text-lg py-2 bg-emerald-50 rounded-xl px-4">
                      <span>🎉 Free Shipping (Order &gt; ₹500)</span>
                      <span>-₹50</span>
                    </div>
                  )}
                </div>

                <div className="border-t-2 pt-8">
                  <div className="flex justify-between text-3xl font-black text-gray-900 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-6 text-center font-medium">
                    ✅ Incl. all taxes • Secure checkout • Cash on Delivery
                  </p>

                  {step === 1 && (
                    <button
                      onClick={() => setStep(2)}
                      disabled={displayCart.length === 0}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <span>🚀</span>
                      Proceed to Checkout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}