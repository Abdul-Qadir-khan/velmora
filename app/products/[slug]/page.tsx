import { prisma } from "@/lib/prisma";
import ProductClient from "./ProductClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  // ✅ FIX: await params
  const { slug } = await params;

  // ❌ invalid slug
  if (!slug) {
    return (
      <div className="text-center py-20 text-red-500">
        Invalid product URL
      </div>
    );
  }

  // ✅ fetch product
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variations: true,
      brand: true,
    },
  });

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-500">
        Product not found
      </div>
    );
  }

  // ✅ recommended
  const recommendedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
    },
    take: 8,
  });

  // ✅ normalize images safely
  const normalizeImages = (p: any) => {
    try {
      if (Array.isArray(p.images)) return p.images;
      if (typeof p.images === "string") return JSON.parse(p.images);
      return [];
    } catch {
      return [];
    }
  };

  return (
    <ProductClient
      product={{
        ...product,
        images: normalizeImages(product),
      }}
      recommendedProducts={recommendedProducts.map((p) => ({
        ...p,
        images: normalizeImages(p),
      }))}
    />
  );
}