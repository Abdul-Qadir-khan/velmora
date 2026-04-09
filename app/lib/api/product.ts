export async function getProducts({ category }: { category?: string } = {}) {
  try {
    const params = new URLSearchParams();
    if (category && category !== "all") {
      params.append("category", category);
    }

    // ✅ FIXED: Use your API route
    const res = await fetch(`http://localhost:3000/api/products?${params.toString()}`, {
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