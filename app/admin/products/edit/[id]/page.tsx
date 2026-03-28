import ProductForm from "@/app/components/admin/ProductForm";

async function getProduct(id: string) {
  const res = await fetch("http://localhost:3000/api/products", { cache: "no-store" });
  const products = await res.json();
  return products.find((p: any) => p.id === Number(id));
}

export default async function Page({ params }: any) {
  const { id } = await params;

  const product = await getProduct(id);

  return (
    <>
      <section className="bg-black py-12"></section>
      <div className="p-8">
        <h1>Edit Product</h1>
        <ProductForm initialData={product} />
      </div>
    </>
  );
}