// app/lib/api/categories.ts
import { prisma } from "@/lib/prisma";

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return categories;
  } catch (error) {
    console.error('Categories fetch error:', error);
    // Fallback data
    return [
      { id: '1', name: 'T-Shirts', slug: 't-shirts' },
      { id: '2', name: "Men's", slug: 'mens' },
      { id: '3', name: "Women\'s", slug: 'womens' },
    ];
  }
}