// app/admin/products/edit/[id]/page.tsx
import ProductForm from "@/app/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;  // <-- await here

  if (!id) {
    return <div>Product ID is missing in the URL.</div>;
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { brand: true, variations: true },
  });

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <>
      <section className="bg-black py-12"></section>
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
        <ProductForm initialData={product} />
      </div>
    </>
  );
}