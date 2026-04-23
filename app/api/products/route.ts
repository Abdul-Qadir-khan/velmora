import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ✅ TYPE-SAFE HELPER FUNCTION
function capitalizeWords(str: string): string {
  return str
    .replace(/-/g, ' ')
    .split(' ')
    .map((word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  rating: z.coerce.number().min(0).max(5, "Rating must be 0-5"),
  category: z.enum([
    "mens", "womens", "kids", "t-shirts", "shirts", 
    "jeans", "jackets", "hoodies", "accessories"
  ]),
  isNew: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  images: z.array(z.string()).optional().default([]),
  brand: z.object({
    name: z.string().min(1, "Brand name required"),
    logo: z.string().optional()
  }),
  variations: z.object({
    colors: z.array(z.string()).optional().default([]),
    sizes: z.array(z.string()).optional().default([]),
    specs: z.object({
      material: z.string().optional(),
      fit: z.string().optional(),
      sleeve: z.string().optional(),
      pattern: z.string().optional(),
      washing: z.string().optional()
    }).optional().default({})
  }),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional()
  }).optional()
});

// 🔥 PERFECTLY TYPE-SAFE FILTERS FUNCTION
async function getDynamicFilters(appliedFilters: Record<string, any> = {}) {
  try {
    // 1. CATEGORIES
    const categories = await prisma.product.groupBy({
      by: ['category'],
      where: { stock: { gt: 0 }, ...appliedFilters },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    });

    // 2. BRANDS - Separate queries for type safety
    const brandsRaw = await prisma.product.groupBy({
      by: ['brandId'],
      where: { stock: { gt: 0 }, ...appliedFilters },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    });

    const brandIds = brandsRaw
      .map((b: any) => b.brandId)
      .filter((id: string | null) => id !== null) as string[];

    const brands = brandIds.length > 0 
      ? await prisma.brand.findMany({
          where: { id: { in: brandIds } },
          select: { id: true, name: true }
        })
      : [];

    // 3. SIZES
    const sizesData = await prisma.variation.findMany({
      where: { 
        product: { 
          stock: { gt: 0 }, 
          ...appliedFilters 
        } 
      },
      select: { sizes: true },
      distinct: ['productId']
    });

    const sizesSet = new Set<string>();
    sizesData.forEach((v: any) => {
      try {
        const parsedSizes = JSON.parse(v.sizes || '[]') as string[];
        parsedSizes.forEach((size: string) => sizesSet.add(size));
      } catch {
        // Ignore parse errors
      }
    });
    const sizes = Array.from(sizesSet).sort();

    return {
      categories: categories.map((c: any) => ({
        value: c.category,
        label: capitalizeWords(c.category), // ✅ TYPE SAFE!
        count: c._count.id
      })),
      brands: brands.map((b: any) => {
        const count = brandsRaw.find((raw: any) => raw.brandId === b.id)?._count.id || 0;
        return {
          value: b.name,
          label: b.name.toUpperCase(),
          count
        };
      }),
      sizes: sizes.map((s: string) => ({
        value: s.toLowerCase(),
        label: s,
        count: 0
      })),
      priceRanges: [
        { value: 'under-500', label: 'Under ₹500', count: 0 },
        { value: '500-1000', label: '₹500 - ₹1,000', count: 0 },
        { value: '1000-2000', label: '₹1,000 - ₹2,000', count: 0 },
        { value: '2000+', label: '₹2,000+', count: 0 }
      ]
    };
  } catch (error) {
    console.error('Filter generation error:', error);
    return {
      categories: [],
      brands: [],
      sizes: [],
      priceRanges: []
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const size = searchParams.get("size");
    const price = searchParams.get("price");
    const sort = searchParams.get("sort") || "featured";
    const search = searchParams.get("search") || "";
    const limit = Number(searchParams.get("limit")) || 20;
    const page = Number(searchParams.get("page")) || 1;

    const whereClause: Record<string, any> = {};

    if (category && category !== "all") {
      whereClause.category = category;
    }
    if (brand && brand !== "all") {
      whereClause.brand = { name: brand };
    }
    if (size) {
      whereClause.variations = {
        some: {
          sizes: { array_contains: [size.toUpperCase()] }
        }
      };
    }
    if (price) {
      const priceNum: Record<string, number> = { gte: 0 };
      switch (price) {
        case 'under-500': 
          priceNum.lte = 499; 
          break;
        case '500-1000': 
          priceNum.gte = 500; 
          priceNum.lte = 1000; 
          break;
        case '1000-2000': 
          priceNum.gte = 1000; 
          priceNum.lte = 2000; 
          break;
        case '2000+': 
          priceNum.gte = 2000; 
          break;
      }
      whereClause.price = priceNum;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { name: { contains: search, mode: "insensitive" } } }
      ];
    }

    const orderBy: Record<string, 'asc' | 'desc'> = {};
    switch (sort) {
      case 'price-low': 
        orderBy.price = 'asc'; 
        break;
      case 'price-high': 
        orderBy.price = 'desc'; 
        break;
      case 'newest': 
        orderBy.createdAt = 'desc'; 
        break;
      case 'rating': 
        orderBy.rating = 'desc'; 
        break;
      default: 
        orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: { brand: true, variations: true },
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.product.count({ where: whereClause })
    ]);

    const filterOptions = await getDynamicFilters(whereClause);

    // console.log(`✅ Found ${products.length}/${total} products`);

    return NextResponse.json({ 
      products, 
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      filters: filterOptions
    });
  } catch (err: unknown) {
    // console.error("❌ API ERROR:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createProductSchema.parse(body);
    
    const baseSlug = generateSlug(validated.name);
    let slug = baseSlug;
    let counter = 1;
    
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description || "",
        price: validated.price,
        originalPrice: validated.originalPrice || 0,
        stock: validated.stock || 0,
        rating: validated.rating || 0,
        category: validated.category,
        isNew: validated.isNew ?? false,
        bestSeller: validated.bestSeller ?? false,
        images: validated.images ? JSON.stringify(validated.images) : "",
        seoTitle: validated.seo?.title || "",
        seoDescription: validated.seo?.description || "",
        seoKeywords: validated.seo?.keywords || "",
        brand: {
          connectOrCreate: {
            where: { name: validated.brand.name },
            create: { name: validated.brand.name, logo: validated.brand.logo || null },
          },
        },
        variations: {
          create: [{
            colors: validated.variations.colors ? JSON.stringify(validated.variations.colors) : "[]",
            sizes: validated.variations.sizes ? JSON.stringify(validated.variations.sizes) : "[]",
            specs: validated.variations.specs ? JSON.stringify(validated.variations.specs) : "{}",
          }],
        },
      },
      include: { brand: true, variations: true },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: error.issues 
      }, { status: 400 });
    }
    // console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}