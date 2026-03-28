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
      price: 0,
      originalPrice: 0,
      description: "",
      category: "CCTV Camera",
      stock: 0,
      rating: 0,
      images: [] as string[],
      brand: { name: "", logo: "" },
      isNew: false,
      bestSeller: false,
      variations: {
        colors: [] as string[],
        sizes: [] as string[],
        specs: {
          resolution: "",
          lens: "",
          connectivity: "",
          nightVision: "",
          warranty: "",
          storage: "",
          weatherResistance: "",
          appSupport: ""
        }
      }
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
        variations: { ...form.variations, [key]: arr.filter((v: string) => v !== value) }
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
      body: JSON.stringify(form)
    });

    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded shadow-lg">
      
      {/* Basic Info */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-1">Basic Info</h2>
        <div className="flex flex-col gap-3">
          <label>
            Name
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
              rows={3}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="originalPrice"
              type="number"
              placeholder="Original Price"
              value={form.originalPrice}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="rating"
              type="number"
              step="0.1"
              placeholder="Rating"
              value={form.rating}
              onChange={handleChange}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </section>

      {/* Brand */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-1">Brand</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            name="brandName"
            placeholder="Brand Name"
            value={form.brand.name}
            onChange={(e) => handleNestedChange(e, ["brand", "name"])}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="brandLogo"
            placeholder="Brand Logo URL"
            value={form.brand.logo}
            onChange={(e) => handleNestedChange(e, ["brand", "logo"])}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </section>

      {/* Category */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-1">Category</h2>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
        >
          <option>CCTV Camera</option>
          <option>Dome Camera</option>
          <option>Wireless Camera</option>
          <option>AI Camera</option>
          <option>Bullet Camera</option>
        </select>
      </section>

      {/* Flags */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold border-b pb-1">Flags</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} className="accent-blue-500" /> Is New
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="bestSeller" checked={form.bestSeller} onChange={handleChange} className="accent-blue-500" /> Best Seller
          </label>
        </div>
      </section>

      {/* Images */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-1">Images</h2>
        <input
          name="images"
          placeholder="Image URLs (comma separated)"
          value={form.images.join(", ")}
          onChange={handleImagesChange}
          className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
        />
      </section>

      {/* Variations */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-1">Variations</h2>
        <div className="flex flex-col gap-2">
          <p className="font-medium">Colors:</p>
          <div className="flex gap-2">
            {["Black", "White", "Grey"].map((color) => (
              <label
                key={color}
                className={`cursor-pointer px-3 py-1 rounded border ${
                  form.variations.colors.includes(color) ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  value={color}
                  checked={form.variations.colors.includes(color)}
                  onChange={(e) => handleArrayChange(e, "colors")}
                  className="hidden"
                />
                {color}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium">Sizes:</p>
          <div className="flex gap-2">
            {["Small", "Medium", "Large"].map((size) => (
              <label
                key={size}
                className={`cursor-pointer px-3 py-1 rounded border ${
                  form.variations.sizes.includes(size) ? "bg-green-500 text-white" : "bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  value={size}
                  checked={form.variations.sizes.includes(size)}
                  onChange={(e) => handleArrayChange(e, "sizes")}
                  className="hidden"
                />
                {size}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-1">Specifications</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(form.variations.specs).map((key) => (
            <input
              key={key}
              name={key}
              placeholder={key}
              value={form.variations.specs[key]}
              onChange={(e) => handleNestedChange(e, ["variations", "specs", key])}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>
      </section>

      <button
        type="submit"
        className={`w-full p-3 rounded text-white font-semibold ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={loading}
      >
        {loading ? "Submitting..." : initialData ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}