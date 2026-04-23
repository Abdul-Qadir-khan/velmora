import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ---------------- UPDATE PRODUCT ----------------
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params is Promise now
) {
  try {
    const { id } = await context.params; // 👈 IMPORTANT FIX

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // ---------- NORMALIZE ----------
    const name = body.name?.trim();
    const description = body.description || "";

    const price = Number(body.price) || 0;
    const originalPrice = Number(body.originalPrice) || 0;
    const stock = Number(body.stock) || 0;
    const rating = Number(body.rating) || 0;

    const category = body.category || "";
    const isNew = Boolean(body.isNew);
    const bestSeller = Boolean(body.bestSeller);

    const images = JSON.stringify(
      Array.isArray(body.images) ? body.images : []
    );

    const seoTitle = body.seo?.title || "";
    const seoDescription = body.seo?.description || "";
    const seoKeywords = body.seo?.keywords || "";

    // variations normalize
    const variationsArray = body.variations
      ? [
          {
            colors: JSON.stringify(body.variations.colors || []),
            sizes: JSON.stringify(body.variations.sizes || []),
            specs: JSON.stringify(body.variations.specs || {}),
          },
        ]
      : [];

    // ---------- UPDATE ----------
    const updatedProduct = await prisma.product.update({
      where: { id },

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

        // ✅ BRAND FIX
        brand: {
          connectOrCreate: {
            where: { name: body.brand.name.trim() },
            create: {
              name: body.brand.name.trim(),
              logo: body.brand.logo || "",
            },
          },
        },

        // ✅ VARIATIONS (reset + recreate)
        variations: {
          deleteMany: {}, // remove old
          create: variationsArray,
        },
      },

      include: {
        brand: true,
        variations: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    // console.error("PUT /api/products/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to update product",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// ---------------- DELETE PRODUCT ----------------
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 👈 IMPORTANT

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // console.error("DELETE /api/products/[id] error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete product",
        details: error.message,
      },
      { status: 500 }
    );
  }
}