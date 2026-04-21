import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface Product {
  id: string | number;
  name: string;
  slug?: string;
  price: number;
  images: string[] | string;
}

// ✅ FIXED: Better cookie reading
const getWishlist = (cookieStore: any): Product[] => {
  try {
    const cookieValue = cookieStore.get('wishlist')?.value;
    if (!cookieValue) return [];
    
    const parsed = JSON.parse(cookieValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const setWishlist = (cookies: any, wishlist: Product[]) => {
  cookies().set('wishlist', JSON.stringify(wishlist), {
    httpOnly: false, // Allow client access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};

// GET: Fetch wishlist
export async function GET() {
  try {
    const cookieStore = cookies();
    const wishlist = getWishlist(cookieStore);
    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('GET wishlist error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: Add to wishlist
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const product: Product = await request.json();
    
    let wishlist = getWishlist(cookieStore);
    
    // Remove existing product first (in case of duplicates)
    wishlist = wishlist.filter(p => String(p.id) !== String(product.id));
    // Add to beginning
    wishlist.unshift({ ...product, id: String(product.id) });
    
    setWishlist(cookieStore, wishlist);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST wishlist error:', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

// DELETE: Remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const { id } = await request.json();
    
    let wishlist = getWishlist(cookieStore);
    const newWishlist = wishlist.filter(p => String(p.id) !== String(id));
    
    setWishlist(cookieStore, newWishlist);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE wishlist error:', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}