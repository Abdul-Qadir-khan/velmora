// lib/api/product.ts - ✅ COMPLETE FIX
export async function getProducts(filters: {
  category?: string;
  brand?: string;
  size?: string;
  price?: string;
  sort?: string;
} = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== "all") params.append("category", filters.category);
    if (filters.brand && filters.brand !== "all") params.append("brand", filters.brand);
    if (filters.size) params.append("size", filters.size);
    if (filters.price) params.append("price", filters.price);
    if (filters.sort) params.append("sort", filters.sort);

    // 🔥 PRODUCTION-READY URL DETECTION
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000');

    const url = `${baseUrl}/api/products${params.toString() ? `?${params.toString()}` : ''}`;
    
    console.log('🌐 Shop fetching:', url); // ✅ Debug log
    
    const res = await fetch(url, {
      // 🔥 NO CACHE - Always fresh data
      cache: "no-store",
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!res.ok) {
      console.error('API Error:', res.status, await res.text());
      throw new Error(`Products fetch failed: ${res.status}`);
    }

    const data = await res.json();
    console.log('✅ Products loaded:', (data.products || data || []).length);
    
    return {
      products: data.products || data || [],
      filters: data.filters || { categories: [], brands: [], sizes: [], priceRanges: [] },
      pagination: data.pagination || {}
    };
  } catch (error) {
    console.error("❌ getProducts error:", error);
    return {
      products: [],
      filters: { categories: [], brands: [], sizes: [], priceRanges: [] },
      pagination: {}
    };
  }
}