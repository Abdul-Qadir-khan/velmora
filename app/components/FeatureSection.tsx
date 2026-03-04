"use client";

import { motion } from "framer-motion";
import Button from "./Button";

const accessories = [
  {
    id: 1,
    name: "Mounting Bracket",
    description: "Durable mount for CCTV cameras.",
    image: "/images/dome-camera.webp",
    price: "$29",
    oldPrice: "$39",
    isNew: true,
  },
];

const rightColumnAccessories = [
  {
    id: 2,
    name: "Power Supply Cable",
    description: "10-meter long power supply cable.",
    image: "/images/hero1.jpg",
    price: "$19",
    oldPrice: "$25",
    isNew: false,
  },
  {
    id: 3,
    name: "Security Signage",
    description: "Professional security warning signs.",
    image: "/images/hero2.jpg",
    price: "$9",
    oldPrice: "$12",
    isNew: true,
  },
  {
    id: 4,
    name: "Cable Connector",
    description: "Premium CCTV connector set.",
    image: "/images/hero3.jpg",
    price: "$14",
    oldPrice: "$18",
  },
];

export default function FeaturedAccessories() {
  const featured = accessories[0];

  return (
    <section className="w-full bg-gray-50 md:py-24 py-12 px-5 md:px-20">
      {/* Header */}
      <div className="text-center md:mb-16 mb-8 max-w-3xl mx-auto">
        <span className="text-sm uppercase tracking-widest text-accent font-semibold">
          Accessories
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mt-2 text-gray-900">
          Premium CCTV Accessories
        </h2>
        <p className="md:mt-4 mt-2 text-gray-600 text-lg">
          Enhance your CCTV setup with our premium accessories. Stylish,
          durable, and fully compatible with all major systems.
        </p>
      </div>

      {/* Split Layout */}
      <div className="flex flex-col lg:flex-row md:gap-10 gap-5 max-w-7xl mx-auto">
        
        {/* LEFT: Big Featured Card */}
        <motion.div
          className="relative flex-1 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer h-[500px]"
          whileHover={{ scale: 1.03 }}
        >
          <motion.img
            src={featured.image}
            alt={featured.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-8">
            <h3 className="text-3xl font-bold text-white">
              {featured.name}
            </h3>
            <p className="text-gray-200 mt-2">
              {featured.description}
            </p>

            <div className="flex items-center gap-4 mt-4">
              <span className="text-accent text-xl font-bold">
                {featured.price}
              </span>
              {featured.oldPrice && (
                <span className="text-gray-400 line-through">
                  {featured.oldPrice}
                </span>
              )}
              <Button
                variant="primary"
                className="ml-auto px-6 py-2 text-sm rounded-lg bg-accent text-white shadow-lg hover:scale-105 transition-transform"
              >
                Buy Now
              </Button>
            </div>
          </div>

          {featured.isNew && (
            <div className="absolute top-4 left-4 bg-accent text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
              New
            </div>
          )}
        </motion.div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Top Full Width Card */}
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer h-[240px]"
            whileHover={{ scale: 1.03 }}
          >
            <motion.img
              src={rightColumnAccessories[0].image}
              alt={rightColumnAccessories[0].name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
              <h4 className="text-2xl font-semibold text-white">
                {rightColumnAccessories[0].name}
              </h4>
              <p className="text-gray-200 text-sm mt-1">
                {rightColumnAccessories[0].description}
              </p>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-accent font-bold">
                  {rightColumnAccessories[0].price}
                </span>
                {rightColumnAccessories[0].oldPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    {rightColumnAccessories[0].oldPrice}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bottom 2 Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rightColumnAccessories.slice(1, 3).map((item) => (
              <motion.div
                key={item.id}
                className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer h-[220px]"
                whileHover={{ scale: 1.03 }}
              >
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <h4 className="text-lg font-semibold text-white">
                    {item.name}
                  </h4>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-accent font-bold">
                      {item.price}
                    </span>
                    {item.oldPrice && (
                      <span className="text-gray-400 line-through text-xs">
                        {item.oldPrice}
                      </span>
                    )}
                  </div>
                </div>

                {item.isNew && (
                  <div className="absolute top-3 left-3 bg-accent text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
                    New
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}