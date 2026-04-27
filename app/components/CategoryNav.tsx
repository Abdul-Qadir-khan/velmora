// app/components/CategoryNav.tsx (Server Component)
import Link from "next/link";
import { getAllCategories } from "@/app/lib/api/categories";

export default async function CategoryNav() {
  const categories = await getAllCategories();

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto pb-2 pt-4 -mx-2">
          <Link href="/shop" className="whitespace-nowrap px-6 py-3 text-sm font-medium rounded-full transition-all mr-2 flex-shrink-0 text-slate-700 hover:text-slate-900 hover:bg-slate-100">
            All Products
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="whitespace-nowrap px-6 py-3 text-sm font-medium rounded-full transition-all mr-2 flex-shrink-0 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}