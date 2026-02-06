"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import type { Product } from "@/lib/db";
import { getSubcategoriesForCategory } from "@/lib/subcategories";

const schema = yup.object({
  slug: yup.string().required("Slug is required").matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  title: yup.string().required("Title is required"),
  short_description: yup.string().required("Short description is required"),
  description: yup.string().required("Description is required"),
  price: yup.number().required("Price is required").min(1, "Price must be greater than 0"),
  category: yup.string().oneOf(["flowers", "hampers", "teddy", "wines", "chocolates", "cards"]).required("Category is required"),
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
  const [includedItems, setIncludedItems] = useState<Array<{ name: string; qty: number; note?: string }>>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
  });

  const category = watch("category");
  const subcategory = watch("subcategory");

  // Reset subcategory when category changes (only show for flowers and teddy)
  const handleCategoryChange = (newCategory: string) => {
    setValue("category", newCategory as any);
    // Clear subcategory when switching categories
    setValue("subcategory", null);
    setSelectedSubcategories([]);
    // Clear color when switching away from teddy
    if (newCategory !== "teddy") {
      setValue("teddy_color", null);
      setSelectedColors([]);
    }
  };

  const handleSubcategoryToggle = (subcat: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcat) 
        ? prev.filter(s => s !== subcat)
        : [...prev, subcat]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

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
        setIncludedItems(prod.included_items || []);
        
        // Load subcategories: single for teddy bears, multiple for flowers
        const validSubcats = getSubcategoriesForCategory(prod.category as "flowers" | "teddy");
        const subcatsFromTags = (prod.tags || []).filter((tag: string) => validSubcats.includes(tag));
        
        if (prod.category === "teddy") {
          // Teddy bears: use first valid subcategory from tags or subcategory field
          const singleSubcat = prod.subcategory && validSubcats.includes(prod.subcategory) 
            ? [prod.subcategory] 
            : subcatsFromTags.length > 0 
            ? [subcatsFromTags[0]] 
            : [];
          setSelectedSubcategories(singleSubcat);
          
          // Load colors from tags (color:*) or from teddy_color field
          const colorTags = (prod.tags || []).filter((tag: string) => tag.startsWith("color:"));
          const colorsFromTags = colorTags.map((tag: string) => tag.replace("color:", ""));
          const colorFromField = prod.teddy_color ? [prod.teddy_color] : [];
          setSelectedColors([...new Set([...colorsFromTags, ...colorFromField])]);
        } else {
          // Flowers: use all valid subcategories from tags (multiple selection)
          const singleSubcat = prod.subcategory && validSubcats.includes(prod.subcategory) ? [prod.subcategory] : [];
          setSelectedSubcategories([...new Set([...subcatsFromTags, ...singleSubcat])]);
        }
        
        reset({
          slug: prod.slug,
          title: prod.title,
          short_description: prod.short_description,
          description: prod.description,
          price: prod.price / 100, // Convert from cents
          category: prod.category,
          subcategory: prod.subcategory || null,
          teddy_size: prod.teddy_size,
          teddy_color: prod.teddy_color,
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
    // Validate colors for teddy bears
    if (category === "teddy" && selectedColors.length === 0) {
      alert("Please select at least one color for teddy bears.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("admin_token");

    if (!token) {
      alert("Authentication required. Please log in again.");
      router.push("/admin/login");
      return;
    }

    try {
      // Handle subcategories: single for teddy bears, multiple for flowers
      let subcategoryValue: string | null = null;
      let tagsArray: string[] = [];
      
      if (category === "teddy") {
        // Teddy bears: single selection only
        subcategoryValue = selectedSubcategories.length > 0 ? selectedSubcategories[0] : null;
        tagsArray = subcategoryValue ? [subcategoryValue] : [];
      } else if (category === "flowers") {
        // Flowers: multiple selection allowed
        tagsArray = selectedSubcategories.length > 0 ? selectedSubcategories : [];
        subcategoryValue = tagsArray.length > 0 ? tagsArray[0] : null; // Keep first for backward compatibility
      }

      // Handle colors: store first color for backward compatibility, all colors in tags
      let teddyColorValue: string | null = null;
      if (category === "teddy") {
        teddyColorValue = selectedColors.length > 0 ? selectedColors[0] : null;
        // Add color tags to tags array
        const colorTags = selectedColors.map(c => `color:${c}`);
        tagsArray = [...tagsArray, ...colorTags];
      }

      const response = await axios.put(
        `/api/admin/products/${productId}`,
        {
          ...data,
          price: Math.round(data.price * 100), // Convert to cents
          images,
          tags: tagsArray,
          category: data.category as "flowers" | "hampers" | "teddy" | "wines" | "chocolates" | "cards",
          subcategory: subcategoryValue,
          teddy_size: category === "teddy" ? data.teddy_size : null,
          teddy_color: teddyColorValue,
          included_items: category === "hampers" && includedItems.length > 0 ? includedItems : null,
          upsells: null,
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

    const currentCategory = category || product?.category;
    if (!currentCategory) {
      alert("Please select a category first.");
      return;
    }

    setIsUploading(true);
    const token = localStorage.getItem("admin_token");

    if (!token) {
      alert("Please log in to upload images.");
      setIsUploading(false);
      return;
    }

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("category", currentCategory);

          let response;
          try {
            response = await fetch("/api/admin/upload", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });
          } catch (fetchError: any) {
            console.error("Network error details:", {
              error: fetchError,
              message: fetchError?.message,
              name: fetchError?.name,
              stack: fetchError?.stack
            });
            
            // More specific error messages
            if (fetchError?.message?.includes("Failed to fetch") || fetchError?.name === "TypeError") {
              throw new Error("Cannot connect to server. Please make sure the app is running and try again.");
            }
            if (fetchError?.message?.includes("network")) {
              throw new Error("Network connection failed. Please check your internet connection.");
            }
            throw new Error(fetchError?.message || "Upload failed. Please try again.");
          }

          // Always try to parse as JSON first
          let data;
          try {
            const contentType = response.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
              const text = await response.text();
              try {
                data = JSON.parse(text);
              } catch (parseError) {
                console.error("JSON parse error:", parseError, "Response:", text);
                throw new Error("Server response error. Please try again.");
              }
            } else {
              const text = await response.text();
              console.error("Non-JSON response:", text);
              throw new Error("Server error. Please try again.");
            }
          } catch (parseError: any) {
            throw new Error(parseError.message || "Error processing server response.");
          }

          if (!response.ok) {
            const errorMessage = data?.message || `Upload failed (${response.status})`;
            throw new Error(errorMessage);
          }

          if (!data || !data.url) {
            throw new Error("Image uploaded but URL is missing. Please try again.");
          }

          return data.url as string;
        } catch (fileError: any) {
          console.error("File upload error:", fileError);
          throw fileError;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage = error.message || "Failed to upload image. Please try again.";
      alert(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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
                <option value="cards">Gift Cards</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-brand-red">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Subcategory Field - appears after category is selected (only for flowers and teddy bears) */}
          {category && (category === "flowers" || category === "teddy") && (
            <div>
              {category === "teddy" ? (
                // Dropdown for teddy bears (single selection)
                <div>
                  <label htmlFor="teddy_size_select" className="block text-sm font-medium text-brand-gray-900 mb-2">
                    Size <span className="text-brand-red"> *</span>
                  </label>
                  <select
                    id="teddy_size_select"
                    value={selectedSubcategories[0] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedSubcategories(value ? [value] : []);
                      setValue("subcategory", value || null);
                    }}
                    className="input-field"
                  >
                    <option value="">Select size</option>
                    {getSubcategoriesForCategory("teddy").map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                  {category === "teddy" && selectedSubcategories.length === 0 && (
                    <p className="mt-1 text-sm text-brand-red">Size is required for teddy bears</p>
                  )}
                </div>
              ) : (
                // Checkboxes for flowers (multiple selection)
                <div>
                  <label className="block text-sm font-medium text-brand-gray-900 mb-2">
                    Subcategory
                    <span className="text-brand-gray-500 text-xs ml-2">(Select multiple if product fits multiple categories)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border border-brand-gray-300 rounded-lg bg-white max-h-48 overflow-y-auto">
                    {getSubcategoriesForCategory("flowers").map((subcat) => (
                      <label key={subcat} className="flex items-center space-x-2 cursor-pointer hover:bg-brand-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedSubcategories.includes(subcat)}
                          onChange={() => handleSubcategoryToggle(subcat)}
                          className="w-4 h-4 text-brand-green border-brand-gray-300 rounded focus:ring-brand-green"
                        />
                        <span className="text-sm text-brand-gray-900">{subcat}</span>
                      </label>
                    ))}
                  </div>
                  {selectedSubcategories.length > 0 && (
                    <p className="mt-2 text-xs text-brand-gray-600">
                      Selected: {selectedSubcategories.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}


          {/* Color - Show for teddy bears (required), checkboxes for multiple selection */}
          {category === "teddy" && (
            <div>
              <label className="block text-sm font-medium text-brand-gray-900 mb-2">
                Colors <span className="text-brand-red">*</span>
                <span className="text-brand-gray-500 text-xs ml-2">(Select all available colors)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border border-brand-gray-300 rounded-lg bg-white">
                {TEDDY_COLORS.map(color => (
                  <label key={color} className="flex items-center space-x-2 cursor-pointer hover:bg-brand-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => handleColorToggle(color)}
                      className="w-4 h-4 text-brand-green border-brand-gray-300 rounded focus:ring-brand-green"
                    />
                    <span className="text-sm text-brand-gray-900 capitalize">{color}</span>
                  </label>
                ))}
              </div>
              {selectedColors.length > 0 && (
                <p className="mt-2 text-xs text-brand-gray-600">
                  Selected: {selectedColors.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")}
                </p>
              )}
              {category === "teddy" && selectedColors.length === 0 && (
                <p className="mt-1 text-sm text-brand-red">At least one color is required for teddy bears</p>
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
                  <div className="relative w-16 h-16 rounded border border-brand-gray-200 overflow-hidden bg-brand-gray-100 flex items-center justify-center">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                      onLoad={() => console.log("Image loaded successfully:", url)}
                      onError={(e) => {
                        console.error("Image failed to load:", url);
                        const target = e.target as HTMLImageElement;
                        const parent = target.parentElement;
                        if (parent) {
                          target.style.display = 'none';
                          const existingError = parent.querySelector('.image-error');
                          if (!existingError) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'image-error text-xs text-brand-red text-center p-1 break-all';
                            errorDiv.textContent = 'Load Error';
                            errorDiv.title = url;
                            parent.appendChild(errorDiv);
                          }
                        }
                      }}
                      loading="lazy"
                    />
                  </div>
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
                multiple
                disabled={isUploading}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddImageClick();
                }}
                disabled={isUploading}
                className="btn-outline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "+ Upload Image from Phone"}
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

