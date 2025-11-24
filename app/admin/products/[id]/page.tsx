"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import axios from "axios";
import type { Product } from "@/lib/db";

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

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [productId, setProductId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function getParams() {
      try {
        const resolvedParams = await params;
        if (isMounted) {
          setProductId(resolvedParams.id);
        }
      } catch (err) {
        console.error("Error getting params:", err);
        if (isMounted) {
          setError("Failed to load product ID");
        }
      }
    }
    
    getParams();
    
    return () => {
      isMounted = false;
    };
  }, [params]);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
  });

  const category = watch("category");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (!productId) {
      return;
    }

    async function fetchProduct() {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const prod = response.data;
        setProduct(prod);
        setImages(prod.images || []);
        reset({
          slug: prod.slug,
          title: prod.title,
          short_description: prod.short_description,
          description: prod.description,
          price: prod.price / 100, // Convert from cents
          category: prod.category,
          tags: prod.tags || [],
          teddy_size: prod.teddy_size,
          teddy_color: prod.teddy_color,
          stock: prod.stock ?? null,
        });
        setError(null);
      } catch (error: any) {
        console.error("Error fetching product:", error);
        if (error.response?.status === 401) {
          router.push("/admin/login");
        } else if (error.response?.status === 404) {
          setError("Product not found");
        } else {
          setError(error.response?.data?.message || "Failed to load product. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [productId, router, reset]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-red mb-4">{error}</p>
          <Link href="/admin/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!productId) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading product ID...</div>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    const token = localStorage.getItem("admin_token");

    if (!token) {
      alert("Authentication required. Please log in again.");
      router.push("/admin/login");
      return;
    }

    try {
      const response = await axios.put(
        `/api/admin/products/${productId}`,
        {
          ...data,
          price: Math.round(data.price * 100), // Convert to cents
          images,
          category: data.category as "flowers" | "hampers" | "teddy" | "wines" | "chocolates",
          teddy_size: category === "teddy" ? data.teddy_size : null,
          teddy_color: category === "teddy" ? data.teddy_color : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data) {
        alert("Product updated successfully! Changes will appear on the frontend immediately.");
        router.push("/admin/products");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      if (error.response?.status === 401) {
        alert("Authentication failed. Please log in again.");
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      } else {
        const errorMessage = error.response?.data?.message || error.message || "Failed to update product. Please check the console for details.";
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
        formData.append("category", category || product?.category || "flowers");

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
    console.log("addImage called");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-gray-600 mb-4">Product not found</p>
          <Link href="/admin/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white border-b border-brand-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin/products" className="text-brand-gray-600 hover:text-brand-green">
              ← Back to Products
            </Link>
            <h1 className="font-heading font-bold text-xl text-brand-gray-900">Edit Product</h1>
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
            <input id="slug" type="text" {...register("slug")} className="input-field" />
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

          {category === "teddy" && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="teddy_size" className="block text-sm font-medium text-brand-gray-900 mb-2">
                  Size (cm)
                </label>
                <input
                  id="teddy_size"
                  type="number"
                  {...register("teddy_size", { valueAsNumber: true })}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="teddy_color" className="block text-sm font-medium text-brand-gray-900 mb-2">
                  Color
                </label>
                <select id="teddy_color" {...register("teddy_color")} className="input-field">
                  <option value="">Select color</option>
                  <option value="brown">Brown</option>
                  <option value="red">Red</option>
                  <option value="white">White</option>
                  <option value="pink">Pink</option>
                  <option value="blue">Blue</option>
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
                  console.log("Button clicked, isUploading:", isUploading);
                  addImage();
                }}
                disabled={isUploading}
                className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ pointerEvents: isUploading ? 'none' : 'auto' }}
              >
                {isUploading ? "Uploading..." : "+ Upload Image"}
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Product"}
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

