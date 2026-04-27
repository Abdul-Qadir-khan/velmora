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

const updateProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive").optional(),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative").optional(),
  rating: z.coerce.number().min(0).max(5, "Rating must be 0-5").optional(),
  category: z.enum([
    "mens", "womens", "kids", "t-shirts", "shirts", 
    "jeans", "jackets", "hoodies", "accessories"
  ]).optional(),
  isNew: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  brand: z.object({
    name: z.string().min(1, "Brand name required").optional(),
    logo: z.string().optional()
  }).optional(),
  variations: z.object({
    colors: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
    specs: z.object({
      material: z.string().optional(),
      fit: z.string().optional(),
      sleeve: z.string().optional(),
      pattern: z.string().optional(),
      washing: z.string().optional()
    }).optional()
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional()
  }).optional()
}).passthrough();

async function getDynamicFilters(appliedFilters: Record<string, any> = {}) {
  try {
    const allProducts = await prisma.product.findMany({
      where: { 
        stock: { gt: 0 }, 
        ...appliedFilters 
      },
      select: { 
        category: true 
      }
    });

    const categoryCounts = allProducts.reduce((acc: Record<string, number>, product: any) => {
      const cat = product.category || 'uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const brandProducts = await prisma.product.findMany({
      where: { 
        stock: { gt: 0 }, 
        ...appliedFilters 
      },
      select: { 
        brand: {
          select: {
            name: true
          }
        }
      }
    });

    const brandCounts = brandProducts.reduce((acc: Record<string, number>, product: any) => {
      const brandName = product.brand?.name || 'Unknown';
      acc[brandName] = (acc[brandName] || 0) + 1;
      return acc;
    }, {});

    const sizeProducts = await prisma.product.findMany({
      where: { 
        stock: { gt: 0 }, 
        ...appliedFilters 
      },
      include: { 
        variations: true 
      }
    });

    const sizeCounts = new Map<string, number>();
    sizeProducts.forEach(product => {
      product.variations.forEach((variation: any) => {
        try {
          const sizes = JSON.parse(variation.sizes || '[]') as string[];
          sizes.forEach((size: string) => {
            sizeCounts.set(size, (sizeCounts.get(size) || 0) + 1);
          });
        } catch {
          // Skip invalid JSON
        }
      });
    });

    return {
      categories: Object.entries(categoryCounts)
        .map(([value, count]) => ({
          value,
          label: capitalizeWords(value),
          count
        }))
        .sort((a, b) => b.count - a.count),
      
      brands: Object.entries(brandCounts)
        .map(([value, count]) => ({
          value,
          label: capitalizeWords(value),
          count
        }))
        .sort((a, b) => b.count - a.count),
      
      sizes: Array.from(sizeCounts.entries())
        .map(([value, count]) => ({
          value: value.toLowerCase(),
          label: value.toUpperCase(),
          count
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      
      priceRanges: [
        { value: 'under-500', label: 'Under ₹500' },
        { value: '500-1000', label: '₹500 - ₹1,000' },
        { value: '1000-2000', label: '₹1,000 - ₹2,000' },
        { value: '2000+', label: '₹2,000+' }
      ]
    };
  } catch (error) {
    console.error('🔥 Filter generation error:', error);
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
    
    // 🔥 FIXED: Single product fetch for admin edit
    const id = searchParams.get("id");
    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: { brand: true, variations: true }
      });
      
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ 
        product: {
          id: product.id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          stock: product.stock,
          rating: product.rating,
          category: product.category,
          isNew: product.isNew,
          bestSeller: product.bestSeller,
          images: product.images ? JSON.parse(product.images) : [], // ✅ PARSED IMAGES
          brand: product.brand,
          variations: product.variations,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          seoKeywords: product.seoKeywords
        }
      });
    }
    
    // Your existing list logic
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

    return NextResponse.json({ 
      products, 
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      filters: filterOptions
    });
  } catch (err: unknown) {
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
        images: validated.images ? JSON.stringify(validated.images) : "[]",
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
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = updateProductSchema.parse(body);
    
    const productId = validated.id;
    if (!productId) {
      return NextResponse.json({ error: "Product ID (id) is required" }, { status: 400 });
    }

    const updateData: any = {};

    if (validated.name !== undefined) {
      updateData.name = validated.name;
      updateData.slug = generateSlug(validated.name);
    }
    
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.price !== undefined) updateData.price = validated.price;
    if (validated.originalPrice !== undefined) updateData.originalPrice = validated.originalPrice;
    if (validated.stock !== undefined) updateData.stock = validated.stock;
    if (validated.rating !== undefined) updateData.rating = validated.rating;
    if (validated.category !== undefined) updateData.category = validated.category;
    if (validated.isNew !== undefined) updateData.isNew = validated.isNew;
    if (validated.bestSeller !== undefined) updateData.bestSeller = validated.bestSeller;
    
    // 🔥 PERFECT IMAGE HANDLING
    if (validated.images !== undefined) {
      updateData.images = Array.isArray(validated.images) && validated.images.length > 0
        ? JSON.stringify(validated.images)
        : "[]";
    }

    if (validated.seo) {
      updateData.seoTitle = validated.seo.title || "";
      updateData.seoDescription = validated.seo.description || "";
      updateData.seoKeywords = validated.seo.keywords || "";
    }

    if (validated.brand) {
      updateData.brand = {
        upsert: {
          where: { name: validated.brand.name },
          update: { 
            name: validated.brand.name,
            logo: validated.brand.logo || null
          },
          create: { 
            name: validated.brand.name, 
            logo: validated.brand.logo || null 
          }
        }
      };
    }

    if (validated.variations) {
      // Update first variation
      const firstVariation = await prisma.variation.findFirst({
        where: { productId }
      });
      
      if (firstVariation) {
        await prisma.variation.update({
          where: { id: firstVariation.id },
          data: {
            colors: validated.variations.colors ? JSON.stringify(validated.variations.colors) : "[]",
            sizes: validated.variations.sizes ? JSON.stringify(validated.variations.sizes) : "[]",
            specs: validated.variations.specs ? JSON.stringify(validated.variations.specs) : "{}",
          }
        });
      }
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: { brand: true, variations: true },
    });

    return NextResponse.json({ 
      product: {
        ...product,
        images: product.images ? JSON.parse(product.images) : [] // ✅ PARSED
      }
    }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: error.issues 
      }, { status: 400 });
    }
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// 🔥 BONUS: DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}