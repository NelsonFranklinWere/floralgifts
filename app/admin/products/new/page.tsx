"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import axios from "axios";

const schema = yup.object({
  slug: yup.string().required("Slug is required").matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  title: yup.string().required("Title is required"),
  short_description: yup.string().required("Short description is required"),
  description: yup.string().required("Description is required"),
  price: yup.number().required("Price is required").min(1, "Price must be greater than 0"),
  category: yup.string().oneOf(["flowers", "hampers", "teddy", "wines", "chocolates"]).required("Category is required"),
  tags: yup.array().of(yup.string()).optional(),
  teddy_size: yup.number().nullable().optional(),
  teddy_color: yup.string().nullable().optional(),
  stock: yup.number().nullable().optional(),
});

type ProductFormData = yup.InferType<typeof schema>;

// Common tags by category
const COMMON_TAGS = {
  flowers: [
    "birthday", "anniversary", "romantic", "valentine", "wedding", "funeral", "condolence",
    "get well soon", "sorry", "congrats", "graduation", "roses", "carnations", "gerberas",
    "sunflowers", "lilies", "chrysanthemums", "heart box", "vase", "basket", "hat box",
    "hand-tied", "envelope", "square box"
  ],
  hampers: [
    "birthday", "anniversary", "corporate", "graduation", "wedding", "holiday", "end of year",
    "chocolate", "wine", "fruit", "gourmet"
  ],
  teddy: [
    "birthday", "anniversary", "valentine", "graduation", "baby", "kids", "gift"
  ],
  wines: [
    "red", "white", "sparkling", "sweet", "dry", "premium", "gift"
  ],
  chocolates: [
    "ferrero rocher", "birthday", "anniversary", "valentine", "gift", "premium"
  ]
};

const COLORS = [
  "brown", "red", "white", "pink", "blue", "black", "yellow", "green", "purple", "orange", "beige", "gray"
];

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [includedItems, setIncludedItems] = useState<Array<{ name: string; qty: number; note?: string }>>([]);
  const [upsells, setUpsells] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      tags: [],
      stock: null,
    },
  });

  const category = watch("category");

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const addIncludedItem = () => {
    setIncludedItems([...includedItems, { name: "", qty: 1 }]);
  };

  const updateIncludedItem = (index: number, field: string, value: string | number) => {
    const updated = [...includedItems];
    updated[index] = { ...updated[index], [field]: value };
    setIncludedItems(updated);
  };

  const removeIncludedItem = (index: number) => {
    setIncludedItems(includedItems.filter((_, i) => i !== index));
  };

  const addUpsell = (productSlug: string) => {
    const trimmed = productSlug.trim();
    if (trimmed && !upsells.includes(trimmed)) {
      setUpsells([...upsells, trimmed]);
    }
  };

  const removeUpsell = (slug: string) => {
    setUpsells(upsells.filter(s => s !== slug));
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    const token = localStorage.getItem("admin_token");

    if (!token) {
      alert("Authentication required. Please log in again.");
      router.push("/admin/login");
      return;
    }

    try {
      const response = await axios.post(
        "/api/admin/products",
        {
          ...data,
          price: Math.round(data.price * 100), // Convert to cents
          images,
          tags,
          category: data.category as "flowers" | "hampers" | "teddy" | "wines" | "chocolates",
          teddy_size: category === "teddy" ? data.teddy_size : null,
          teddy_color: category === "teddy" ? data.teddy_color : null,
          included_items: includedItems.length > 0 ? includedItems : null,
          upsells: upsells.length > 0 ? upsells : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data) {
        alert("Product created successfully! It will appear on the frontend immediately.");
        router.push("/admin/products");
      }
    } catch (error: any) {
      console.error("Create error:", error);
      if (error.response?.status === 401) {
        alert("Authentication failed. Please log in again.");
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      } else {
        const errorMessage = error.response?.data?.message || error.message || "Failed to create product. Please check the console for details.";
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const token = localStorage.getItem("admin_token");

    try {
      // Upload all selected files
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category || "flowers");

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to upload image");
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
    } catch (error: any) {
      alert(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addImage = () => {
    // Trigger file input click
    console.log("addImage called, category:", category);
    console.log("fileInputRef.current:", fileInputRef.current);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input ref is null!");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white border-b border-brand-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin/products" className="text-brand-gray-600 hover:text-brand-green">
              ← Back to Products
            </Link>
            <h1 className="font-heading font-bold text-xl text-brand-gray-900">New Product</h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={onSubmit} className="card p-6 space-y-6">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-brand-gray-900 mb-2">
              Slug (URL-friendly) <span className="text-brand-red">*</span>
            </label>
            <input
              id="slug"
              type="text"
              {...register("slug")}
              className="input-field"
              placeholder="beautiful-bouquet-birthday"
            />
            {errors.slug && <p className="mt-1 text-sm text-brand-red">{errors.slug.message}</p>}
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-brand-gray-900 mb-2">
              Title <span className="text-brand-red">*</span>
            </label>
            <input id="title" type="text" {...register("title")} className="input-field" />
            {errors.title && <p className="mt-1 text-sm text-brand-red">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="short_description" className="block text-sm font-medium text-brand-gray-900 mb-2">
              Short Description <span className="text-brand-red">*</span>
            </label>
            <input
              id="short_description"
              type="text"
              {...register("short_description")}
              className="input-field"
            />
            {errors.short_description && (
              <p className="mt-1 text-sm text-brand-red">{errors.short_description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-brand-gray-900 mb-2">
              Description <span className="text-brand-red">*</span>
            </label>
            <textarea
              id="description"
              rows={6}
              {...register("description")}
              className="input-field resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-brand-red">{errors.description.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-brand-gray-900 mb-2">
                Price (KES) <span className="text-brand-red">*</span>
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="input-field"
                placeholder="15000"
              />
              {errors.price && <p className="mt-1 text-sm text-brand-red">{errors.price.message}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-brand-gray-900 mb-2">
                Category <span className="text-brand-red">*</span>
              </label>
              <select id="category" {...register("category")} className="input-field">
                <option value="">Select category</option>
                <option value="flowers">Flowers</option>
                <option value="hampers">Gift Hampers</option>
                <option value="teddy">Teddy Bears</option>
                <option value="wines">Wines</option>
                <option value="chocolates">Chocolates</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-brand-red">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <label className="block text-sm font-medium text-brand-gray-900 mb-2">
              Tags (for filtering)
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  className="input-field flex-1"
                  placeholder="Type a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={() => addTag(tagInput)}
                  className="btn-outline"
                >
                  Add
                </button>
              </div>
              {category && COMMON_TAGS[category as keyof typeof COMMON_TAGS] && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-brand-gray-500 mr-2">Suggestions:</span>
                  {COMMON_TAGS[category as keyof typeof COMMON_TAGS].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      disabled={tags.includes(tag)}
                      className="text-xs px-2 py-1 rounded bg-brand-gray-100 hover:bg-brand-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-brand-green/10 text-sm text-brand-green"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-brand-green hover:text-brand-red"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Size and Color - Show for teddy bears, but also allow color for other categories */}
          {(category === "teddy" || category === "flowers" || category === "hampers") && (
            <div className="grid md:grid-cols-2 gap-4">
              {category === "teddy" && (
                <div>
                  <label htmlFor="teddy_size" className="block text-sm font-medium text-brand-gray-900 mb-2">
                    Size (cm)
                  </label>
                  <input
                    id="teddy_size"
                    type="number"
                    {...register("teddy_size", { valueAsNumber: true })}
                    className="input-field"
                    placeholder="50"
                  />
                </div>
              )}

              <div>
                <label htmlFor="teddy_color" className="block text-sm font-medium text-brand-gray-900 mb-2">
                  Color {category === "teddy" ? "" : "(Optional)"}
                </label>
                <select id="teddy_color" {...register("teddy_color")} className="input-field">
                  <option value="">Select color (optional)</option>
                  {COLORS.map(color => (
                    <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-brand-gray-900 mb-2">
              Stock (Optional - Leave empty for always available)
            </label>
            <input
              id="stock"
              type="number"
              {...register("stock", { valueAsNumber: true, setValueAs: (v) => v === '' ? null : v })}
              className="input-field"
              placeholder="Leave empty for always available"
            />
          </div>

          {/* Included Items Section */}
          <div>
            <label className="block text-sm font-medium text-brand-gray-900 mb-2">
              Included Items (Optional - for gift hampers)
            </label>
            <div className="space-y-2">
              {includedItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateIncludedItem(index, "name", e.target.value)}
                    className="input-field flex-1"
                    placeholder="Item name"
                  />
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateIncludedItem(index, "qty", parseInt(e.target.value) || 1)}
                    className="input-field w-20"
                    placeholder="Qty"
                    min="1"
                  />
                  <input
                    type="text"
                    value={item.note || ""}
                    onChange={(e) => updateIncludedItem(index, "note", e.target.value)}
                    className="input-field flex-1"
                    placeholder="Note (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => removeIncludedItem(index)}
                    className="btn-outline text-sm px-3"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIncludedItem}
                className="btn-outline text-sm"
              >
                + Add Included Item
              </button>
            </div>
          </div>

          {/* Upsells Section */}
          <div>
            <label className="block text-sm font-medium text-brand-gray-900 mb-2">
              Upsells (Optional - Product slugs to suggest)
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const target = e.target as HTMLInputElement;
                      addUpsell(target.value);
                      target.value = "";
                    }
                  }}
                  className="input-field flex-1"
                  placeholder="Enter product slug and press Enter"
                />
              </div>
              {upsells.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {upsells.map((slug) => (
                    <span
                      key={slug}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-brand-gray-100 text-sm"
                    >
                      {slug}
                      <button
                        type="button"
                        onClick={() => removeUpsell(slug)}
                        className="text-brand-gray-600 hover:text-brand-red"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-gray-900 mb-2">Images</label>
            <div className="space-y-2">
              {images.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border border-brand-gray-200"
                  />
                  <input type="text" value={url} readOnly className="input-field flex-1 text-xs" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="btn-outline text-sm px-4 py-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
                multiple
              />
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Button clicked, category:", category, "isUploading:", isUploading);
                  addImage();
                }}
                disabled={isUploading || !category}
                className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ pointerEvents: isUploading || !category ? 'none' : 'auto' }}
              >
                {isUploading ? "Uploading..." : "+ Upload Image"}
              </button>
              {!category && (
                <p className="text-xs text-brand-gray-500 mt-2">
                  Please select a category first to upload images
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>
            <Link href="/admin/products" className="btn-outline flex-1 text-center">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

