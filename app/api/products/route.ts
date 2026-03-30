import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { brand: true, variations: true },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ---------- VALIDATIONS ----------
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }
    if (!body.brand || !body.brand.name || !body.brand.name.trim()) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    const name = body.name.trim();
    const description = body.description || "";
    const price = Number(body.price) || 0;
    const originalPrice = Number(body.originalPrice) || 0;
    const stock = Number(body.stock) || 0;
    const rating = Number(body.rating) || 0;
    const category = body.category || "";
    const isNew = Boolean(body.isNew);
    const bestSeller = Boolean(body.bestSeller);
    const images = JSON.stringify(Array.isArray(body.images) ? body.images : []);
    const seoTitle = body.seo?.title || "";
    const seoDescription = body.seo?.description || "";
    const seoKeywords = body.seo?.keywords || "";

    // Normalize variations
    const variationsArray = Array.isArray(body.variations)
      ? body.variations
      : body.variations
      ? [body.variations]
      : [];

    // ---------- CREATE PRODUCT ----------
    const product = await prisma.product.create({
      data: {
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
        seoTitle,
        seoDescription,
        seoKeywords,
        brand: {
          connectOrCreate: {
            where: { name: body.brand.name.trim() }, // requires Brand.name @unique
            create: {
              name: body.brand.name.trim(),
              logo: body.brand.logo || "",
            },
          },
        },
        variations: {
          create: variationsArray.map((v: any) => ({
            colors: JSON.stringify(Array.isArray(v.colors) ? v.colors : []),
            sizes: JSON.stringify(Array.isArray(v.sizes) ? v.sizes : []),
            specs: JSON.stringify(v.specs || {}),
          })),
        },
      },
      include: { brand: true, variations: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}