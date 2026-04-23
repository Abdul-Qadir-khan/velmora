import { NextRequest, NextResponse } from "next/server";

interface Product {
  id: string | number;
  name: string;
  slug?: string;
  price: number;
  images: string[] | string;
}

// ✅ FIXED: Use NextRequest.cookies directly (no await needed)
const getWishlist = (request: NextRequest): Product[] => {
  try {
    const cookieValue = request.cookies.get('wishlist')?.value;
    if (!cookieValue) return [];
    
    const parsed = JSON.parse(cookieValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// ✅ FIXED: Use response.cookies.set (no await needed)
const setWishlistCookie = (response: NextResponse, wishlist: Product[]) => {
  response.cookies.set('wishlist', JSON.stringify(wishlist), {
    httpOnly: false, // Allow client access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};

// GET: Fetch wishlist
export async function GET(request: NextRequest) {
  try {
    const wishlist = getWishlist(request);
    // console.log('❤️ Wishlist GET:', wishlist.length, 'items');
    return NextResponse.json(wishlist);
  } catch (error) {
    // console.error('❌ GET wishlist error:', error);
    return NextResponse.json([], { status: 200 }); // ✅ Graceful fallback
  }
}

// POST: Add to wishlist
export async function POST(request: NextRequest) {
  try {
    const product: Product = await request.json();
    // console.log('❤️ Adding to wishlist:', product.id);
    
    let wishlist = getWishlist(request);
    
    // Remove existing product first (avoid duplicates)
    wishlist = wishlist.filter(p => String(p.id) !== String(product.id));
    // Add to beginning
    wishlist.unshift({ ...product, id: String(product.id) });
    
    // ✅ Create response and set cookie
    const response = NextResponse.json({ success: true, wishlist });
    setWishlistCookie(response, wishlist);
    
    return response;
  } catch (error) {
    // console.error('❌ POST wishlist error:', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

// DELETE: Remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    // console.log('❤️ Removing from wishlist:', id);
    
    let wishlist = getWishlist(request);
    const newWishlist = wishlist.filter(p => String(p.id) !== String(id));
    
    // ✅ Create response and set cookie
    const response = NextResponse.json({ success: true, wishlist: newWishlist });
    setWishlistCookie(response, newWishlist);
    
    return response;
  } catch (error) {
    // console.error('❌ DELETE wishlist error:', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}