'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Category } from "@/app/types/category";

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 BULLETPROOF FALLBACK (no API fail)
  const fallbackCategories = useMemo(() => [
    { id: 1, name: "Men's", slug: 'mens', image: '/images/categories/mens-wear.avif', minPrice: 799 },
    { id: 2, name: "Women's", slug: 'womens', image: '/images/categories/womens-wear.avif', minPrice: 699 },
    { id: 3, name: "Kids", slug: 'kids', image: '/images/categories/kids-wear.avif', minPrice: 499 },
    { id: 4, name: "Accessories", slug: 'accessories', image: '/images/categories/accessories.avif', minPrice: 299 },
  ], []);

  const fetchCategories = useCallback(async () => {
    try {
      // 🔥 1 HOUR CACHE + INSTANT LOAD
      const res = await fetch('/api/categories', {
        next: { revalidate: 3600 }, // Cache 1 hour
        cache: 'force-cache'        // Serve instantly
      });
      
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      
      // 🔥 ENSURE minPrice exists
      const safeData = (data || []).map((cat: Category) => ({
        ...cat,
        minPrice: cat.minPrice || 999
      }));
      
      setCategories(safeData.length ? safeData : fallbackCategories);
      console.log('✅ Cached categories loaded:', safeData.length);
    } catch (error) {
      console.error('❌ Using fallback categories');
      setCategories(fallbackCategories); // 🔥 NEVER BREAKS
    } finally {
      setLoading(false);
    }
  }, [fallbackCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 🔥 SAME LOADING UI (unchanged)
  if (loading) {
    return (
      <section className="py-8 lg:py-10 bg-gray-50 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </section>
    );
  }

  // 🔥 REST OF YOUR UI = 100% SAME
  return (
    <section className="py-8 lg:py-10 bg-gray-50">
      {/* ... YOUR EXACT SAME JSX ... */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header unchanged */}
        <div className="text-center mb-4 lg:mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light uppercase tracking-tight mb-1">
            Shop by <span className="font-black">Category</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-tight">
            Curated collections for every style
          </p>
        </div>

        {/* Desktop - EXACT SAME */}
        <div className="lg:block hidden overflow-x-auto overflow-y-hidden pb-3 -mx-4 px-4 lg:-mx-8 lg:px-0 scrollbar-thin-custom">
          <div className="flex gap-4 pb-1 min-w-max">
            {categories.map((category) => (
              <div key={category.id} className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border hover:border-black flex-shrink-0 w-48 h-56 lg:w-52 lg:h-60">
                <Link href={`/shop?category=${category.slug}`} className="block h-full flex flex-col">
                  <div className="relative flex-[2.5] overflow-hidden">
                    <Image
                      src={category.image || '/images/categories/default.jpg'}
                      alt={category.name}
                      fill
                      sizes="200px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8Altqa2dK2gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                      {category.name}
                    </div>
                  </div>
                  <div className="p-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs uppercase tracking-wider font-medium text-gray-500 leading-tight">Starts at</p>
                      <p className="text-lg font-light tracking-widest text-gray-900">
                        ₹{category.minPrice!.toLocaleString('en-IN')}
                      </p>
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
                    <Image
                      src={category.image || '/images/categories/default.jpg'}
                      alt={category.name}
                      fill
                      sizes="160px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-md">
                      {category.name}
                    </div>
                  </div>
                  <div className="p-1.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider font-medium text-gray-500 leading-tight">Starts at</p>
                      <p className="text-sm font-light tracking-widest text-gray-900">
                        ₹{(category.minPrice || 999).toLocaleString('en-IN')}
                      </p>
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

        {/* Button unchanged */}
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