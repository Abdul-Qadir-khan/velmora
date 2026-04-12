"use client";
import Link from 'next/link'

import { useState, FormEvent, ChangeEvent } from "react";
import {
  ChevronRightIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ArrowPathIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleIconSolid
} from "@heroicons/react/24/solid";

// ✅ Proper TypeScript interfaces
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type SubmitStatus = "success" | "error" | null;

export default function Contact() {
  // ✅ Typed state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  // ✅ Typed event handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // ✅ Type-safe error clearing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // ✅ Typed validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    return newErrors;
  };

  // ✅ Typed submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed px-4">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Contact Form */}
          <div className="lg:order-2">
            <div className="sticky top-24">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm pr-10 ${errors.name
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 ring-1 ring-red-500/20"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                    placeholder="Enter your full name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center gap-1 animate-pulse">
                      <XCircleIcon className="w-4 h-4 flex-shrink-0" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm pr-10 ${errors.email
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 ring-1 ring-red-500/20"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                    placeholder="your@email.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center gap-1 animate-pulse">
                      <XCircleIcon className="w-4 h-4 flex-shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm pr-10 ${errors.subject
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 ring-1 ring-red-500/20"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                    placeholder="What's this about?"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="mt-1 text-sm text-red-600 flex items-center gap-1 animate-pulse">
                      <XCircleIcon className="w-4 h-4 flex-shrink-0" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 resize-vertical shadow-sm pr-10 ${errors.message
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 ring-1 ring-red-500/20"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                    placeholder="Tell us more about what you're looking for..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-600 flex items-center gap-1 animate-pulse">
                      <XCircleIcon className="w-4 h-4 flex-shrink-0" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:focus:ring-0"
                  aria-label={isSubmitting ? "Sending message..." : "Send message"}
                >
                  {isSubmitting ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>

              {/* Success Message */}
              {submitStatus === "success" && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl shadow-lg animate-in slide-in-from-top-4 duration-500"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircleIconSolid className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-lg text-emerald-800 mb-1">Message Sent Successfully!</h4>
                      <p className="text-emerald-700">Thank you for reaching out! We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === "error" && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl shadow-lg animate-in slide-in-from-top-4 duration-500"
                >
                  <div className="flex items-start gap-3">
                    <XCircleIcon className="w-8 h-8 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-lg text-red-800 mb-1">Something went wrong!</h4>
                      <p className="text-red-700">Please try again or email us directly at support@lycoonwear.com</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info Cards - Same as before */}
          <div className="lg:order-1">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              Get in Touch
            </h2>

            <div className="space-y-6 mb-12">
              <div className="group p-6 sm:p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-white/50 backdrop-blur-sm hover:border-indigo-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <MapPinIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Visit Our Store</h4>
                    <p className="text-gray-600 leading-relaxed">
                      C-302/2, Kalyan-Jafrabad<br className="sm:hidden" />
                      New Delhi, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 sm:p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-white/50 backdrop-blur-sm hover:border-purple-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <PhoneIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Call Anytime</h4>
                    <p className="text-gray-600">
                      <Link
                        href="tel:78178835909"
                        className="hover:text-indigo-600 transition-all duration-200 font-semibold hover:underline"
                        aria-label="Call us at +1 (555) 123-4567"
                      >
                        +91 781 7835 909
                      </Link>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Mon-Sat 9AM-8PM</p>
                  </div>
                </div>
              </div>

              <div className="group p-6 sm:p-8 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-white/50 backdrop-blur-sm hover:border-pink-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <EnvelopeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Email Us</h4>
                    <p className="text-gray-600">
                      <a
                        href="mailto:support@lycoonwear.com"
                        className="hover:text-indigo-600 transition-all duration-200 font-semibold hover:underline break-all"
                        aria-label="Email support@lycoonwear.com"
                      >
                        support@lycoonwear.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Hours */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200/50 shadow-lg">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <ClockIcon className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                Store Hours
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 divide-emerald-200">
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Monday - Friday</span>
                  <span className="font-bold text-emerald-700">9AM - 8PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Saturday</span>
                  <span className="font-bold text-emerald-700">10AM - 7PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}