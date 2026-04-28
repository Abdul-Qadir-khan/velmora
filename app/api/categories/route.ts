// app/api/categories/route.ts - NEW FILE
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category } from '@/app/types/category';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        minPrice: true,
      },
      orderBy: { name: 'asc' },
    });

    const result: Category[] = categories.map((cat) => ({
      id: Number(cat.id),
      name: cat.name,
      slug: cat.slug,
      image: cat.image || undefined,
      minPrice: cat.minPrice || undefined,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Categories error:', error);
    return NextResponse.json([
      { id: 1, name: "Men's Wear", slug: 'mens', image: '/images/categories/mens-wear.avif', minPrice: 799 },
      { id: 2, name: "Women's Wear", slug: 'womens', image: '/images/categories/womens-wear.jpg', minPrice: 1299 },
      { id: 3, name: 'T-Shirts', slug: 't-shirts', image: '/images/categories/tshirts.jpg', minPrice: 499 },
      { id: 4, name: 'Hoodies', slug: 'hoodies', image: '/images/categories/hoodies.jpg', minPrice: 1999 },
      { id: 5, name: 'Denim', slug: 'denim', image: '/images/categories/jeans.jpg', minPrice: 1499 },
      { id: 6, name: 'Accessories', slug: 'accessories', image: '/images/categories/wallet.jpg', minPrice: 1299 },
    ]);
  }
}