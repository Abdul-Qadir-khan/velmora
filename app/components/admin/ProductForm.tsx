"use client";

import { useState, useEffect, useRef, DragEvent } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  rating: number;
  category: string;
  isNew: boolean;
  bestSeller: boolean;
  images: string[];
  brand: {
    name: string;
    logo: string;
  };
  variations: {
    colors: string[];
    sizes: string[];
    specs: {
      material: string;
      fit: string;
      sleeve: string;
      pattern: string;
      washing: string;
    };
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
};

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

  // 🔥 CLEAN STATE - ALL STATES DECLARED
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // 🔥 ADD THIS
  const [newImageFiles, setNewImageFiles] = useState<ImageFile[]>([]);
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState<string>("");

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
      // 🔥 FIXED: Properly parse ALL data from backend
      images: Array.isArray(initialData.images)
        ? initialData.images
        : typeof initialData.images === 'string'
          ? JSON.parse(initialData.images || '[]')
          : [],

      // 🔥 FIXED: Brand - handle properly
      brand: {
        name: initialData.brand?.name || "",
        logo: initialData.brand?.logo || ""
      },

      // 🔥 FIXED: Variations - parse properly
      variations: {
        colors: Array.isArray(initialData.variations?.[0]?.colors)
          ? initialData.variations[0].colors
          : typeof initialData.variations?.[0]?.colors === 'string'
            ? JSON.parse(initialData.variations[0].colors || '[]')
            : [],

        sizes: Array.isArray(initialData.variations?.[0]?.sizes)
          ? initialData.variations[0].sizes
          : typeof initialData.variations?.[0]?.sizes === 'string'
            ? JSON.parse(initialData.variations[0].sizes || '[]')
            : [],

        specs: typeof initialData.variations?.[0]?.specs === 'object'
          ? initialData.variations[0].specs
          : typeof initialData.variations?.[0]?.specs === 'string'
            ? JSON.parse(initialData.variations[0].specs || '{}')
            : { material: "", fit: "", sleeve: "", pattern: "", washing: "" },
      },

      // 🔥 FIXED: SEO - map backend fields to frontend
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

  const [form, setForm] = useState<FormData>(initialFormData);

  // 🔥 FIXED: Auto-generate slug
  useEffect(() => {
    if (form.name && !initialData) {
      const slug = form.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setForm((prev: FormData) => ({ ...prev, slug }));
    }
  }, [form.name, initialData]);

  // 🔥 FIXED: Initialize images on mount
useEffect(() => {
  if (initialData?.images) {
    const imageUrls = Array.isArray(initialData.images)
      ? initialData.images
      : typeof initialData.images === 'string'
        ? JSON.parse(initialData.images)
        : [];
    
    setCurrentImages(imageUrls);
    setExistingImages(imageUrls);
    setForm(prev => ({ ...prev, images: imageUrls }));
  }
}, [initialData]);

// 🔥 FIXED: Slug auto-update + initialData handling
  useEffect(() => {
    if (initialData && initialData.name) {
      // For EDIT - use existing slug or generate new
      const slug = initialData.slug || generateSlug(initialData.name);
      setForm(prev => ({ ...prev, slug }));
    } else if (form.name && !initialData) {
      // For NEW - auto-generate
      const slug = generateSlug(form.name);
      setForm(prev => ({ ...prev, slug }));
    }
  }, [form.name, initialData]);

  // 🔥 ADD generateSlug function at top (after imports)
  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // 🔥 ADD THIS useEffect - Syncs ALL initial data
  useEffect(() => {
    if (initialData) {
      setForm(initialFormData);

      // Sync images separately for currentImages state
      const imageUrls = Array.isArray(initialData.images)
        ? initialData.images
        : typeof initialData.images === 'string'
          ? JSON.parse(initialData.images)
          : [];
      setCurrentImages(imageUrls);
    }
  }, [initialData]);

  // Validation
  const validateForm = (): string | null => {
    if (!form.name?.trim()) return "Product name is required";
    if (!form.slug?.trim()) return "Slug is required";
    if (form.price <= 0) return "Price must be greater than 0";
    if (!form.category) return "Category is required";
    return null;
  };

  // Upload functions
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    const urls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} ${errorText}`);
      }
      const data = await res.json();
      urls.push(data.url);
    }
    return urls;
  };

  const uploadBrandLogo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Logo upload failed: ${res.status} ${errorText}`);
    }
    const data = await res.json();
    return data.url;
  };

  // 🔥 ALL IMAGE HANDLERS - FIXED
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
      const files = Array.from(e.dataTransfer.files).slice(0, 10 - newImageFiles.length);
      files.forEach((file) => {
        if (file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) {
          const preview = URL.createObjectURL(file);
          const id = Math.random().toString(36).substr(2, 9);
          setNewImageFiles((prev) => [...prev, { file, preview, id }]);
        }
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 10 - newImageFiles.length);
      files.forEach((file) => {
        if (file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) {
          const preview = URL.createObjectURL(file);
          const id = Math.random().toString(36).substr(2, 9);
          setNewImageFiles((prev) => [...prev, { file, preview, id }]);
        }
      });
      e.target.value = "";
    }
  };

  // 🔥 FIXED: removeExistingImage
  const removeExistingImage = (imageUrl: string) => {
    // 🔥 FIXED: Update form.images directly (main source of truth)
    setForm((prev: FormData) => ({
      ...prev,
      images: prev.images.filter((img: string) => img !== imageUrl)
    }));

    // Update display states
    setExistingImages(prev => prev.filter((img: string) => img !== imageUrl));
    setCurrentImages(prev => prev.filter((img: string) => img !== imageUrl));
  };

  // 🔥 NEW: Sync form.images with display states
  const syncImagesToForm = () => {
    setForm((prev: FormData) => ({
      ...prev,
      images: currentImages.filter(url => url && !url.startsWith('blob:'))
    }));
  };

  // 🔥 FIXED: removeNewImage
  const removeNewImage = (id: string) => {
    setNewImageFiles((prev) => {
      const updated = prev.filter((img: ImageFile) => img.id !== id);
      const removed = prev.find((img: ImageFile) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return updated;
    });
  };

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    setError("");
    setForm((prev: FormData) => {
      if (type === "checkbox") {
        const checked = (target as HTMLInputElement).checked;
        return { ...prev, [name as keyof FormData]: checked };
      } else if (type === "number") {
        return { ...prev, [name as keyof FormData]: parseFloat(value) || 0 };
      } else {
        return { ...prev, [name as keyof FormData]: value };
      }
    });
  };

  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    path: (keyof FormData | string)[]
  ) => {
    const value = e.target.value;
    setError("");
    setForm((prev: FormData) => {
      const updated = { ...prev } as FormData;
      let current: any = updated;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return updated;
    });
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "colors" | "sizes"
  ) => {
    const value = e.target.value;
    const checked = e.target.checked;
    const arr = form.variations[key] as string[];
    setForm((prev: FormData) => ({
      ...prev,
      variations: {
        ...prev.variations,
        [key]: checked ? [...arr, value] : arr.filter((v: string) => v !== value),
      },
    }));
  };

  // 🔥 COMPLETE FIXED: handleSubmit
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

      // 🔥 FIXED: Get ALL current images (existing + form images - remove blob URLs)
      let allImageUrls: string[] = [];

      // Add existing images from form.images (remove blob URLs)
      allImageUrls = form.images.filter((url: string) =>
        typeof url === 'string' && url && !url.startsWith('blob:') && url !== ''
      );

      // 🔥 FIXED: Upload new images and add to allImageUrls
     if (newImageFiles.length > 0) {
  setUploadProgress(30);
  const newImageUrls = await uploadImages(newImageFiles.map(img => img.file));
  allImageUrls = [...allImageUrls, ...newImageUrls];
  setUploadProgress(60);
}

      // 🔥 FIXED: Handle brand logo
      let finalBrandLogo = form.brand.logo;
      if (brandLogoFile && !form.brand.logo.startsWith('blob:')) {
        setUploadProgress(70);
        finalBrandLogo = await uploadBrandLogo(brandLogoFile);
        setUploadProgress(80);
      }

      const payload = {
        id: initialData?.id, // 🔥 Include ID for updates
        ...form,
        images: allImageUrls, // 🔥 Only valid URLs, no blob URLs
        brand: {
          ...form.brand,
          logo: finalBrandLogo && !finalBrandLogo.startsWith('blob:') ? finalBrandLogo : form.brand.logo
        },
        variations: {
          colors: form.variations.colors || [],
          sizes: form.variations.sizes || [],
          specs: form.variations.specs || {}
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

      console.log("🚀 Submitting:", { method, url, payload }); // Debug log

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", errorText); // Debug log
        throw new Error(`Save failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log("✅ Success:", data); // Debug log

      setUploadProgress(100);

      // 🔥 Reset form and images after successful save
      setTimeout(() => {
        router.push("/admin/products");
      }, 1000);

    } catch (err: any) {
      console.error("Submit error:", err); // Debug log
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Brand logo handlers
  const handleBrandLogoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer!.files[0];
    if (file && file.type.startsWith("image/") && file.size < 2 * 1024 * 1024) {
      setBrandLogoFile(file);
      const preview = URL.createObjectURL(file);
      setBrandLogoPreview(preview);
      setForm((prev: FormData) => ({
        ...prev,
        brand: { ...prev.brand, logo: preview },
      }));
    }
  };

  const handleBrandLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/") && file.size < 2 * 1024 * 1024) {
      setBrandLogoFile(file);
      const preview = URL.createObjectURL(file);
      setBrandLogoPreview(preview);
      setForm((prev: FormData) => ({
        ...prev,
        brand: { ...prev.brand, logo: preview },
      }));
    }
    e.target.value = "";
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

            {/* Rest of your JSX remains EXACTLY THE SAME */}
            {/* ... (Left Column, Right Column, Variations, SEO, etc.) ... */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT COLUMN - SAME AS BEFORE */}
              <div className="space-y-6">
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
                          .replace(/[^\w\s-]/g, "")
                          .replace(/[\s_-]+/g, "-")
                          .replace(/^-+|-+$/g, "") || "";
                        setForm((prev: FormData) => ({ ...prev, slug }));
                      }}
                      className="px-6 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all font-medium"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all bg-white/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price, Original Price, Stock & Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price (₹)</label>
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
                    <input
                      type="checkbox"
                      name="isNew"
                      checked={form.isNew}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-blue-900">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="bestSeller"
                      checked={form.bestSeller}
                      onChange={handleChange}
                      className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                    />
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

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* 🔥 COMPLETE FIXED IMAGES SECTION */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Product Images ({form.images.length + newImageFiles.length}/10)
                  </label>

                  {/* 1. EXISTING IMAGES FROM FORM (Main source of truth) */}
                  {form.images.length > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3">
                        Current Images ({form.images.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {form.images.map((imgUrl: string, index: number) => (
                          <div key={`${imgUrl}-${index}`} className="relative group">
                            <img
                              src={imgUrl}
                              alt="Current"
                              className="w-full h-32 object-cover rounded-2xl shadow-md border-2 border-blue-200 hover:border-blue-400 transition-all"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <button
                              onClick={() => removeExistingImage(imgUrl)}
                              className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 text-xs font-bold"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. NEW UPLOAD ZONE */}
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
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl mx-auto flex items-center justify-center">
                        📷
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        {newImageFiles.length === 0
                          ? "Drop images here or click to browse"
                          : `Added ${newImageFiles.length} new image(s) - will upload on save`
                        }
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB each (Max 10 total)</p>
                    </div>
                  </div>

                  {/* 3. NEW IMAGE PREVIEWS (Pending upload) */}
                  {newImageFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                      {newImageFiles.map((img: ImageFile) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.preview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-2xl shadow-md border-2 border-orange-200"
                          />
                          <button
                            onClick={() => removeNewImage(img.id)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"
                          >
                            ✕
                          </button>
                          <p className="text-xs text-orange-700 mt-1 text-center font-medium">Pending upload</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* BRAND SECTION */}
                <div className="space-y-4 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-100">
                  <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">🏷️ Brand</h3>
                  <input
                    placeholder="Brand Name (e.g. Nike, Adidas)"
                    value={form.brand.name}
                    onChange={(e) => handleNestedChange(e, ["brand", "name"])}
                    className="w-full p-4 border border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all bg-white/70"
                  />
                  {form.brand.logo && !brandLogoPreview && (
                    <div className="relative p-4 bg-white rounded-2xl shadow-md border-2 border-emerald-200">
                      <img
                        src={form.brand.logo}
                        alt="Current Brand Logo"
                        className="w-24 h-24 object-contain rounded-xl mx-auto block"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev: FormData) => ({
                            ...prev,
                            brand: { ...prev.brand, logo: "" },
                          }));
                          setBrandLogoPreview("");
                          setBrandLogoFile(null);
                        }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-red-600 transition-all font-bold text-sm"
                        title="Remove current logo"
                      >
                        ✕
                      </button>
                      <p className="text-xs text-emerald-700 font-medium text-center mt-2">
                        Current logo - click ✕ to remove
                      </p>
                    </div>
                  )}
                  <div
                    className="relative border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer bg-white/50 min-h-[120px] flex items-center justify-center"
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
                    {brandLogoPreview ? (
                      <>
                        <img
                          src={brandLogoPreview}
                          alt="New logo preview"
                          className="w-24 h-24 object-contain rounded-xl shadow-md bg-white p-3 mx-auto block"
                        />
                        <p className="text-xs text-emerald-700 font-medium mt-2">New logo selected</p>
                      </>
                    ) : (
                      <div className="space-y-2 text-center">
                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl mx-auto flex items-center justify-center font-semibold shadow-lg">
                          🏷️
                        </div>
                        <p className="text-sm font-medium text-emerald-800">
                          {form.brand.logo ? "Change logo" : "Drop logo or click to upload"}
                        </p>
                        <p className="text-xs text-emerald-600">PNG, JPG up to 2MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* VARIATIONS & SPECS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl border-2 border-purple-100">
                <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">🎨 Variations</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-3">Colors</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {["Black", "White", "Blue", "Red", "Green", "Yellow"].map((c) => (
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
                      {["XS", "S", "M", "L", "XL"].map((s) => (
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
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      {initialData ? "Update Product" : "Create Product"}
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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