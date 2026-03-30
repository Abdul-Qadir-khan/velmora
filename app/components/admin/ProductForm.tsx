"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(
    initialData || {
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      stock: 0,
      rating: 0,
      category: "T-Shirt",
      isNew: false,
      bestSeller: false,
      images: [] as string[],
      brand: { name: "", logo: "" },
      variations: {
        colors: [] as string[],
        sizes: [] as string[],
        specs: {
          material: "",
          fit: "",
          sleeve: "",
          pattern: "",
          washing: "",
        },
      },
    }
  );

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") setForm({ ...form, [name]: checked });
    else setForm({ ...form, [name]: value });
  };

  const handleNestedChange = (e: any, path: string[]) => {
    const { value } = e.target;
    let updated = { ...form };
    let obj: any = updated;
    path.forEach((p, i) => {
      if (i === path.length - 1) obj[p] = value;
      else obj = obj[p];
    });
    setForm(updated);
  };

  const handleArrayChange = (e: any, key: "colors" | "sizes") => {
    const { value, checked } = e.target;
    const arr = form.variations[key];
    if (checked)
      setForm({ ...form, variations: { ...form.variations, [key]: [...arr, value] } });
    else
      setForm({
        ...form,
        variations: { ...form.variations, [key]: arr.filter((v: string) => v !== value) },
      });
  };

  const handleImagesChange = (e: any) => {
    const urls = e.target.value.split(",").map((url: string) => url.trim());
    setForm({ ...form, images: urls });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/products/${initialData.id}` : "/api/products";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded shadow-lg">
      {/* Basic Info */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-1">Basic Info</h2>
        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="border p-2 w-full rounded" required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full rounded" rows={3} />
        <div className="grid grid-cols-2 gap-3">
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 rounded" />
          <input name="originalPrice" type="number" placeholder="Original Price" value={form.originalPrice} onChange={handleChange} className="border p-2 rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="border p-2 rounded" />
          <input name="rating" type="number" step="0.1" placeholder="Rating" value={form.rating} onChange={handleChange} className="border p-2 rounded" />
        </div>
      </section>

      {/* Brand */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-1">Brand</h2>
        <input placeholder="Brand Name" value={form.brand.name} onChange={(e) => handleNestedChange(e, ["brand", "name"])} className="border p-2 w-full rounded" />
        <input placeholder="Brand Logo URL" value={form.brand.logo} onChange={(e) => handleNestedChange(e, ["brand", "logo"])} className="border p-2 w-full rounded" />
      </section>

      {/* Category */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-1">Category</h2>
        <select name="category" value={form.category} onChange={handleChange} className="border p-2 rounded w-full">
          <option>T-Shirt</option>
          <option>Shirt</option>
          <option>Jeans</option>
          <option>Jacket</option>
          <option>Hoodie</option>
        </select>
      </section>

      {/* Flags */}
      <section className="space-y-2">
        <label><input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} /> Is New</label>
        <label><input type="checkbox" name="bestSeller" checked={form.bestSeller} onChange={handleChange} /> Best Seller</label>
      </section>

      {/* Images */}
      <input name="images" placeholder="Image URLs (comma separated)" value={form.images.join(", ")} onChange={handleImagesChange} className="border p-2 w-full rounded" />

      {/* Variations */}
      <section className="space-y-3">
        <p>Colors:</p>
        {["Black","White","Blue","Red"].map(c => (
          <label key={c}><input type="checkbox" value={c} checked={form.variations.colors.includes(c)} onChange={(e) => handleArrayChange(e,"colors")} /> {c}</label>
        ))}
        <p>Sizes:</p>
        {["S","M","L","XL"].map(s => (
          <label key={s}><input type="checkbox" value={s} checked={form.variations.sizes.includes(s)} onChange={(e) => handleArrayChange(e,"sizes")} /> {s}</label>
        ))}
      </section>

      {/* Specs */}
      <section className="space-y-3">
        <p>Specifications:</p>
        {Object.keys(form.variations.specs).map(key => (
          <input key={key} placeholder={key} value={form.variations.specs[key]} onChange={(e)=>handleNestedChange(e,["variations","specs",key])} className="border p-2 w-full rounded"/>
        ))}
      </section>

      <button type="submit" disabled={loading} className="w-full p-3 rounded bg-blue-600 text-white">
        {loading ? "Submitting..." : initialData ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}