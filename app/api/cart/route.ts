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
    // ✅ FIXED: Now accepts size/color
    const { slug, quantity, selectedSize, selectedColor } = await req.json();

    console.log("🛒 POST add to cart:", { 
      userId, 
      slug, 
      quantity, 
      selectedSize, 
      selectedColor 
    });

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

    // ✅ FIXED: Unique by product + size + color (not just product)
    const existingCartItem = await prisma.cartItem.findFirst({
      where: { 
        userId, 
        productId,
        // ✅ Match exact size/color combination
        ...(selectedSize && { selectedSize }),
        ...(selectedColor && { selectedColor }),
      }
    });

    let cartItem;

    if (existingCartItem) {
      // ✅ UPDATE quantity for same product/size/color
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { 
          quantity: existingCartItem.quantity + quantity 
        },
      });
      console.log("✅ Updated existing cart item:", existingCartItem.id);
    } else {
      // ✅ CREATE new with selected size/color
      cartItem = await prisma.cartItem.create({
        data: { 
          userId, 
          productId, 
          quantity,
          // ✅ SAVE SELECTED VALUES
          selectedSize: selectedSize || "M",
          selectedColor: selectedColor || "#000000",
        }
      });
      console.log("✅ Created new cart item:", cartItem.id);
    }

    // ✅ Return full valid cart
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

    console.log("✅ Cart updated:", validCart.length, "items");
    return NextResponse.json({ cart: validCart });
  } catch (err) {
    console.error("❌ POST /api/cart error:", err);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserId(req);
    console.log("🗑️ DELETE cart for user:", userId);
    
    // ✅ FIXED: Safely handle body - may be empty!
    let body;
    let productId, selectedSize, selectedColor;
    
    try {
      body = await req.json();
      ({ productId, selectedSize, selectedColor } = body);
    } catch (jsonError) {
      // ✅ NO BODY? That's fine for full cart clear
      console.log("ℹ️ DELETE request has no JSON body - clearing entire cart");
      productId = null;
    }

    if (productId) {
      // Remove specific item (product + size + color)
      const deleted = await prisma.cartItem.deleteMany({
        where: { 
          userId, 
          productId: String(productId),
          ...(selectedSize && { selectedSize }),
          ...(selectedColor && { selectedColor })
        }
      });
      console.log("✅ Removed", deleted.count, "precise item:", { productId, selectedSize, selectedColor });
    } else {
      // ✅ Clear ENTIRE cart (no productId = clear all)
      const deleted = await prisma.cartItem.deleteMany({ where: { userId } });
      console.log("✅ Cleared entire cart:", deleted.count, "items");
    }

    // Return remaining cart
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