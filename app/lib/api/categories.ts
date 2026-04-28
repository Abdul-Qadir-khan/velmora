// app/lib/api/categories.ts
import { prisma } from "@/lib/prisma";
import { Category } from "@/app/types/category";

export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        minPrice: true, // ✅ ADD THIS
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories.map((cat): Category => ({
      id: Number(cat.id),
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      minPrice: cat.minPrice, // ✅ ADD THIS
    }));
    
  } catch (error) {
    console.error('❌ Categories fetch error:', error);
    return [
      { id: 1, name: "Men's Wear", slug: 'mens', image: '/images/categories/mens-wear.avif', minPrice: 799 },
      { id: 2, name: "Women's Wear", slug: 'womens', image: '/images/categories/womens-wear.jpg', minPrice: 1299 },
      { id: 3, name: 'T-Shirts', slug: 't-shirts', image: '/images/categories/tshirts.jpg', minPrice: 499 },
      { id: 4, name: 'Hoodies', slug: 'hoodies', image: '/images/categories/hoodies.jpg', minPrice: 1999 },
      { id: 5, name: 'Denim', slug: 'denim', image: '/images/categories/jeans.jpg', minPrice: 1499 },
      { id: 6, name: 'Accessories', slug: 'accessories', image: '/images/categories/wallet.jpg', minPrice: 1299 },
    ];
  }
}