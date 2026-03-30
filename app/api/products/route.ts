import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { brand: true, variations: true },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ensure variations is an array
    const variationsArray = Array.isArray(body.variations)
      ? body.variations
      : [body.variations];

    const product = await prisma.product.create({
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
          create: {
            name: body.brand.name,
            logo: body.brand.logo,
          },
        },
        variations: {
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
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}