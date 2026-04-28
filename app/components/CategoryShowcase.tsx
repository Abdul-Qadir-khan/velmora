// app/components/CategoryShowcase.tsx (lowercase 's')
import Link from "next/link";
import Image from "next/image";
import { getAllCategories } from "@/app/lib/api/categories";
import { Category } from "@/app/types/category";

// Server Component - NO 'use client' directive
export default async function CategoryShowcase() {
  let categories: Category[] = [];

  try {
    categories = await getAllCategories();
    console.log('✅ Fetched', categories.length, 'categories from DB');
  } catch (error) {
    console.error('❌ CategoryShowcase DB error:', error);
    // Identical fallback to match your API
    categories = [
      { id: 1, name: "Men's Wear", slug: 'mens', image: '/images/categories/mens-wear.avif', minPrice: 799 },
      { id: 2, name: "Women's Wear", slug: 'womens', image: '/images/categories/womens-wear.jpg', minPrice: 1299 },
      { id: 3, name: 'T-Shirts', slug: 't-shirts', image: '/images/categories/tshirts.jpg', minPrice: 499 },
      { id: 4, name: 'Hoodies', slug: 'hoodies', image: '/images/categories/hoodies.jpg', minPrice: 1999 },
      { id: 5, name: 'Denim', slug: 'denim', image: '/images/categories/jeans.jpg', minPrice: 1499 },
      { id: 6, name: 'Accessories', slug: 'accessories', image: '/images/categories/wallet.jpg', minPrice: 1299 },
    ];
  }

  return (
    <section className="py-8 lg:py-10 bg-gray-50">
      {/* Rest of your JSX stays EXACTLY the same */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 lg:mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light uppercase tracking-tight mb-1">
            Shop by <span className="font-black">Category</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-tight">
            Curated collections for every style
          </p>
        </div>

        {/* Desktop */}
        <div className="lg:block hidden overflow-x-auto overflow-y-hidden pb-3 -mx-4 px-4 lg:-mx-8 lg:px-8 scrollbar-thin-custom">
          <div className="flex gap-4 pb-1 min-w-max">
            {categories.map((category) => (
              <div key={category.id} className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border hover:border-black flex-shrink-0 w-48 h-56 lg:w-52 lg:h-60">
                <Link href={`/shop?category=${category.slug}`} className="block h-full flex flex-col">
                  <div className="relative flex-[2.5] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="200px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/images/categories/default.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                      {category.name}
                    </div>
                  </div>
                  <div className="p-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs uppercase tracking-wider font-medium text-gray-500 leading-tight">Starts at</p>
                      <p className="text-lg font-light tracking-widest text-gray-900">₹{category.minPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <span className="text-xs uppercase font-bold text-gray-600 group-hover:text-black transition-colors">Shop</span>
                      <span className="text-sm font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden overflow-x-auto overflow-y-hidden pb-3 -mx-4 px-4 scrollbar-thin-custom">
          <div className="flex gap-3 pb-1">
            {categories.map((category) => (
              <div key={category.id} className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl min-w-[160px] h-44 flex-shrink-0 border hover:border-black">
                <Link href={`/shop?category=${category.slug}`} className="block h-full flex flex-col">
                  <div className="relative flex-[2.2] overflow-hidden">
                    <Image src={category.image} alt={category.name} fill sizes="160px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-md">
                      {category.name}
                    </div>
                  </div>
                  <div className="p-1.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider font-medium text-gray-500 leading-tight">Starts at</p>
                      <p className="text-sm font-light tracking-widest text-gray-900">₹{category.minPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center justify-between pt-0.5 border-t border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-gray-600 group-hover:text-black transition-colors">Shop</span>
                      <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/shop">
            <button className="px-6 py-2.5 border-2 border-black text-sm uppercase tracking-wider font-medium hover:bg-black hover:text-white transition-all rounded-full shadow-sm hover:shadow-md">
              All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}