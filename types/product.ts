// ✅ UPDATED types/product.ts
export interface Product {
  id: string;  // Prisma uses String @id
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  category: string;
  isNew: boolean;
  bestSeller: boolean;
  images: string[];  // Always array
  brand: {
    id: string;
    name: string;
    logo?: string;
  };
  variations: {
    id: string;
    colors: string[];
    sizes: string[];
    specs: {
      material?: string;
      fit?: string;
      sleeve?: string;
      pattern?: string;
      washing?: string;
    };
  }[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}