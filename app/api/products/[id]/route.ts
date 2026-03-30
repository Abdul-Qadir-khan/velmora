import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { brand: true, variations: true },
    });
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const body = await req.json();

    const variationsArray = Array.isArray(body.variations)
      ? body.variations
      : [body.variations];

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice,
        stock: body.stock,
        rating: body.rating,
        category: body.category,
        isNew: body.isNew,
        bestSeller: body.bestSeller,
        images: body.images,
        brand: {
          upsert: {
            update: { name: body.brand.name, logo: body.brand.logo },
            create: { name: body.brand.name, logo: body.brand.logo },
          },
        },
        variations: {
          deleteMany: {}, // remove old variations
          create: variationsArray.map((v: any) => ({
            colors: v.colors,
            sizes: v.sizes,
            specs: v.specs,
          })),
        },
      },
      include: { brand: true, variations: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}