import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ---------------- UPDATE PRODUCT ----------------
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    console.log("🔄 PUT received:", { id, name: body.name, slug: body.slug }); // 🔥 DEBUG

    // ---------- SLUG GENERATION FUNCTION ----------
    function generateSlug(name: string): string {
      return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // ---------- NORMALIZE + SLUG LOGIC ----------
    const name = body.name?.trim();
    let slug = body.slug?.trim() || generateSlug(name || "");

    // 🔥 FIXED: Check if slug needs updating (name changed)
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { name: true, slug: true }
    });

    if (name && existingProduct && existingProduct.name !== name) {
      // Name changed - generate new slug
      let newSlug = generateSlug(name);
      
      // Check for conflicts
      let counter = 1;
      while (await prisma.product.findUnique({ where: { slug: newSlug } })) {
        newSlug = `${generateSlug(name)}-${counter++}`;
      }
      
      slug = newSlug;
      console.log("🔄 Slug updated:", { old: existingProduct.slug, new: slug }); // 🔥 DEBUG
    }

    const description = body.description || "";
    const price = Number(body.price) || 0;
    const originalPrice = Number(body.originalPrice) || 0;
    const stock = Number(body.stock) || 0;
    const rating = Number(body.rating) || 0;
    const category = body.category || "";
    const isNew = Boolean(body.isNew);
    const bestSeller = Boolean(body.bestSeller);

    const images = JSON.stringify(
      Array.isArray(body.images) ? body.images.filter(Boolean) : []
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

    console.log("💾 Saving with slug:", slug); // 🔥 DEBUG

    // ---------- UPDATE ----------
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug, // 🔥 NOW UPDATES PROPERLY
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

        // ✅ BRAND
        brand: {
          connectOrCreate: {
            where: { name: body.brand?.name?.trim() || "Unknown" },
            create: {
              name: body.brand?.name?.trim() || "Unknown",
              logo: body.brand?.logo || "",
            },
          },
        },

        // ✅ VARIATIONS (reset + recreate)
        variations: {
          deleteMany: {},
          create: variationsArray,
        },
      },
      include: {
        brand: true,
        variations: true,
      },
    });

    console.log("✅ Product updated:", { id, slug: updatedProduct.slug }); // 🔥 DEBUG

    return NextResponse.json({
      ...updatedProduct,
      images: updatedProduct.images ? JSON.parse(updatedProduct.images) : [],
      variations: updatedProduct.variations.map((v: any) => ({
        ...v,
        colors: v.colors ? JSON.parse(v.colors) : [],
        sizes: v.sizes ? JSON.parse(v.sizes) : [],
        specs: v.specs ? JSON.parse(v.specs) : {},
      })),
    });
  } catch (error: any) {
    console.error("❌ PUT error:", error);
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