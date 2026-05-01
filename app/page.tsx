"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import BestSellerSection from "./components/BestSellersSection";
import DiscountsSection from "./components/Discount";
import WhyChoose from "./components/WhyChoose";
import BrandsSlider from "./components/BrandsSlider";
import { products, Product } from "../data/product";
import NewsletterPopup from "./components/Popup";
// ✅ FIXED IMPORT
import CategoryShowcase from "./components/CategoryShowcase";
import VideoHeroSection from "./components/VideoHeroSection";
import InstagramFeed from "./components/Instagram";
import PradaTestimonials from "./components/Testimonials";

export default function Home() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const filterProducts = (category: string) => {
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div>
      <NewsletterPopup />
      {/* <Hero /> */}

      <VideoHeroSection />
      <BrandsSlider />

      {/* ✅ Works perfectly now */}
      <CategoryShowcase />

      <hr className="border-gray-300" />
      <BestSellerSection />
      <DiscountsSection />
      <WhyChoose />

      <InstagramFeed/>
<PradaTestimonials/>
    </div>
  );
}