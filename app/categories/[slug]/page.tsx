// app/categories/[slug]/page.tsx
import ClientProductGrid from "@/app/components/ClientProductGrid";
import ShopFilters from "@/app/components/ShopFilters";
import { getProducts } from "@/app/lib/api/product";
import { Suspense } from "react";
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    category?: string;
    brand?: string;
    size?: string;
    price?: string;
    sort?: string;
  }>;
}

function capitalizeWords(str: string): string {
  return str
    .replace(/-/g, ' ')
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: CategoryPageProps) {
  const { slug } = await params;
  const queryParams = await searchParams;

  console.log('🔍 Category slug:', slug); // Debug log

  const result = await getProducts({
    category: slug,
    brand: queryParams.brand,
    size: queryParams.size,
    price: queryParams.price,
    sort: queryParams.sort
  });

  const { products, filters } = result;
  const categoryName = capitalizeWords(slug);

  console.log('📦 Products found:', products.length); // Debug log

  if (products.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white/80">
      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <nav className="flex items-center justify-center mb-4 text-sm text-slate-300">
            <a href="/shop" className="hover:text-white transition-colors">Shop</a>
            <span className="mx-2">/</span>
            <span className="font-medium text-white">{categoryName}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white mb-4 drop-shadow-2xl">
            {categoryName}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
            Discover our premium {categoryName.toLowerCase()} collection • {products.length} items
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Filters */}
            <div className="lg:col-span-1 hidden lg:block">
              <Suspense fallback={<div className="h-96 bg-slate-100 rounded-2xl animate-pulse" />}>
                <ShopFilters filters={filters} params={{ ...queryParams, category: slug }} />
              </Suspense>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-light text-slate-900 mb-2">
                  {categoryName}
                </h2>
                <p className="text-xl text-slate-600">{products.length} items</p>
              </div>

              <Suspense fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-slate-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              }>
                <ClientProductGrid 
                  initialProducts={products} 
                  searchParams={{ ...queryParams, category: slug }}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}