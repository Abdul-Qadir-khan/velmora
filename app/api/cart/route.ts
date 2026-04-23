import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_USER_ID = "guest_1";

function getUserId(req?: NextRequest): string {
  return DEFAULT_USER_ID; // TODO: Replace with real auth
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    console.log("🛒 GET cart for user:", userId);

    const cart = await prisma.cartItem.findMany({
      where: { userId },
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

    // ✅ Filter out null products AFTER query (TypeScript safe)
    const validCart = cart.filter(item => item.product !== null);

    console.log("✅ Cart GET:", validCart.length, "valid items");
    return NextResponse.json({ cart: validCart });
  } catch (err) {
    console.error("❌ GET /api/cart error:", err);
    return NextResponse.json({ cart: [] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    const { slug, quantity } = await req.json();

    console.log("🛒 POST add to cart:", { userId, slug, quantity });

    if (!slug || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const product = await prisma.product.findFirst({ 
      where: { slug },
      select: { id: true }
    });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const productId = product.id;

    let cartItem = await prisma.cartItem.findFirst({
      where: { userId, productId }
    });

    if (cartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId, productId, quantity }
      });
    }

    // ✅ Fetch full cart and filter null products
    const cart = await prisma.cartItem.findMany({
      where: { userId },
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

    const validCart = cart.filter(item => item.product !== null);

    console.log("✅ Added to cart:", cartItem.id);
    return NextResponse.json({ cart: validCart });
  } catch (err) {
    console.error("❌ POST /api/cart error:", err);
    return NextResponse.json({ cart: [] }, { status: 200 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserId(req);
    console.log("🗑️ DELETE cart for user:", userId);
    
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      console.log("ℹ️ Empty body - clearing all cart");
    }
    
    const { productId } = body;

    if (productId) {
      const deleted = await prisma.cartItem.deleteMany({
        where: { userId, productId: String(productId) }
      });
      console.log("✅ Removed", deleted.count, "product(s):", productId);
    } else {
      const deleted = await prisma.cartItem.deleteMany({ where: { userId } });
      console.log("✅ Cleared", deleted.count, "cart items");
    }

    // ✅ Fetch remaining cart and filter null products
    const cart = await prisma.cartItem.findMany({
      where: { userId },
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

    const validCart = cart.filter(item => item.product !== null);

    return NextResponse.json({ cart: validCart });
  } catch (err) {
    console.error("❌ DELETE /api/cart error:", err);
    return NextResponse.json({ cart: [] }, { status: 200 });
  }
}