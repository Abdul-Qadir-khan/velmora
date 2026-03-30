import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  id?: string;
}

// GET single product
export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { brand: true, variations: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT update product
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const variationsArray = Array.isArray(body.variations)
      ? body.variations
      : body.variations
      ? [body.variations]
      : [];

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description || "",
        price: Number(body.price) || 0,
        originalPrice: Number(body.originalPrice) || 0,
        stock: Number(body.stock) || 0,
        rating: Number(body.rating) || 0,
        category: body.category || "",
        isNew: Boolean(body.isNew),
        bestSeller: Boolean(body.bestSeller),
        images: JSON.stringify(Array.isArray(body.images) ? body.images : []),
        brand: {
          upsert: {
            create: {
              name: body.brand?.name || "Unknown",
              logo: body.brand?.logo || "",
            },
            update: {
              name: body.brand?.name || "Unknown",
              logo: body.brand?.logo || "",
            },
          },
        },
        variations: {
          deleteMany: {}, // delete old variations
          create: variationsArray.map((v: any) => ({
            colors: JSON.stringify(Array.isArray(v.colors) ? v.colors : []),
            sizes: JSON.stringify(Array.isArray(v.sizes) ? v.sizes : []),
            specs: JSON.stringify(v.specs || {}),
          })),
        },
        seoTitle: body.seo?.title || "",
        seoDescription: body.seo?.description || "",
        seoKeywords: body.seo?.keywords || "",
      },
      include: { brand: true, variations: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}