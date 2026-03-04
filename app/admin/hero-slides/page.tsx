"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  position?: number | null;
  created_at?: string;
  updated_at?: string;
}

export default function AdminHeroSlidesPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
    position: "" as string | number | "",
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchSlides = async () => {
    try {
      const response = await axios.get<HeroSlide[]>("/api/admin/hero-slides");
      setSlides(response.data);
    } catch (error) {
      console.error("Error fetching hero slides:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      image: "",
      title: "",
      subtitle: "",
      ctaText: "",
      ctaLink: "",
      position: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("Please log in again.");
        router.push("/admin/login");
        return;
      }

      const payload: any = {
        image: formData.image,
        title: formData.title,
        subtitle: formData.subtitle,
        ctaText: formData.ctaText,
        ctaLink: formData.ctaLink,
      };

      if (formData.position !== "") {
        const parsed = Number(formData.position);
        if (!Number.isNaN(parsed)) {
          payload.position = parsed;
        }
      }

      if (editingSlide) {
        await axios.put(`/api/admin/hero-slides/${editingSlide.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/admin/hero-slides", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowForm(false);
      setEditingSlide(null);
      resetForm();
      fetchSlides();
    } catch (error: any) {
      console.error("Error saving hero slide:", error);
      alert(error.response?.data?.message || "Failed to save hero slide");
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      image: slide.image,
      title: slide.title,
      subtitle: slide.subtitle || "",
      ctaText: slide.cta_text,
      ctaLink: slide.cta_link,
      position: slide.position ?? "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero slide?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("Please log in again.");
        router.push("/admin/login");
        return;
      }

      await axios.delete(`/api/admin/hero-slides/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSlides();
    } catch (error: any) {
      console.error("Error deleting hero slide:", error);
      alert(error.response?.data?.message || "Failed to delete hero slide");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const token = localStorage.getItem("admin_token");

    if (!token) {
      alert("Please log in to upload images.");
      setIsUploading(false);
      return;
    }

    try {
      const file = files[0];
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      // Use generic product upload but category doesn't matter for hero; reuse "flowers"
      formDataObj.append("category", "flowers");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to upload image");
      }

      if (!data?.url) {
        throw new Error("Image uploaded but URL is missing");
      }

      setFormData((prev) => ({ ...prev, image: data.url as string }));
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading hero slides...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white border-b border-brand-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-brand-gray-600 hover:text-brand-green">
                ← Dashboard
              </Link>
              <h1 className="font-heading font-bold text-xl text-brand-gray-900">Hero Carousel</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setEditingSlide(null);
                setShowForm(true);
              }}
              className="btn-primary"
            >
              Add Slide
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Slides table */}
        <div className="card mb-8 overflow-hidden">
          <table className="min-w-full divide-y divide-brand-gray-200">
            <thead className="bg-brand-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  CTA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-gray-200">
              {slides.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-brand-gray-500">
                    No hero slides found. Click &quot;Add Slide&quot; to create the first one.
                  </td>
                </tr>
              ) : (
                slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-brand-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-24 h-16 rounded-md overflow-hidden bg-brand-gray-100">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-brand-gray-900 line-clamp-2">{slide.title}</div>
                      {slide.subtitle && (
                        <div className="text-xs text-brand-gray-500 line-clamp-1">{slide.subtitle}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-gray-600">
                      <div className="font-medium">{slide.cta_text}</div>
                      <div className="text-xs text-brand-gray-500">{slide.cta_link}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-600">
                      {slide.position ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(slide)}
                        className="text-brand-green hover:text-brand-green/80"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(slide.id)}
                        className="text-brand-red hover:text-brand-red/80"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Slide form */}
        {showForm && (
          <div className="card p-6 max-w-3xl">
            <h2 className="font-heading font-bold text-lg mb-4">
              {editingSlide ? "Edit Hero Slide" : "Add Hero Slide"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-gray-700 mb-1">Image URL</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input flex-1"
                    placeholder="https://..."
                    required
                  />
                  <div>
                    <label className="btn-outline cursor-pointer">
                      {isUploading ? "Uploading..." : "Upload"}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray-700 mb-1">Subtitle</label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="input min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="input"
                    placeholder="Shop now"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="input"
                    placeholder="/collections"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                    Position (optional)
                  </label>
                  <input
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="input"
                    placeholder="1, 2, 3..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSlide(null);
                    resetForm();
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingSlide ? "Save Changes" : "Create Slide"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

