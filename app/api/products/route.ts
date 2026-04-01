// app/api/products/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ slug generator
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * GET /api/products
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        variations: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      price,
      originalPrice,
      stock,
      rating,
      category,
      isNew,
      bestSeller,
      images,
      brand,
      variations,
      seo,
    } = body;

    // ✅ validation
    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    // ✅ generate slug HERE (correct place)
    const baseSlug = generateSlug(name);
    const slug = `${baseSlug}-${Date.now()}`;

    // ✅ create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,

        description: description || "",
        price: Number(price),
        originalPrice: Number(originalPrice) || 0,
        stock: Number(stock) || 0,
        rating: Number(rating) || 0,
        category: category || "T-Shirt",
        isNew: Boolean(isNew),
        bestSeller: Boolean(bestSeller),

        images: JSON.stringify(images || []),

        seoTitle: seo?.title || "",
        seoDescription: seo?.description || "",
        seoKeywords: seo?.keywords || "",

        brand: {
          connectOrCreate: {
            where: { name: brand?.name || "No Brand" },
            create: {
              name: brand?.name || "No Brand",
              logo: brand?.logo || "",
            },
          },
        },

        variations: {
          create: [
            {
              colors: JSON.stringify(variations?.colors || []),
              sizes: JSON.stringify(variations?.sizes || []),
              specs: JSON.stringify(variations?.specs || {}),
            },
          ],
        },
      },
      include: {
        brand: true,
        variations: true,
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}