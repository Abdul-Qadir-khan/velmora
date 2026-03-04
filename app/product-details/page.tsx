"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/Button";

const product = {
  id: 101,
  name: "HD CCTV Camera - Pro Series",
  description:
    "Experience crystal clear surveillance with the Pro Series HD CCTV Camera, featuring night vision, motion detection, and weather resistance.",
  price: "$299",
  images: [
    "/images/dome-camera.webp",
    "/images/bullet-camera.webp",
    "/images/wireless-camera.webp",
    "/images/pole-camera.webp",
  ],
  variations: {
    colors: ["Black", "White", "Grey"],
    sizes: ["Small", "Medium", "Large"],
    specs: {
      resolution: "1080p Full HD",
      lens: "3.6mm fixed",
      connectivity: "Wired/Wireless",
      nightVision: "Up to 30m",
      warranty: "2 Years",
    },
  },
};

export default function ProductDetailsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.variations.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.variations.sizes[0]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    setZoomed(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
    setZoomed(false);
  };

  return (
    <>
      <section className="py-12 bg-black"></section>
      <section className="w-full min-h-screen bg-gray-50 px-6 md:px-20 py-20 flex flex-col lg:flex-row gap-16">
        {/* Left: Image carousel with zoom */}
        <div className="flex-1 max-w-xl relative select-none">
          <div
            className={`relative overflow-hidden rounded-3xl shadow-xl cursor-zoom-in ${zoomed ? "cursor-zoom-out" : ""
              }`}
            onClick={() => setZoomed((prev) => !prev)}
          >
            <motion.img
              src={product.images[currentImageIndex]}
              alt={`${product.name} image ${currentImageIndex + 1}`}
              className={`w-full h-[450px] object-cover rounded-3xl transition-transform duration-300 ${zoomed ? "scale-150" : "scale-100"
                }`}
              drag={zoomed ? false : true}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              whileTap={{ cursor: "grabbing" }}
            />
          </div>

          {/* Carousel Controls */}
          <div className="flex justify-between mt-4 px-6">
            <button
              onClick={prevImage}
              className="bg-white shadow-lg rounded-full p-3 hover:bg-accent hover:text-white transition"
              aria-label="Previous image"
            >
              &#8592;
            </button>
            <button
              onClick={nextImage}
              className="bg-white shadow-lg rounded-full p-3 hover:bg-accent hover:text-white transition"
              aria-label="Next image"
            >
              &#8594;
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-6 justify-center">
            {product.images.map((img, idx) => (
              <img
                key={img}
                src={img}
                alt={`${product.name} thumbnail ${idx + 1}`}
                onClick={() => {
                  setCurrentImageIndex(idx);
                  setZoomed(false);
                }}
                className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer transition ${idx === currentImageIndex
                    ? "border-accent scale-105"
                    : "border-transparent hover:border-gray-400"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product info and variations */}
        <div className="flex-1 max-w-lg flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-[#0B1F3A] mb-6">
            {product.name}
          </h1>

          <p className="text-gray-700 text-lg mb-8">{product.description}</p>

          <div className="mb-8">
            <span className="text-3xl font-bold text-accent">{product.price}</span>
          </div>

          {/* Variations */}
          <div className="mb-8 space-y-6">
            {/* Color Selector */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Color:
              </label>
              <div className="flex gap-4">
                {product.variations.colors.map((color) => {
                  const isSelected = selectedColor === color;

                  // Define actual color codes or names for backgroundColor
                  const bgColor =
                    color.toLowerCase() === "black"
                      ? "#000000"
                      : color.toLowerCase() === "white"
                        ? "#FFFFFF"
                        : color.toLowerCase() === "grey" || color.toLowerCase() === "gray"
                          ? "#9CA3AF" // Tailwind's gray-400 hex
                          : "#D1D5DB"; // Tailwind's gray-300 hex fallback

                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      type="button"
                      aria-label={`Select color ${color}`}
                      className={`w-10 h-10 rounded-full border-2 ${isSelected ? "border-accent scale-110 shadow-lg" : "border-gray-300"
                        } transition-transform duration-300 focus:outline-none flex items-center justify-center`}
                      style={{ backgroundColor: bgColor }}
                    >
                      {/* For white, add subtle shadow inside so it doesn't disappear on white background */}
                      {color.toLowerCase() === "white" && (
                        <div className="w-8 h-8 rounded-full bg-white shadow-inner" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Size:
              </label>
              <div className="flex gap-4">
                {product.variations.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 ${isSelected
                          ? "border-accent bg-accent text-white shadow-lg"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        } transition focus:outline-none`}
                      type="button"
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specs */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Specifications:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {Object.entries(product.variations.specs).map(([key, value]) => (
                  <li key={key}>
                    <span className="capitalize font-medium">{key.replace(/([A-Z])/g, " $1")}:</span> {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-max px-12 py-4 text-lg rounded-2xl hover:scale-105 transition-transform"
            onClick={() =>
              alert(
                `Added ${product.name} (${selectedColor}, ${selectedSize}) to cart!`
              )
            }
          >
            Add to Cart
          </Button>
        </div>
      </section>
    </>
  );
}