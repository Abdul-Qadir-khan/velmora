// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// TEMP: replace with real user/session in production
const USER_ID = "1";

/**
 * GET /api/cart
 * Fetch all cart items for the user
 */
export async function GET() {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: USER_ID },
      include: { product: true },
    });
    return NextResponse.json({ cart });
  } catch (err) {
    console.error("GET /api/cart error:", err);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

/**
 * POST /api/cart
 * Add a product to cart or increase quantity if exists
 * Body: { slug: string, quantity: number }
 */
export async function POST(req: Request) {
  try {
    const { slug, quantity } = await req.json();

    if (!slug || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 });
    }

    const product = await prisma.product.findFirst({ where: { slug } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    let cartItem = await prisma.cartItem.findFirst({
      where: { userId: USER_ID, productId: product.id },
    });

    if (cartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId: USER_ID, productId: product.id, quantity },
      });
    }

    const cart = await prisma.cartItem.findMany({
      where: { userId: USER_ID },
      include: { product: true },
    });

    return NextResponse.json({ cart });
  } catch (err) {
    console.error("POST /api/cart error:", err);
    return NextResponse.json({ error: "Failed to add product to cart" }, { status: 500 });
  }
}

/**
 * DELETE /api/cart
 * Remove a product from the cart
 * Body: { productId: string }
 */
export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await prisma.cartItem.deleteMany({
      where: { userId: USER_ID, productId },
    });

    const cart = await prisma.cartItem.findMany({
      where: { userId: USER_ID },
      include: { product: true },
    });

    return NextResponse.json({ cart });
  } catch (err) {
    console.error("DELETE /api/cart error:", err);
    return NextResponse.json({ error: "Failed to remove product from cart" }, { status: 500 });
  }
}