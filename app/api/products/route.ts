import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // ✅ FIXED: Add category filtering
    const whereClause = category && category !== "all" 
      ? { category: { equals: category } }
      : {};

    console.log(`🔍 API Filter: category="${category || 'all'}"`);

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        brand: true,
        variations: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`✅ Found ${products.length} products`);

    return NextResponse.json({ products });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST unchanged
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name, description, price, originalPrice, stock, rating, category,
      isNew, bestSeller, images, brand, variations, seo,
    } = body;

    if (!name || !price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const baseSlug = generateSlug(name);
    const slug = `${baseSlug}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name, slug, description: description || "",
        price: Number(price), originalPrice: Number(originalPrice) || 0,
        stock: Number(stock) || 0, rating: Number(rating) || 0,
        category: category || "T-Shirt", isNew: Boolean(isNew),
        bestSeller: Boolean(bestSeller), images: JSON.stringify(images || []),
        seoTitle: seo?.title || "", seoDescription: seo?.description || "",
        seoKeywords: seo?.keywords || "",
        brand: {
          connectOrCreate: {
            where: { name: brand?.name || "No Brand" },
            create: { name: brand?.name || "No Brand", logo: brand?.logo || "" },
          },
        },
        variations: {
          create: [{
            colors: JSON.stringify(variations?.colors || []),
            sizes: JSON.stringify(variations?.sizes || []),
            specs: JSON.stringify(variations?.specs || {}),
          }],
        },
      },
      include: { brand: true, variations: true },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}