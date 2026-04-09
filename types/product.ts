export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  rating?: number;
  category: string;
  images: string | string[];
  brand?: {
    id: number;
    name: string;
  };
  
  // ✅ FIX: Proper variations type
  variations?: {
    sizes?: string[];
    colors?: string[];
    [key: string]: any;
  }[];
  
  size?: string;
  color?: string;
  isNew?: boolean;
  bestSeller?: boolean;
  createdAt?: string;
}