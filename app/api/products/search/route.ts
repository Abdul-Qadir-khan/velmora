import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🔍 === SEARCH API ===');
  
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    
    console.log('🔍 Searching:', q);

    // 🔥 Fetch your REAL products
    const productsUrl = new URL('/api/products', request.url);
    const res = await fetch(productsUrl);
    
    const data = await res.json();
    
    // 🔥 YOUR DATA FORMAT: data.products array
    const allProducts = data.products || [];
    console.log('📦 Found products:', allProducts.length);

    // 🔥 Search by name, category, brand
    const found = allProducts.filter((product: any) =>
      product.name?.toLowerCase().includes(q.toLowerCase()) ||
      product.category?.toLowerCase().includes(q.toLowerCase()) ||
      product.brand?.name?.toLowerCase().includes(q.toLowerCase()) ||
      product.description?.toLowerCase().includes(q.toLowerCase())
    );

    console.log('✅ Matches:', found.length);
    console.log('📋 First:', found[0]?.name);

    return NextResponse.json({
      products: found.slice(0, 6).map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        image: typeof p.images === 'string' ? JSON.parse(p.images)[0] : p.images?.[0] || '/images/placeholder.jpg',
        category: p.category,
        brand: p.brand?.name || 'LycoonWear'
      }))
    });

  } catch (error) {
    console.error('💥 Error:', error);
    return NextResponse.json({ products: [] });
  }
}