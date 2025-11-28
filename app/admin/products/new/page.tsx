"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import axios from "axios";
import { getSubcategoriesForCategory } from "@/lib/subcategories";

const schema = yup.object({
  slug: yup.string().required("Slug is required").matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  title: yup.string().required("Title is required"),
  short_description: yup.string().required("Short description is required"),
  description: yup.string().required("Description is required"),
  price: yup.number().required("Price is required").min(1, "Price must be greater than 0"),
  category: yup.string().oneOf(["flowers", "hampers", "teddy", "wines", "chocolates"]).required("Category is required"),
  subcategory: yup.string().nullable().when("category", {
    is: "teddy",
    then: (schema) => schema.required("Size is required for teddy bears"),
    otherwise: (schema) => schema.nullable().optional(),
  }),
  teddy_size: yup.number().nullable().optional(),
  teddy_color: yup.string().nullable().when("category", {
    is: "teddy",
    then: (schema) => schema.required("Color is required for teddy bears"),
    otherwise: (schema) => schema.nullable().optional(),
  }),
});

type ProductFormData = yup.InferType<typeof schema>;


const TEDDY_COLORS = [
  "pink", "red", "blue", "brown", "white"
];

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [includedItems, setIncludedItems] = useState<Array<{ name: string; qty: number; note?: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const category = watch("category");
  const subcategory = watch("subcategory");

  // Reset subcategory when category changes (only show for flowers and teddy)
  const handleCategoryChange = (newCategory: string) => {
    setValue("category", newCategory as any);
    // Clear subcategory when switching categories
    setValue("subcategory", null);
    // Clear color when switching away from teddy
    if (newCategory !== "teddy") {
      setValue("teddy_color", null);
    }
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
          tags: [],
          category: data.category as "flowers" | "hampers" | "teddy" | "wines" | "chocolates",
          subcategory: data.subcategory || null,
          teddy_size: category === "teddy" ? data.teddy_size : null,
          teddy_color: category === "teddy" ? data.teddy_color : null,
          included_items: category === "hampers" && includedItems.length > 0 ? includedItems : null,
          upsells: null,
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
              <select 
                id="category" 
                {...register("category")} 
                className="input-field"
                onChange={(e) => {
                  handleCategoryChange(e.target.value);
                  register("category").onChange(e);
                }}
              >
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

          {/* Subcategory Field - appears after category is selected (only for flowers and teddy bears) */}
          {category && (category === "flowers" || category === "teddy") && (
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-brand-gray-900 mb-2">
                {category === "teddy" ? "Size" : "Subcategory"}
                {category === "teddy" && <span className="text-brand-red"> *</span>}
              </label>
              <select 
                id="subcategory" 
                {...register("subcategory")} 
                className="input-field"
              >
                <option value="">
                  {category === "teddy" ? "Select size (required)" : "Select subcategory (optional)"}
                </option>
                {getSubcategoriesForCategory(category as "flowers" | "teddy").map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
              </select>
              {errors.subcategory && (
                <p className="mt-1 text-sm text-brand-red">{errors.subcategory.message}</p>
              )}
            </div>
          )}


          {/* Color - Show for teddy bears (required), and optional for other categories */}
          {category === "teddy" && (
            <div>
              <label htmlFor="teddy_color" className="block text-sm font-medium text-brand-gray-900 mb-2">
                Color <span className="text-brand-red">*</span>
              </label>
              <select id="teddy_color" {...register("teddy_color", { required: category === "teddy" })} className="input-field">
                <option value="">Select color (required)</option>
                {TEDDY_COLORS.map(color => (
                  <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
                ))}
              </select>
              {errors.teddy_color && (
                <p className="mt-1 text-sm text-brand-red">{errors.teddy_color.message}</p>
              )}
            </div>
          )}


          {/* Included Items Section - Only for gift hampers */}
          {category === "hampers" && (
            <div>
              <label className="block text-sm font-medium text-brand-gray-900 mb-2">
                Included Items (Optional)
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
          )}


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

