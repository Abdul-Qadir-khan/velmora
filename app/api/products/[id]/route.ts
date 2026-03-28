import { NextResponse } from "next/server";
import { readProducts, writeProducts } from "@/lib/file-db";

// PUT (update product)
export async function PUT(req: Request, { params }: any) {
  const body = await req.json();
  const products = readProducts();

  const updatedProducts = products.map((p: any) =>
    p.id === Number(params.id) ? { ...p, ...body } : p
  );

  writeProducts(updatedProducts);
  return NextResponse.json({ success: true });
}

// DELETE (remove product)
export async function DELETE(_: Request, { params }: any) {
  const products = readProducts();

  const filteredProducts = products.filter((p: any) => p.id !== Number(params.id));

  writeProducts(filteredProducts);
  return NextResponse.json({ success: true });
}