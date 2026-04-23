// app/api/products/slug/[slug]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Use a generic context type that supports Promise
interface Context {
  params: { slug: string } | Promise<{ slug: string }>;
}

export async function GET(req: Request, context: Context) {
  try {
    // unwrap the promise if needed
    const params = context.params instanceof Promise ? await context.params : context.params;
    const slug = decodeURIComponent(params.slug); // decode special characters

    const product = await prisma.product.findFirst({
      where: { slug },
      include: {
        brand: true,
        variations: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    // console.error("GET /api/products/slug error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}