// app/lib/api/product.ts - REPLACED VERSION
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

    // 🔥 FIXED: Vercel-safe URL detection
    let baseUrl: string;
    
    if (typeof window !== 'undefined') {
      // Client-side: use current origin
      baseUrl = window.location.origin;
    } else {
      // Server-side: use env var or Vercel URL
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                process.env.VERCEL_URL 
                  ? `https://${process.env.VERCEL_URL}`
                  : 'http://localhost:3000';
    }

    const url = `${baseUrl}/api/products?${params.toString()}`;
    
    console.log('🌐 Fetching:', url); // Keep for debugging
    
    const res = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ API Error:', res.status, errorText);
      
      // 🔥 BETTER FALLBACK: Try relative URL
      const fallbackUrl = `/api/products?${params.toString()}`;
      console.log('🔄 Trying fallback:', fallbackUrl);
      
      const fallbackRes = await fetch(fallbackUrl, {
        cache: "no-store",
        next: { revalidate: 0 }
      });
      
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        return {
          products: data.products || [],
          filters: data.filters || { categories: [], brands: [], sizes: [] },
          pagination: data.pagination || {}
        };
      }
      
      return { products: [], filters: { categories: [], brands: [], sizes: [] }, pagination: {} };
    }

    const data = await res.json();
    console.log('✅ Products loaded:', data.products?.length || 0);
    
    return {
      products: data.products || [],
      filters: data.filters || { categories: [], brands: [], sizes: [] },
      pagination: data.pagination || {}
    };
  } catch (error) {
    console.error("💥 getProducts error:", error);
    return {
      products: [],
      filters: { categories: [], brands: [], sizes: [] },
      pagination: {}
    };
  }
}