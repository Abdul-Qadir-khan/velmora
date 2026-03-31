'use client';

import { useState } from "react";

interface ProductClientProps {
  product: any;
  recommendedProducts: any[];
}

export default function ProductClient({ product, recommendedProducts }: ProductClientProps) {
  const [loading, setLoading] = useState(false);

  // 1. Null check for product
  if (!product) return <div>Product not found</div>;

  // 2. Parse images safely
  const images: string[] = (() => {
    try {
      return JSON.parse(product.images || "[]");
    } catch {
      return [];
    }
  })();

  // 3. Corrected addToCart function
  const addToCart = async (slug: string, quantity = 1) => {
    setLoading(true);
    try {
      // Replace this with your actual cart logic, e.g., API call
      console.log(`Adding ${quantity} of ${slug} to cart`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // mock async delay
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {images[0] && (
        <img
          src={images[0]}
          alt={product.name}
          style={{ width: 150, height: 150 }}
        />
      )}

      <div>
        <button onClick={() => addToCart(product.slug)} disabled={loading}>
          {loading ? "Adding..." : "Buy"}
        </button>
      </div>

      <h2>Recommended Products</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        {recommendedProducts.map((p: any) => (
          <div key={p.id || p.slug}>
            <p>{p.name || "Unnamed Product"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}