// app/types/category.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  minPrice?: number; // ✅ ADD THIS LINE
}