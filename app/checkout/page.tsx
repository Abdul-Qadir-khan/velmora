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

// 🛡️ ULTIMATE Image Handler - Fixes JSON string issue
const getSafeImage = (images: any): string => {
  // console.log("🔍 getSafeImage input:", images);

  if (!images) {
    // console.log("❌ No images");
    return "/placeholder.png";
  }

  try {
    // 🔑 FIX 1: Handle JSON STRING arrays from Prisma
    let imageData = images;

    // If it's a JSON string, parse it
    if (typeof images === 'string') {
      try {
        // Try parsing as JSON array
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          imageData = parsed;
          // console.log("✅ Parsed JSON string to array:", parsed);
        }
      } catch (e) {
        // console.log("⚠️ Not valid JSON array:", images);
        imageData = images;
      }
    }

    // Case 1: Array of images (parsed or real)
    if (Array.isArray(imageData)) {
      // console.log("📂 Array found:", imageData);
      for (const img of imageData) {
        if (img && typeof img === 'string' && img.trim()) {
          const url = img.trim();
          if (url.startsWith('http') || url.startsWith('/') || url.startsWith('https')) {
            // console.log("✅ Found valid image:", url);
            return url;
          }
        }
      }
      // console.log("❌ No valid array images");
      return "/placeholder.png";
    }

    // Case 2: Direct string URL
    if (typeof imageData === 'string') {
      const url = imageData.trim();
      if (url && (url.startsWith('http') || url.startsWith('/') || url.startsWith('https'))) {
        // console.log("✅ Direct string URL:", url);
        return url;
      }
    }

    // Case 3: Object with image properties
    if (typeof imageData === 'object' && imageData !== null) {
      const keys = ['image', 'images', 'img', 'url', 'src', 'thumbnail', 'mainImage', 'imageUrl', 'productImages'];
      for (const key of keys) {
        if (imageData[key]) {
          const img = getSafeImage(imageData[key]); // Recursive
          if (img !== "/placeholder.png") {
            // console.log("✅ Found in object:", img);
            return img;
          }
        }
      }
    }

  } catch (error) {
    // console.error("💥 Image parsing error:", error);
  }

  // console.log("❌ Final fallback to placeholder");
  return "/placeholder.png";
};

// 1️⃣ Cart Step Component
const CartStep = ({
  cart,
  removeFromCart,
  onNext,
}: {
  cart: CartProduct[];
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  onNext: () => void;
}) => (
  <div className="bg-white p-4 lg:p-8 rounded-3xl shadow-xl border border-gray-50">
    <div className="flex items-center justify-between mb-8 lg:mb-10">
      <h2 className="text-xl lg:text-2xl font-light tracking-tight text-gray-900">
        Shopping Bag ({cart.length})
      </h2>
      {cart.length > 0 && (
        <div className="text-xs lg:text-sm text-gray-500 font-medium uppercase tracking-wider">
          {cart.length === 1 ? '1 item' : `${cart.length} items`}
        </div>
      )}
    </div>

    {cart.length === 0 ? (
      <div className="text-center py-16 lg:py-20">
        <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 lg:mb-8 bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
          <svg className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 7.5M7 13l-1.5 7.5M17 13l1.5 7.5M17 13l2.5-7.5M16 15a4 4 0 01-8 0" />
          </svg>
        </div>
        <p className="text-lg lg:text-xl text-gray-600 font-light mb-6 lg:mb-8">Your bag is empty</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-black text-white px-8 lg:px-10 py-3 lg:py-4 rounded-2xl font-medium text-sm uppercase tracking-wider hover:bg-gray-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
        >
          Start Shopping
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    ) : (
      <>
        <div className="space-y-6 lg:space-y-8 mb-6 lg:mb-12">
          {cart.map((item, index) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}-${index}`}  // ✅ FIXED
              className="group flex items-start gap-4 lg:gap-6 pb-6 lg:pb-8 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 p-3 lg:p-4 -m-3 lg:-m-4 rounded-2xl transition-all duration-300 hover:shadow-sm"
            >
              <div className="relative w-20 h-24 lg:w-24 lg:h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-50 shadow-sm group-hover:shadow-md transition-shadow duration-300">
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
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="96px"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>

              <div className="flex-1 min-w-0 py-1 lg:py-2">
                <h3 className="text-base lg:text-lg font-light text-gray-900 leading-tight mb-2 lg:mb-3 line-clamp-2 group-hover:text-black transition-colors">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div className="text-xs lg:text-sm text-gray-600 font-light">
                    Qty: <span className="font-normal text-gray-900">{item.qty}</span>
                  </div>
                  <div className="text-lg lg:text-xl font-light text-gray-900 tracking-tight">
                    ₹{item.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-4 lg:gap-6 text-xs uppercase tracking-wider text-gray-500 font-light mb-3 lg:mb-4">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.color }} />
                    {item.color}
                  </span>
                  <span>{item.size}</span>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId, item.size, item.color)}
                  className="group/remove flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 lg:px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-sm cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover/remove:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 lg:pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6 lg:mb-8 text-xl lg:text-2xl font-light text-gray-900">
            <span>Total</span>
            <span className="text-2xl lg:text-3xl font-normal tracking-tight">
              ₹{cart.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()}
            </span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={onNext}
            className="group w-full bg-black text-white py-4 lg:py-5 px-6 lg:px-8 rounded-3xl font-light text-sm lg:text-base uppercase tracking-widest hover:bg-gray-900 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none shadow-xl active:scale-[0.98] border border-transparent hover:border-black/20 overflow-hidden relative"
          >
            <div className="flex items-center justify-center gap-2 relative z-10">
              Proceed to Shipping
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
        </div>
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
  <div className="bg-white p-4 rounded-2xl shadow-lg">
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

    <div className="flex flex-col md:flex-row gap-4 mt-10">
      <button
        onClick={onBack}
        className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        ← Back to Cart
      </button>
      <button
        onClick={onNext}
        className="flex-1 bg-linear-to-r from-black to-gray-800 text-white px-8 py-4 rounded-2xl font-semibold hover:from-gray-800 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
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
  <div className="bg-white p-4 rounded-2xl shadow-lg">
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
        <div className="text-right text-emerald-600 font-semibold flex flex-col sm:flex-row sm:items-end sm:gap-1 text-sm">
          <span>₹50 - ₹250</span>
          <span className="text-emerald-500 font-normal text-xs sm:text-sm">
            (varies by location)
          </span>
        </div>
      </div>
      <div className="flex justify-between text-2xl font-black border-t pt-6 py-4 bg-gray-50 rounded-xl">
        <span className="text-gray-900">Total</span>
        <span className="text-gray-900">₹{total.toLocaleString()}</span>
      </div>
    </div>

    <div className="flex flex-col md:flex-row gap-4 mt-10">
      <button
        onClick={onBack}
        className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        ← Back to Shipping
      </button>
      <button
        onClick={onPlaceOrder}
        disabled={loading}
        className="flex-1 bg-linear-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
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
  const [orderSuccess, setOrderSuccess] = useState(false);

  const displayCart = useMemo((): CartProduct[] => {
    return cart
      .filter(item => item?.id)
      .map(item => ({
        productId: String(item.id),
        name: item.name || "Unknown Product",
        price: Number(item.price) || 0,
        qty: Number(item.qty) || 1,
        size: item.selectedSize || "M",
        color: item.selectedColor || "Black",
        image: getSafeImage(item.images),
      }))
      .filter(item => item.price > 0);
  }, [cart]);

  const subtotal = useMemo(() =>
    displayCart.reduce((acc, item) => acc + (item.price * item.qty), 0), [displayCart]
  );

  const shipping = useMemo(() => subtotal >= 5000 ? 0 : 50, [subtotal]);
  const total = subtotal + shipping;
  const isFreeShipping = subtotal >= 4999;

  // 🔥 FORM HANDLERS (KEEP YOURS)
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof OrderForm]) {
      setErrors(prev => ({ ...prev, [name as keyof OrderForm]: '' }));
    }
  }, [errors]);

  const validateStep2 = useCallback(() => {
    const newErrors: Partial<Record<keyof OrderForm, string>> = {};
    if (!form.name.trim()) newErrors.name = "Name required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) newErrors.phone = "Valid 10-digit phone";
    if (!form.address.trim()) newErrors.address = "Address required";
    if (!form.city.trim()) newErrors.city = "City required";
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = "6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // 🔥 FIXED: REAL EMAIL INTEGRATION
  const handlePlaceOrder = useCallback(async () => {
    if (!validateStep2()) {
      setStep(2);
      return;
    }

    if (displayCart.length === 0) {
      alert("Cart empty!");
      return;
    }

    setPlacingOrder(true);
    
    try {
      // 🔥 BUILD ORDER DATA FROM YOUR CART
      const orderData = {
        orderId: `LYCOON-${Math.floor(100000 + Math.random() * 900000)}`,
        email: form.email.trim(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        total: total,
        items: displayCart.map(item => ({
          name: item.name,
          size: item.size,
          color: item.color,
          price: item.price,
          quantity: item.qty
        }))
      };

      console.log("🚀 Sending order:", orderData);

      // 🔥 SEND TO YOUR WORKING API
      const response = await fetch('/api/send-order/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        // ✅ SUCCESS - Clear cart & show success
        console.log("✅ Email sent! Order ID:", result.orderId);
        alert(`✅ Order #${result.orderId} confirmed!\nCheck your Gmail for details.`);
        
        // Clear cart (your existing logic)
        // await fetch('/api/cart', { method: 'DELETE' });
        
        // Go to success page
        router.push(`/order-success?orderId=${result.orderId}&total=${total}`);
      } else {
        throw new Error(result.error || 'Order failed');
      }
    } catch (error: any) {
      console.error("❌ Order error:", error);
      alert(`❌ Order failed: ${error.message}`);
    } finally {
      setPlacingOrder(false);
    }
  }, [displayCart, form, total, router, validateStep2]);

  return (
    <>
      {/* 🏠 Hero Section */}
      <section className="bg-linear-to-br from-slate-900 via-gray-900 to-slate-950 text-white pt-28 pb-20 text-center overflow-hidden relative">
        {/* Subtle luxury gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-slate-900/30" />

        {/* Elegant shimmer effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-pulse" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Refined typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight bg-linear-to-r from-white via-slate-100 to-emerald-100/80 bg-clip-text text-transparent mb-8 leading-[0.9] drop-shadow-xl">
            Checkout
          </h1>

          {/* Elegant info bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 text-lg lg:text-xl text-slate-300 font-light">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount} item{cartCount !== 1 ? 's' : ''}
            </span>

            <div className="flex items-center gap-3">
              <span>₹{subtotal.toLocaleString()}</span>
              {isFreeShipping && (
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 backdrop-blur-sm text-emerald-300 border border-emerald-500/20 rounded-xl text-sm font-medium tracking-wide">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free Shipping
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 📋 Main Content */}
      <section className="bg-gradient-to-b from-gray-50 to-white min-h-screen pb-24 px-4 md:px-8 lg:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto pt-20">
          {/* 👜 Progress Bar */}
          <div className="w-full max-w-2xl mx-auto mb-10 md:px-8">
            <div className="relative flex items-center justify-between">
              {["Cart", "Shipping", "Payment"].map((label, i) => (
                <div key={i} className="flex flex-col items-center z-10 relative">
                  {/* Step number */}
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-xs border-3 shadow-lg transition-all duration-300 ${step === i + 1
                    ? "bg-white text-slate-900 border-blue-400 shadow-blue-200/50"
                    : step > i + 1
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}>
                    {i + 1}
                  </div>

                  {/* Step label */}
                  <span className={`mt-2 text-xs font-medium uppercase tracking-widest ${step === i + 1
                    ? "text-slate-900"
                    : step > i + 1
                      ? "text-blue-600"
                      : "text-slate-400"
                    }`}>
                    {label}
                  </span>
                </div>
              ))}

              {/* Background track */}
              <div className="absolute inset-0 h-px bg-slate-200 top-5 mx-12" />

              {/* Progress overlay */}
              <div
                className={`absolute h-px bg-blue-400 shadow-sm transition-all duration-700 ease-out top-5 mx-12 ${step === 1 ? "w-1/4" :
                  step === 2 ? "w-1/2" :
                    step === 3 ? "w-full mx-auto" : "w-0"
                  }`}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] xl:grid-cols-[1.3fr_auto] gap-6 lg:gap-8 items-start max-w-6xl mx-auto lg:px-0 bg-gray-50/50 min-h-screen">
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
                  onPlaceOrder={handlePlaceOrder}  // 🔥 NOW SENDS EMAILS!
                  loading={placingOrder}
                />
              )}
            </div>

            {/* 💳 Order Summary - Sticky */}
            <div className="lg:sticky lg:top-28 self-start lg:w-[340px] w-full lg:max-w-[340px]">
              <div className="bg-white/90 backdrop-blur-xl p-6 lg:p-8 rounded-2xl shadow-2xl border border-white/60 ring-1 ring-slate-100/50 hover:ring-slate-200/60 transition-all duration-500 group/summary">

                {/* 🏛️ Compact Header */}
                <h3 className="text-xl font-light tracking-tight text-slate-900 uppercase border-b border-slate-100 pb-4 mb-6">
                  Order Summary
                </h3>

                {/* 📊 Tight Pricing */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-3 border-b border-slate-100/50">
                    <span className="text-sm font-light text-slate-700">
                      Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                    </span>
                    <span className="text-xl font-mono font-normal text-slate-900">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-slate-100/50">
                    <span className="text-sm font-light text-slate-700">Shipping</span>
                    {isFreeShipping ? (
                      <span className="text-lg font-medium text-emerald-600 px-2 py-1 bg-emerald-50/80 rounded-full text-xs uppercase tracking-wider">
                        Free
                      </span>
                    ) : (
                      <span className="text-xl font-mono font-normal text-slate-900">₹50</span>
                    )}
                  </div>

{isFreeShipping && (
  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 backdrop-blur-sm text-emerald-300 border border-emerald-500/20 rounded-xl text-sm font-medium tracking-wide">
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    Free Shipping
  </div>
)}
                </div>

                {/* 💎 Compact Total */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex justify-between items-baseline mb-6 p-4 bg-linear-to-r from-slate-50/70 to-white/50 rounded-xl border border-slate-100/30 shadow-sm">
                    <span className="text-lg font-light text-slate-900">Total</span>
                    <span className="text-3xl font-mono font-normal bg-linear-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mb-6 text-center font-light uppercase tracking-widest">
                    <div>Incl. taxes</div>
                    <div className="flex items-center justify-center gap-2 mt-1 text-slate-600 text-[10px]">
                      🔒 Secure • 💳 All cards
                    </div>
                  </div>

                  {/* ✨ Compact Luxury Button */}
                  {step === 1 && (
                    <button
                      onClick={() => setStep(2)}
                      disabled={displayCart.length === 0}
                      className="group w-full bg-linear-to-r from-slate-900 to-slate-950 text-white py-4 px-6 rounded-xl font-light text-sm uppercase tracking-wider hover:from-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 shadow-lg border border-slate-900/20 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden relative"
                    >
                      <div className="flex items-center justify-center gap-2 relative z-10">
                        Checkout
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
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