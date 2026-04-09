"use client";

import { Suspense } from "react";
import { useState } from "react";
import Hero from "./components/Hero";
import CategoriesSection from "./components/Categories";
import BestSellerSection from "./components/BestSellersSection";
import NewArrivals from "./components/Accessories";
import DiscountsSection from "./components/Discount";
import CustomerReviewsSection from "./components/Testimonials";
import WhyChoose from "./components/WhyChoose";
import BrandsSlider from "./components/BrandsSlider";
import { products, Product } from "../data/product"; // Assuming the `products` and `Product` are imported from your data
import NewsletterPopup from "./components/Popup";

export default function Home() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Define the filterProducts function
  const filterProducts = (category: string) => {
    if (category === "all") {
      setFilteredProducts(products); // Show all products
    } else {
      const filtered = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div>

      {/* poup */}
      {/* <NewsletterPopup/> */}
      {/* Hero Section */}
      <Hero />

      {/* Brands Section */}
      <BrandsSlider />

      {/* Categories Section */}
       {/* <CategoriesSection /> */}
      <hr className="border-gray-300" />
      {/* Best Sellers Section */}
      <BestSellerSection />

      {/* New Arrivals or Timeless Fashion */}
      <NewArrivals />

      {/* Discounts and Offers Section */}
      <DiscountsSection />

      {/* Customer Reviews Section */}
      {/* <CustomerReviewsSection /> */}

      {/* Why Choose Us Section */}
      <WhyChoose />

    </div>
  );
}