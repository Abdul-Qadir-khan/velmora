"use client";

import Link from "next/link";
import { products } from "../../data/product";
import Feature from "../components/FeatureSection";
import Product from "../components/ProductChoose";

export default function ProductsPageWithBrands() {
  return (
    <>
      <section className="bg-black py-12"></section>

      <section className="w-full min-h-screen bg-gray-50 md:py-24 py-12 px-5 md:px-20">
        <div className="md:max-w-7xl w-full mx-auto">

          {/* Header */}
          <div className="text-center md:mb-20 mb-10">
            <span className="text-sm uppercase tracking-widest text-accent font-semibold">
              Explore
            </span>

            <h2 className="text-4xl md:text-6xl font-bold mt-4 md:leading-tight leading-tighter text-gray-900">
              Featured Products
              <span className="block text-gray-400 text-lg md:text-xl mt-2 font-medium">
                Premium CCTV & Security Systems
              </span>
            </h2>

            <p className="max-w-3xl mx-auto text-gray-600 mt-6 text-lg leading-relaxed">
              Browse our top-of-the-line security products designed to protect your home or business.
              Each product is carefully selected for reliability and performance.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-12 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative rounded-3xl overflow-hidden shadow-lg group hover:shadow-2xl transition-shadow duration-500"
              >
                {/* Product Image */}
                <div className="relative md:h-80 h-70 overflow-hidden">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Brand Logo */}
                  {product.brand?.logo && (
                    <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md z-10">
                      <img
                        src={product.brand.logo}
                        alt={product.brand.name}
                        className="w-10 h-10 object-contain"
                        draggable={false}
                      />
                    </div>
                  )}

                  {/* New Badge */}
                  {product.isNew && (
                    <div className="absolute top-4 right-4 bg-accent text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                      New
                    </div>
                  )}

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 md:p-6 p-3 pb-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      {product.name}
                    </h3>

                    <p className="text-gray-200 text-sm md:mt-1">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Price Section */}
                      <div className="flex items-center gap-2">
                        {product.originalPrice && (
                          <span className="line-through text-gray-400 text-sm">
                            ${product.originalPrice}
                          </span>
                        )}
                        <span className="text-accent font-semibold text-lg">
                          ${product.price}
                        </span>
                      </div>

                      {/* Buy Button */}
                      <Link
                        href={`/products/${product.slug}`}
                        className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transform transition-transform"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Feature />
      <Product />
    </>
  );
}