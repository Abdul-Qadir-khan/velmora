"use client";

import { useState, useEffect, useRef, DragEvent } from "react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: any;
}

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandLogoInputRef = useRef<HTMLInputElement>(null);

  // Categories
  const categories = [
    { value: "mens", label: "Men's" },
    { value: "womens", label: "Women's" },
    { value: "kids", label: "Kids" },
    { value: "t-shirts", label: "T-Shirts" },
    { value: "shirts", label: "Shirts" },
    { value: "jeans", label: "Jeans" },
    { value: "jackets", label: "Jackets" },
    { value: "hoodies", label: "Hoodies" },
    { value: "accessories", label: "Accessories" },
  ];

  const initialFormData = initialData
    ? {
      ...initialData,
      slug: initialData.slug || "",
      images: initialData.images ? JSON.parse(initialData.images) : [],
      variations: {
        colors: initialData.variations?.[0]?.colors ? JSON.parse(initialData.variations[0].colors) : [],
        sizes: initialData.variations?.[0]?.sizes ? JSON.parse(initialData.variations[0].sizes) : [],
        specs: initialData.variations?.[0]?.specs
          ? JSON.parse(initialData.variations[0].specs)
          : { material: "", fit: "", sleeve: "", pattern: "", washing: "" },
      },
      brand: initialData.brand || { name: "", logo: "" },
      seo: {
        title: initialData.seoTitle || "",
        description: initialData.seoDescription || "",
        keywords: initialData.seoKeywords || "",
      },
    }
    : {
      name: "",
      slug: "",
      description: "",
      price: 0,
      originalPrice: 0,
      stock: 0,
      rating: 0,
      category: "t-shirts",
      isNew: false,
      bestSeller: false,
      images: [],
      brand: { name: "", logo: "" },
      variations: {
        colors: [],
        sizes: [],
        specs: { material: "", fit: "", sleeve: "", pattern: "", washing: "" },
      },
      seo: { title: "", description: "", keywords: "" },
    };

  const [form, setForm] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState<string>("");

  // ✅ FIXED: Type 'prev' parameter
  useEffect(() => {
    if (form.name && !initialData) {
      const slug = form.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      setForm((prev: typeof form) => ({ ...prev, slug }));
    }
  }, [form.name, initialData]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      imageFiles.forEach(img => URL.revokeObjectURL(img.preview));
      if (brandLogoPreview) URL.revokeObjectURL(brandLogoPreview);
    };
  }, [imageFiles, brandLogoPreview]);

  // Validation
  const validateForm = (): string | null => {
    if (!form.name?.trim()) return "Product name is required";
    if (!form.slug?.trim()) return "Slug is required";
    if (form.price <= 0) return "Price must be greater than 0";
    if (!form.category) return "Category is required";
    return null;
  };

  // Upload images to your API
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed: ${res.status} ${errorText}`);
    }

    return res.json();
  };

  // Upload brand logo
  const uploadBrandLogo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('logo', file);

    const res = await fetch('/api/upload/logo', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Logo upload failed: ${res.status} ${errorText}`);
    }

    return res.json();
  };

  // Handle drag & drop for product images
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files).slice(0, 5 - imageFiles.length);
      files.forEach(file => {
        if (file.type.startsWith('image/') && file.size < 5 * 1024 * 1024) {
          const preview = URL.createObjectURL(file);
          const id = Math.random().toString(36).substr(2, 9);
          setImageFiles(prev => [...prev, { file, preview, id }]);
        }
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - imageFiles.length);
      files.forEach(file => {
        if (file.type.startsWith('image/') && file.size < 5 * 1024 * 1024) {
          const preview = URL.createObjectURL(file);
          const id = Math.random().toString(36).substr(2, 9);
          setImageFiles(prev => [...prev, { file, preview, id }]);
        }
      });
      e.target.value = '';
    }
  };

  const removeImage = (id: string) => {
    setImageFiles(prev => {
      const updated = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return updated;
    });
  };

  // ✅ FIXED: Explicitly type 'prev'
  const handleBrandLogoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer!.files[0];
    if (file && file.type.startsWith('image/') && file.size < 2 * 1024 * 1024) {
      setBrandLogoFile(file);
      const preview = URL.createObjectURL(file);
      setBrandLogoPreview(preview);

      // ✅ FIXED: Type 'prev' parameter
      setForm((prev: typeof form) => ({
        ...prev,
        brand: {
          ...prev.brand,
          logo: preview  // Store preview URL as string
        }
      }));
    }
  };

  const handleBrandLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/') && file.size < 2 * 1024 * 1024) {
      setBrandLogoFile(file);
      const preview = URL.createObjectURL(file);
      setBrandLogoPreview(preview);

      // ✅ FIXED: Type 'prev' parameter
      setForm((prev: typeof form) => ({
        ...prev,
        brand: {
          ...prev.brand,
          logo: preview  // Better: store preview URL
        }
      }));
    }

    // ✅ Reset input
    e.target.value = '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setError("");
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "number") {
      setForm({ ...form, [name]: parseFloat(value) || 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Option 1: Full type-safe version (Recommended)
  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    path: (keyof typeof form | string)[]
  ) => {
    const value = e.target.value;
    setError("");

    setForm((prev: typeof form) => {
      // ✅ Type-safe deep update
      const updated = { ...prev };
      let current: any = updated;

      // Navigate to nested object
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }

      // Update leaf value
      current[path[path.length - 1]] = value;

      return updated as typeof form;
    });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, key: "colors" | "sizes") => {
    const { value, checked } = e.target;
    const arr = form.variations[key] as string[];
    if (checked) {
      setForm({
        ...form,
        variations: { ...form.variations, [key]: [...arr, value] }
      });
    } else {
      setForm({
        ...form,
        variations: { ...form.variations, [key]: arr.filter((v: string) => v !== value) }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUploadProgress(0);

    try {
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      let allImageUrls: string[] = form.images.filter((url: string) =>
        typeof url === 'string' && url && !url.startsWith('blob:')
      );

      if (imageFiles.length > 0) {
        setUploadProgress(30);
        const newImageUrls = await uploadImages(imageFiles.map(img => img.file));
        allImageUrls = [...allImageUrls, ...newImageUrls];
        setUploadProgress(60);
      }

      let finalBrandLogo = form.brand.logo;
      if (brandLogoFile) {
        setUploadProgress(70);
        finalBrandLogo = await uploadBrandLogo(brandLogoFile);
        setUploadProgress(80);
      }

      const payload = {
        ...form,
        images: JSON.stringify(allImageUrls),
        brand: {
          ...form.brand,
          logo: finalBrandLogo
        },
        variations: {
          ...form.variations,
          colors: JSON.stringify(form.variations.colors),
          sizes: JSON.stringify(form.variations.sizes),
          specs: JSON.stringify(form.variations.specs)
        },
        seo: {
          title: form.seo?.title || '',
          description: form.seo?.description || '',
          keywords: form.seo?.keywords || ''
        },
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        stock: Number(form.stock),
        rating: Number(form.rating),
      };

      setUploadProgress(90);

      const method = initialData ? "PUT" : "POST";
      const url = initialData ? `/api/products/${initialData.id}` : "/api/products";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Save failed: ${res.status} - ${errorText}`);
      }

      setUploadProgress(100);
      router.push("/admin/products");

    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header */}
            <div className="text-center pb-8 border-b border-gray-200">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {initialData ? "Edit Product" : "Add New Product"}
              </h1>
              <p className="text-gray-600 mt-2">Fill out all fields to create/update your product</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Product Name & Slug */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Product Name</label>
                  <input
                    name="name"
                    placeholder="Enter product name..."
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white/50"
                    required
                  />
                  <div className="flex gap-3">
                    <input
                      name="slug"
                      placeholder="Slug will auto-generate"
                      value={form.slug}
                      onChange={handleChange}
                      className="flex-1 p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all bg-white/50"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const slug = form.name
                          ?.toLowerCase()
                          .trim()
                          .replace(/[^\w\s-]/g, '')
                          .replace(/[\s_-]+/g, '-')
                          .replace(/^-+|-+$/g, '') || '';
                        setForm({ ...form, slug });
                      }}
                      className="px-6 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all font-medium"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all bg-white/50"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price, Original Price, Stock & Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                    <input
                      name="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price ($)</label>
                    <input
                      name="originalPrice"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.originalPrice}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all bg-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white/50"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    <input
                      name="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      placeholder="4.5"
                      value={form.rating}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-yellow-100 focus:border-yellow-400 transition-all bg-white/50"
                    />
                  </div>
                </div>

                {/* Flags */}
                <div className="flex gap-6 p-4 bg-blue-50 rounded-2xl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                    <span className="font-medium text-blue-900">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="bestSeller" checked={form.bestSeller} onChange={handleChange} className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500" />
                    <span className="font-medium text-orange-900">Best Seller</span>
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-vertical bg-white/50"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Product Images */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Product Images ({imageFiles.length}/5)
                  </label>
                  <div
                    className={`relative border-3 border-dashed rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer hover:shadow-xl ${dragActive
                      ? "border-blue-400 bg-blue-50 shadow-2xl"
                      : "border-gray-300 hover:border-gray-400 bg-white/50"
                      }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleImageClick}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-white font-semibold shadow-lg">
                        📸
                      </div>
                      <div>
                        <p className="font-semibold text-xl text-gray-800">
                          {dragActive ? "Drop images here" : "Click or drag & drop"}
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 5MB (Max 5 images)</p>
                      </div>
                    </div>
                  </div>

                  {imageFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                      {imageFiles.map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.preview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-2xl shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brand Section */}
                <div className="space-y-4 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-100">
                  <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">🏷️ Brand</h3>

                  <input
                    placeholder="Brand Name (e.g. Nike, Adidas)"
                    value={form.brand.name}
                    onChange={(e) => handleNestedChange(e, ["brand", "name"])}
                    className="w-full p-4 border border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all bg-white/70"
                  />

                  <div
                    className="relative border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer bg-white/50"
                    onClick={() => brandLogoInputRef.current?.click()}
                    onDrop={handleBrandLogoDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <input
                      ref={brandLogoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleBrandLogoSelect}
                      className="hidden"
                    />
                    {brandLogoPreview || form.brand.logo ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={brandLogoPreview || form.brand.logo}
                          alt="Brand Logo"
                          className="w-24 h-24 object-contain rounded-xl shadow-md bg-white p-2"
                        />
                        <p className="text-xs text-emerald-700 font-medium">
                          {brandLogoPreview ? "New logo - will be uploaded" : "Click to change"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-xl mx-auto flex items-center justify-center font-semibold shadow-lg">
                          🏷️
                        </div>
                        <p className="text-sm font-medium text-emerald-800">Drop logo or click to upload</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Variations & Specs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Variations */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl border-2 border-purple-100">
                <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">🎨 Variations</h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-3">Colors</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {["Black", "White", "Blue", "Red", "Green", "Yellow"].map(c => (
                        <label key={c} className="flex items-center gap-2 p-2 rounded-xl hover:bg-purple-100 cursor-pointer transition-all">
                          <input
                            type="checkbox"
                            value={c}
                            checked={form.variations.colors.includes(c)}
                            onChange={(e) => handleArrayChange(e, "colors")}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-800 mb-3">Sizes</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {["XS", "S", "M", "L", "XL"].map(s => (
                        <label key={s} className="flex items-center gap-2 p-2 rounded-xl hover:bg-purple-100 cursor-pointer transition-all">
                          <input
                            type="checkbox"
                            value={s}
                            checked={form.variations.sizes.includes(s)}
                            onChange={(e) => handleArrayChange(e, "sizes")}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4 p-6 bg-gradient-to-r from-orange-50 to-rose-50 rounded-3xl border-2 border-orange-100">
                <h3 className="text-lg font-bold text-orange-900 flex items-center gap-2">📋 Specifications</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(form.variations.specs).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-orange-800 mb-1 capitalize">{key}</label>
                      <input
                        placeholder={`Enter ${key}...`}
                        value={value as string}
                        onChange={(e) => handleNestedChange(e, ["variations", "specs", key])}
                        className="w-full p-3 border border-orange-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all bg-white/70"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="p-8 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-3xl border-2 border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">🔍 SEO Settings</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-indigo-800 mb-2">SEO Title</label>
                  <input
                    placeholder="SEO optimized title (60 chars)"
                    value={form.seo?.title || ""}
                    onChange={(e) => setForm({ ...form, seo: { ...form.seo, title: e.target.value } })}
                    className="w-full p-4 border border-indigo-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all bg-white/70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-800 mb-2">SEO Keywords</label>
                  <input
                    placeholder="keyword1, keyword2, keyword3"
                    value={form.seo?.keywords || ""}
                    onChange={(e) => setForm({ ...form, seo: { ...form.seo, keywords: e.target.value } })}
                    className="w-full p-4 border border-indigo-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all bg-white/70"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-indigo-800 mb-2">SEO Description</label>
                  <textarea
                    placeholder="SEO optimized description (160 chars)"
                    value={form.seo?.description || ""}
                    onChange={(e) => setForm({ ...form, seo: { ...form.seo, description: e.target.value } })}
                    rows={3}
                    className="w-full p-4 border border-indigo-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all resize-vertical bg-white/70"
                  />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Saving Progress</span>
                  <span className="text-sm font-medium text-blue-900">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300 shadow-lg"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-8 border-t border-gray-200 text-center">
              <button
                type="submit"
                disabled={loading}
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-3xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transform hover:scale-[1.02] transition-all duration-200 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      {initialData ? "Update Product" : "Create Product"}
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}