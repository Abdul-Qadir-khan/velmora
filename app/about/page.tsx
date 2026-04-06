"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  ChevronRightIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon 
} from "@heroicons/react/24/outline";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero Section - Fully Responsive */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
            About Us
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed px-4">
            Crafting timeless fashion with passion and precision since 2015
          </p>
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 sm:gap-3 mt-8 sm:mt-12 px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm rounded-full font-medium text-base sm:text-lg hover:bg-white/30 transition-all duration-300 border border-white/30 group"
          >
            Shop Our Collection
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Our Story Section - Mobile Optimized */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <span className="inline-block px-3 sm:px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide mb-6 lg:mb-8">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Where Fashion Meets{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Passion
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Founded in 2015, we started with a simple vision: to create clothing that makes you feel confident, 
                comfortable, and effortlessly stylish. From our first boutique in downtown to our global online presence, 
                we've stayed true to our roots while pushing the boundaries of modern fashion.
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4 p-5 sm:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-lg sm:text-2xl font-bold text-white">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Sustainable Materials</h4>
                    <p className="text-gray-600 text-sm sm:text-base">100% eco-friendly fabrics sourced from ethical suppliers worldwide.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4 p-5 sm:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-lg sm:text-2xl font-bold text-white">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Artisan Craftsmanship</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Handcrafted by skilled artisans with decades of experience.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Image - Mobile first */}
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/5] sm:aspect-[3/4] w-full h-64 sm:h-80 md:h-96 lg:h-auto">
                <Image
                  src="/images/about-model.jpg"
                  alt="Fashion model wearing our signature collection"
                  fill
                  className="rounded-2xl sm:rounded-3xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500 w-full h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 w-20 sm:w-32 h-20 sm:h-32 lg:w-32 lg:h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section - Perfect Mobile Grid */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 px-4">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-600 to-orange-600">
              Mission
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mt-12 sm:mt-16">
            <div className="p-6 sm:p-8 bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 group hover:-translate-y-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl font-bold text-white">✨</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Empower Confidence</h4>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base px-2">Every piece is designed to make you feel your absolute best.</p>
            </div>
            
            <div className="p-6 sm:p-8 bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 group hover:-translate-y-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl font-bold text-white">🌿</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Sustainable Luxury</h4>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base px-2">Fashion that looks good and feels good for the planet.</p>
            </div>
            
            <div className="p-6 sm:p-8 bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 group hover:-translate-y-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl font-bold text-white">🎨</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Timeless Design</h4>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base px-2">Classic styles that transcend seasons and trends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Mobile Stacked */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-indigo-600 mb-2">50K+</div>
              <div className="text-lg sm:text-xl font-semibold text-gray-700">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-600 mb-2">250+</div>
              <div className="text-lg sm:text-xl font-semibold text-gray-700">Unique Styles</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pink-600 mb-2">5+</div>
              <div className="text-lg sm:text-xl font-semibold text-gray-700">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-600 mb-2">100%</div>
              <div className="text-lg sm:text-xl font-semibold text-gray-700">Eco-Friendly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Perfect Mobile Layout */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 px-4">
            Ready to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Elevate
            </span>{' '}
            Your Style?
          </h3>
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto px-4">
            Join thousands of fashion-forward individuals who trust us for their wardrobe essentials.
          </p>
          
          {/* Mobile Stacked, Desktop Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mb-16">
            <div className="group p-6 sm:p-8 bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 flex flex-col items-center text-center">
              <MapPinIcon className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Visit Us</h4>
              <p className="text-gray-600 text-sm sm:text-base">123 Fashion St<br className="sm:hidden"/> Downtown, NYC</p>
            </div>
            
            <div className="group p-6 sm:p-8 bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 flex flex-col items-center text-center">
              <PhoneIcon className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Call Us</h4>
              <p className="text-gray-600 text-sm sm:text-base">+1 (555) 123-4567</p>
            </div>
            
            <div className="group p-6 sm:p-8 bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 flex flex-col items-center text-center">
              <EnvelopeIcon className="w-10 h-10 sm:w-12 sm:h-12 text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Email Us</h4>
              <p className="text-gray-600 text-sm sm:text-base">hello@fashionstore.com</p>
            </div>
          </div>

          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-base sm:text-lg rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Get In Touch
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}