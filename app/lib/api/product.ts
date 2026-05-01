// app/lib/api/product.ts
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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000');

    const url = `${baseUrl}/api/products?${params.toString()}`;
    
    console.log('🌐 Fetching products:', url);
    
    // const res = await fetch(url, {
    //   cache: "no-store",
    //   next: { revalidate: 0 }
    // });

    const res = await fetch(url, {
  next: { revalidate: 300 },
  cache: 'force-cache'
});

    if (!res.ok) {
      console.error('API Error:', res.status, await res.text());
      return { products: [], filters: {}, pagination: {} };
    }

    const data = await res.json();
    console.log('✅ Products loaded:', data.products?.length || 0);
    
    return {
      products: data.products || [],
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