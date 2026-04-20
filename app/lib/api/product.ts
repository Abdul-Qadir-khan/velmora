export async function getProducts({ category }: { category?: string } = {}) {
  try {
    const params = new URLSearchParams();
    if (category && category !== "all") {
      params.append("category", category);
    }

    // ✅ FIXED: Use absolute URL for SSR
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const queryString = params.toString();
    const url = `${baseUrl}/api/products${queryString ? `?${queryString}` : ''}`;
    
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      cache: "force-cache",
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}