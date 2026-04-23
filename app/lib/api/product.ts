// lib/api/product.ts
export async function getProducts(filters: {
  category?: string;
  brand?: string;
  size?: string;
  price?: string;
  sort?: string;
} = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== "all") {
      params.append("category", filters.category);
    }
    if (filters.brand && filters.brand !== "all") {
      params.append("brand", filters.brand);
    }
    if (filters.size) {
      params.append("size", filters.size);
    }
    if (filters.price) {
      params.append("price", filters.price);
    }
    if (filters.sort) {
      params.append("sort", filters.sort);
    }

    let baseUrl: string;
    
    if (typeof window === 'undefined') { // ✅ FIXED: Server-side detection
      baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL 
        ? process.env.NEXT_PUBLIC_BASE_URL 
        : 'http://localhost:3000';
    } else {
      baseUrl = window.location.origin;
    }

    const queryString = params.toString();
    const url = `${baseUrl}/api/products${queryString ? `?${queryString}` : ''}`;
    
    // console.log('🌐 Fetching from:', url);
    
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      cache: "force-cache",
    });

    if (!res.ok) {
      // console.error('API Error:', res.status, res.statusText);
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data = await res.json();
    // console.log('✅ Products loaded:', (data.products || []).length);
    
    return {
      products: data.products || [],
      filters: data.filters || {},
      pagination: data.pagination || {}
    };
  } catch (error) {
    // console.error("❌ getProducts error:", error);
    return {
      products: [],
      filters: { categories: [], brands: [], sizes: [], priceRanges: [] },
      pagination: {}
    };
  }
}