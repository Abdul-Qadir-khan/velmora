// app/lib/api/categories.ts
import { prisma } from "@/lib/prisma";

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: 'asc'
    }
  });

  return categories;
}