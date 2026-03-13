"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

type CaseStudyAdmin = {
  id: string;
  title: string;
  slug: string;
  category: "wedding" | "birthday" | "event" | "corporate";
  hero_image_url?: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
};

const categoryLabel: Record<CaseStudyAdmin["category"], string> = {
  wedding: "Wedding",
  birthday: "Birthday & Event",
  event: "Event",
  corporate: "Corporate",
};

export default function AdminCaseStudiesPage() {
  const [items, setItems] = useState<CaseStudyAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("admin_token")
      : null;

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function fetchData() {
      try {
        const res = await axios.get<CaseStudyAdmin[]>("/api/admin/case-studies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load case studies.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const total = items.length;
  const publishedCount = items.filter((i) => i.published).length;

  const updateFlag = async (
    id: string,
    field: "published" | "featured",
    value: boolean,
  ) => {
    if (!token) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
    try {
      await axios.patch(
        `/api/admin/case-studies/${id}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!token) return;
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`/api/admin/case-studies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete case study.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading case studies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-bold text-2xl text-brand-gray-900">
              Case Studies
            </h1>
            <p className="text-sm text-brand-gray-600">
              {total} total · {publishedCount} published
            </p>
          </div>
          <Link
            href="/admin/case-studies/new"
            className="inline-flex items-center px-4 py-2 rounded-md bg-[#D4617A] text-white text-sm font-medium shadow-sm hover:bg-[#c1546f]"
          >
            + Add New Case Study
          </Link>
        </div>

        {error && (
          <div className="mb-4 text-sm text-brand-red bg-brand-red/10 border border-brand-red rounded-md px-4 py-3">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-brand-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-brand-gray-200">
            <thead className="bg-brand-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Case Study
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-brand-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-brand-gray-100 flex-shrink-0">
                        {item.hero_image_url && (
                          <Image
                            src={item.hero_image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-brand-gray-900 line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-xs text-brand-gray-500">
                          /case-studies/{item.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-gray-700">
                    {categoryLabel[item.category]}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      type="button"
                      onClick={() =>
                        updateFlag(item.id, "published", !item.published)
                      }
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.published
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-brand-gray-100 text-brand-gray-600 border border-brand-gray-200"
                      }`}
                    >
                      {item.published ? "Live" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      type="button"
                      onClick={() =>
                        updateFlag(item.id, "featured", !item.featured)
                      }
                      className="text-yellow-400 hover:text-yellow-500 text-lg"
                      aria-label={
                        item.featured ? "Unset featured" : "Set as featured"
                      }
                    >
                      {item.featured ? "★" : "☆"}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-gray-600">
                    {new Date(item.created_at).toLocaleDateString("en-KE")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/case-studies/${item.id}`}
                      className="text-brand-green hover:text-brand-green/80"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="text-brand-red hover:text-brand-red/80"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-brand-gray-500"
                  >
                    No case studies yet. Click &quot;Add New Case Study&quot; to
                    create your first story.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

