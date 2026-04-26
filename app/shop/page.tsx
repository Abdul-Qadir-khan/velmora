import ClientProductGrid from "@/app/components/ClientProductGrid";
import ShopFilters from "@/app/components/ShopFilters";
import { getProducts } from "@/app/lib/api/product";
import { Suspense } from "react";
import Image from 'next/image'

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    size?: string;
    price?: string;
    sort?: string;
  }>;
}

// ✅ TYPE-SAFE HELPER FUNCTION
function capitalizeWords(str: string): string {
  return str
    .replace(/-/g, ' ')
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const result = await getProducts({
    category: params.category,
    brand: params.brand,
    size: params.size,
    price: params.price,
    sort: params.sort
  });

  const { products, filters } = result;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white/80 backdrop-blur-sm">
      {/* 🏠 Hero */}
      <section className="pt-24 pb-20 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white mb-2 drop-shadow-2xl">
            Our Collection
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            Discover premium quality products curated just for you
          </p>
        </div>
      </section>

      {/* 🛒 Shop: LEFT FILTERS + RIGHT PRODUCTS */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 -mt-8 lg:mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">

            {/* ✅ LEFT: Filters */}
            <div className="lg:col-span-3 hidden lg:block">
              <Suspense fallback={
                <div className="h-96 bg-linear-to-br from-slate-100/50 to-slate-200/50 rounded-3xl animate-pulse shadow-xl border border-slate-200/50" />
              }>
                <ShopFilters filters={filters} params={params} />
              </Suspense>
            </div>

            {/* ✅ RIGHT: Products */}
            <div className="lg:col-span-9">
              {products.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-12 lg:p-16 text-center max-w-4xl mx-auto">
                  <div className="max-w-md mx-auto">
                    <Image alt="Product Not Found - LycoonWear" title="Product Not Found - LycoonWear" className="mx-auto" width={100} height={100} src="/images/product-not-found.jpg" />
                    <h2 className="text-3xl lg:text-4xl font-light text-slate-900 mb-2 tracking-tight">
                      No Products Found
                    </h2>
                    <p className="text-md text-slate-600 mb-4 leading-relaxed">
                      Try adjusting your filters or{' '}
                      <a href="/shop" className="font-light text-gray-600 hover:text-black underline decoration-2">
                        clear all filters
                      </a>
                    </p>
                    <a 
                      href="/shop" 
                      className="inline-flex px-8 py-3.5 bg-linear-to-r from-slate-900 to-slate-800 text-white font-light rounded-2xl hover:from-slate-800 hover:to-slate-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-sm tracking-wide border border-slate-800/50"
                    >
                      Browse All Products
                    </a>
                  </div>
                </div>
              ) : (
                <div>
                  {/* ✅ PREMIUM HEADER */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 pb-2 border-b border-slate-200/50">
                    <div>
                      <h2 className="text-2xl lg:text-3xl xl:text-4xl font-light bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-1.5 tracking-tight">
                        {params.category
                          ? `${capitalizeWords(params.category)} Collection`
                          : 'Featured Collection'
                        }
                      </h2>
                      <p className="text-lg lg:text-xl text-slate-600 font-light tracking-tight">
                        {products.length} {products.length === 1 ? 'item' : 'items'} available
                      </p>
                    </div>

                    {/* Filter Summary Chips */}
                    <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                      {params.category && (
                        <span className="px-3 py-1.5 bg-linear-to-r from-blue-500/10 to-blue-600/10 text-blue-700 text-xs font-light rounded-full border border-blue-200/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
                          {capitalizeWords(params.category)}
                        </span>
                      )}
                      {params.brand && (
                        <span className="px-3 py-1.5 bg-linear-to-r from-purple-500/10 to-purple-600/10 text-purple-700 text-xs font-light rounded-full border border-purple-200/50 shadow-sm">
                          {params.brand}
                        </span>
                      )}
                      {params.size && (
                        <span className="px-3 py-1.5 bg-linear-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 text-xs font-light rounded-full border border-emerald-200/50 shadow-sm">
                          {params.size.toUpperCase()}
                        </span>
                      )}
                      {params.price && (
                        <span className="px-3 py-1.5 bg-linear-to-r from-amber-500/10 to-amber-600/10 text-amber-700 text-xs font-light rounded-full border border-amber-200/50 shadow-sm">
                          {params.price.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ✅ LUXURY PRODUCTS GRID */}
                  <Suspense fallback={
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-linear-to-br from-slate-100/50 to-slate-200/50 rounded-2xl animate-pulse shadow-lg border border-slate-200/50" />
                      ))}
                    </div>
                  }>
                    <ClientProductGrid initialProducts={products} searchParams={params} />
                  </Suspense>
                </div>
              )}
            </div>

            {/* ✅ Mobile Filters Toggle */}
            <div className="lg:hidden col-span-full mb-6">
              <button className="w-full p-4 bg-linear-to-r from-slate-900 to-slate-800 text-white font-light rounded-2xl hover:from-slate-800 hover:to-slate-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-sm tracking-wide border border-slate-800/50">
                🛠️ Filters ({Object.keys(params).length})
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}