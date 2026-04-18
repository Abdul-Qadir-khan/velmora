import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")  // ✅ Better regex
    .replace(/[\s_-]+/g, "-")  // ✅ Handle multiple spaces/hyphens
    .replace(/^-+|-+$/g, "");  // ✅ Remove leading/trailing hyphens
}

// ✅ Zod Validation Schema (SQLite compatible)
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search") || "";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;

    // ✅ FIXED: Proper whereClause construction
    const whereClause: any = {
      ...(category && category !== "all" && { category }),
    };

    // ✅ FIXED: OR clause only when search exists (always array)
    if (search) {
  whereClause.OR = [
    { name: { contains: search, mode: "insensitive" } },
    { description: { contains: search, mode: "insensitive" } },
    {
      brand: {
        is: {
          name: { contains: search, mode: "insensitive" }
        }
      }
    }
  ];
}

    console.log(`🔍 API Filter: category="${category || 'all'}", search="${search}"`);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          brand: true,
          variations: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.product.count({ where: whereClause })
    ]);

    console.log(`✅ Found ${products.length}/${total} products (page ${page})`);

    return NextResponse.json({ 
      products, 
      pagination: { 
        total, 
        page, 
        limit, 
        pages: Math.ceil(total / limit) 
      }
    });
  } catch (err: any) {
  console.error("❌ REAL ERROR:", err);

  return NextResponse.json(
    { 
      error: err.message || "Unknown error",
      stack: err.stack || null
    },
    { status: 500 }
  );
}
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // ✅ Full validation
    const validated = createProductSchema.parse(body);
    
    // ✅ Unique slug check + timestamp
    const baseSlug = generateSlug(validated.name);
    let slug = baseSlug;
    let counter = 1;
    
    // Check for existing slug
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    console.log(`➕ Creating product: "${validated.name}" (slug: ${slug})`);

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
        // ✅ FIXED: Convert JSON arrays/objects to strings for SQLite
        images: validated.images ? JSON.stringify(validated.images) : "",
        seoTitle: validated.seo?.title || "",
        seoDescription: validated.seo?.description || "",
        seoKeywords: validated.seo?.keywords || "",
        brand: {
          connectOrCreate: {
            where: { name: validated.brand.name },
            create: { 
              name: validated.brand.name, 
              logo: validated.brand.logo || null 
            },
          },
        },
        variations: {
          create: [{
            // ✅ FIXED: Convert JSON to strings for SQLite
            colors: validated.variations.colors ? JSON.stringify(validated.variations.colors) : "[]",
            sizes: validated.variations.sizes ? JSON.stringify(validated.variations.sizes) : "[]",
            specs: validated.variations.specs ? JSON.stringify(validated.variations.specs) : "{}",
          }],
        },
      },
      include: { 
        brand: true, 
        variations: true 
      },
    });

    console.log(`✅ Product created: ${product.id}`);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
  if (error instanceof z.ZodError) {
    // ✅ FIXED: Proper ZodError typing
    console.error("❌ Validation error:", error.issues);
    return NextResponse.json(
      { 
        error: "Validation failed", 
        details: error.issues 
      }, 
      { status: 400 }
    );
  }
  
  console.error("❌ POST /api/products error:", error);
  return NextResponse.json(
    { error: "Failed to create product" }, 
    { status: 500 }
  );
}
}