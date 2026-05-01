// app/shop/page.tsx - ✅ COMPLETE WORKING VERSION
import ClientProductGrid from "@/app/components/ClientProductGrid";
import ShopFilters from "@/app/components/ShopFilters";
import { getProducts } from "@/app/lib/api/product";
import Image from 'next/image';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    size?: string;
    price?: string;
    sort?: string;
  }>;
}

// ✅ TYPE-SAFE HELPER FUNCTION (MOVED HERE)
function capitalizeWords(str: string): string {
  return str
    .replace(/-/g, ' ')
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// 🔥 FORCE DYNAMIC - Fresh data always
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white/80">
      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white mb-2 drop-shadow-2xl">
            Our Collection
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            Discover premium quality products curated just for you
          </p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Desktop Filters */}
            <div className="lg:col-span-3 hidden lg:block sticky top-24 pt-4">
              <ShopFilters filters={filters} params={params} />
            </div>

            {/* Products */}
            <div className="lg:col-span-9">
              {products.length === 0 ? (
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-12 text-center max-w-4xl mx-auto">
                  <div className="max-w-md mx-auto">
                    <Image 
                      src="/images/product-not-found.jpg" 
                      alt="No products found" 
                      width={100} 
                      height={100}
                      className="mx-auto mb-4 opacity-75"
                      priority={false}
                    />
                    <h2 className="text-3xl font-light text-slate-900 mb-2">No Products Found</h2>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                      Try adjusting your filters or{' '}
                      <a href="/shop" className="font-medium text-slate-900 hover:underline">
                        clear all filters
                      </a>
                    </p>
                    <a 
                      href="/shop" 
                      className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-light rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                    >
                      Browse All Products →
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-4 border-b border-slate-200/50">
                    <div>
                      <h2 className="text-2xl lg:text-3xl xl:text-4xl font-light bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-1.5 tracking-tight">
                        {params.category 
                          ? `${capitalizeWords(params.category)} Collection` 
                          : 'Featured Collection'
                        }
                      </h2>
                      <p className="text-lg lg:text-xl text-slate-600 font-light tracking-wide">
                        {products.length} {products.length === 1 ? 'item' : 'items'} available
                      </p>
                    </div>

                    {/* Active Filters Chips */}
                    {Object.entries(params).filter(([key, value]) => value && key !== 'sort').length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                        {params.category && (
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                            {capitalizeWords(params.category)}
                          </span>
                        )}
                        {params.brand && (
                          <span className="px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200">
                            {params.brand}
                          </span>
                        )}
                        {params.size && (
                          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200">
                            {params.size.toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Products Grid */}
                  <ClientProductGrid initialProducts={products} searchParams={params} />
                </>
              )}
            </div>

            {/* Mobile Filters Button */}
            <div className="lg:hidden col-span-full mb-8">
              <a 
                href="#filters" 
                className="block w-full p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-light rounded-2xl hover:from-slate-800 hover:to-slate-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-center"
              >
                🛠️ Filters ({Object.keys(params).filter(k => k !== 'sort').length})
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}