import { NextResponse } from "next/server";
import { readProducts, writeProducts } from "@/lib/file-db";

// GET all products
export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}

// POST (create new product)
export async function POST(req: Request) {
  const body = await req.json();
  const products = readProducts();

  const newProduct = {
    ...body,
    id: Date.now() // simple unique ID
  };

  products.push(newProduct);
  writeProducts(products);

  return NextResponse.json(newProduct);
}