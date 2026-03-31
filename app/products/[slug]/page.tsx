import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

// Fetch product by slug
async function getProduct(slug: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/products/slug/${slug}`, {
      cache: "no-store", // always fresh
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Fetch recommended products
async function getRecommendedProducts() {
  try {
    const res = await fetch(`http://localhost:3000/api/products?limit=8`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  const recommendedProducts = await getRecommendedProducts();

  if (!product) return notFound();

  // Fix images array
  let images: string[] = [];
  try {
    images = JSON.parse(product.images || "[]");
  } catch {
    images = [];
  }

  // Fix variations
  const variations = (product.variations || []).map((v: any) => ({
    ...v,
    colors: JSON.parse(v.colors || "[]"),
    sizes: JSON.parse(v.sizes || "[]"),
    specs: JSON.parse(v.specs || "{}"),
  }));

  return (
    <ProductClient
      product={{ ...product, images, variations }}
      recommendedProducts={recommendedProducts}
    />
  );
}