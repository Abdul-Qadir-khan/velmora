"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "John Doe",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5,
    review: "Absolutely love the HD CCTV Camera! Setup was simple and picture quality is amazing. Worth every penny!",
  },
  {
    id: 2,
    name: "Emma Smith",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 4,
    review: "Great product! Night vision works perfectly. Mobile app could be more responsive.",
  },
  {
    id: 3,
    name: "Michael Brown",
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
    rating: 5,
    review: "Excellent security camera with sharp picture. Weather resistant and makes me feel safer!",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    photo: "https://randomuser.me/api/portraits/women/4.jpg",
    rating: 5,
    review: "Best purchase ever! Crystal clear footage and super easy installation.",
  },
];

export default function CustomerReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextReview = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  const ReviewCard = ({ review, index, isActive }: { 
    review: any; 
    index: number; 
    isActive: boolean 
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ 
        opacity: 1, 
        scale: isActive ? 1.02 : 1,
        y: 0 
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30 
      }}
      className={`group relative bg-white/90 backdrop-blur-xl p-6 lg:p-8 rounded-2xl border border-white/60 shadow-xl hover:shadow-2xl hover:border-blue-300/50 transition-all duration-500 cursor-pointer h-full flex flex-col mx-2 ${
        isActive ? 'ring-2 ring-blue-200 shadow-blue-200/50' : ''
      }`}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Quote Icon */}
      <motion.div 
        className="absolute -top-3 -right-3 w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg opacity-90"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Quote className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
      </motion.div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-4 pt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 lg:w-5 lg:h-5 transition-colors duration-300 ${
                i < review.rating 
                  ? "text-yellow-400 fill-current" 
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-bold text-gray-700">
            {review.rating}/5
          </span>
        </div>

        {/* Review Text */}
        <p className="text-gray-700 leading-relaxed text-base lg:text-lg flex-1 mb-6 line-clamp-4">
          "{review.review}"
        </p>

        {/* User Info */}
        <div className="flex items-center gap-3 pt-1">
          <div className="relative">
            <img
              src={review.photo}
              alt={review.name}
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl object-cover ring-2 ring-white shadow-lg hover:ring-blue-300 transition-all duration-300"
              loading="lazy"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
          <div>
            <h4 className="text-lg lg:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {review.name}
            </h4>
            <span className="text-xs lg:text-sm text-gray-500 font-medium">Verified Buyer</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-12 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100/50 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-20 w-24 h-24 bg-yellow-100/30 rounded-2xl blur-xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl border border-blue-200/50 shadow-md text-sm font-bold text-blue-700 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            4.9⭐ (2,847 Reviews)
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text leading-tight mb-4"
          >
            What Our Customers Say
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Don't just take our word for it
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {/* Active Review */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`active-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center py-8"
            >
              <ReviewCard 
                review={reviews[currentIndex]} 
                index={currentIndex} 
                isActive={true} 
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {reviews.map((_, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'w-8 h-2.5 bg-blue-500 shadow-md' 
                    : 'bg-gray-300 hover:bg-blue-400 hover:w-3'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 -right-0 hidden lg:flex gap-2 transform translate-x-4">
            <motion.button
              type="button"
              onClick={prevReview}
              className="w-10 h-10 bg-white shadow-lg rounded-xl border hover:border-blue-200 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
            <motion.button
              type="button"
              onClick={nextReview}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg rounded-xl text-white transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center mb-16">
          {[
            { label: 'Total Reviews', value: '2,847' },
            { label: '5-Star', value: '92%' },
            { label: 'Repeat Buyers', value: '78%' },
            { label: 'Avg Rating', value: '4.9⭐' },
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-4"
            >
              <div className="text-2xl lg:text-3xl font-black text-blue-600 mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Read All Reviews →
          </motion.button>
        </div>
      </div>
    </section>
  );
}