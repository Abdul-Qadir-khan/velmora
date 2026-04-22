import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_ID = "1";

export async function GET() {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: USER_ID },
      include: { 
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            slug: true,
            images: true,
          }
        }
      },
    });
    console.log("🛒 Cart GET:", cart.length, "items");
    return NextResponse.json({ cart });
  } catch (err) {
    console.error("GET /api/cart error:", err);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slug, quantity } = await req.json();

    if (!slug || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const product = await prisma.product.findFirst({ where: { slug } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // ✅ Schema: productId is String ✅
    const productId = product.id; // Already String from schema

    let cartItem = await prisma.cartItem.findFirst({
      where: { 
        userId: USER_ID, 
        productId: productId  // ✅ String ✅
      },
    });

    if (cartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { 
          userId: USER_ID, 
          productId: productId,  // ✅ String ✅
          quantity 
        },
      });
    }

    const cart = await prisma.cartItem.findMany({
      where: { userId: USER_ID },
      include: { product: true },
    });

    return NextResponse.json({ cart });
  } catch (err) {
    console.error("POST /api/cart error:", err);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    console.log("🗑️ DELETE /api/cart called");
    
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      console.log("ℹ️ Empty body - clearing all cart");
    }
    
    const { productId } = body;

    if (productId) {
      // ✅ Schema: productId is String ✅
      await prisma.cartItem.deleteMany({
        where: { 
          userId: USER_ID, 
          productId: String(productId)  // ✅ Ensure String
        },
      });
      console.log("✅ Removed product:", productId);
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({ where: { userId: USER_ID } });
      console.log("✅ Cleared entire cart");
    }

    const cart = await prisma.cartItem.findMany({
      where: { userId: USER_ID },
      include: { product: true },
    });

    return NextResponse.json({ cart });
  } catch (err) {
    console.error("DELETE /api/cart error:", err);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}