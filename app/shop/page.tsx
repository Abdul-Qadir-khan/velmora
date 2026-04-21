import ClientProductGrid from "../components/ClientProductGrid";
import CategoriesSection from "../components/Categories";
import { getProducts } from "../lib/api/product";
import { Suspense } from "react";

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>; // ✅ Next.js 16 fix
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams; // ✅ Await searchParams
  const products = await getProducts({ category: params.category });

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <section className="pt-24 pb-20 bg-linear-to-r from-slate-800 via-gray-800 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black bg-linear-to-r from-slate-100 via-gray-100 to-slate-300 bg-clip-text text-transparent mb-2">
            Our Collection
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover premium quality products curated just for you
          </p>
        </div>
      </section>

      <CategoriesSection />
      
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-slate-600">Loading products...</p>
            </div>
          }>
            <ClientProductGrid initialProducts={products} searchParams={params} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}