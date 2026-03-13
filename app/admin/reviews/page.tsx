"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import type { Review } from "@/lib/reviews";

type AdminReview = Review;

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function fetchReviews() {
      try {
        const res = await axios.get<AdminReview[]>("/api/admin/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, [router]);

  const total = reviews.length;
  const verifiedCount = reviews.filter((r) => r.verified).length;

  const handleToggleVerified = async (review: AdminReview) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    const newVal = !review.verified;
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, verified: newVal } : r)),
    );

    try {
      await axios.patch(
        `/api/admin/reviews/${review.id}`,
        { verified: newVal },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSortOrderChange = async (review: AdminReview, value: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    const num = parseInt(value, 10);
    if (Number.isNaN(num)) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, sort_order: num } : r)),
    );

    try {
      await axios.patch(
        `/api/admin/reviews/${review.id}`,
        { sort_order: num },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (review: AdminReview) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    if (
      !confirm(
        `Delete review from "${review.reviewer_name}"? This cannot be undone.`,
      )
    )
      return;

    try {
      await axios.delete(`/api/admin/reviews/${review.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete review.");
    }
  };

  // Simple drag & drop reordering
  const handleDragStart = (id: string) => setDraggingId(id);

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === id) return;
    setReviews((prev) => {
      const currentIndex = prev.findIndex((r) => r.id === draggingId);
      const targetIndex = prev.findIndex((r) => r.id === id);
      if (currentIndex === -1 || targetIndex === -1) return prev;
      const newArr = [...prev];
      const [moved] = newArr.splice(currentIndex, 1);
      newArr.splice(targetIndex, 0, moved);
      return newArr;
    });
  };

  const handleDrop = async () => {
    if (!draggingId) return;
    setDraggingId(null);

    const token = localStorage.getItem("admin_token");
    if (!token) return;

    // Persist new order
    const updates = reviews.map((r, idx) => ({
      id: r.id,
      sort_order: idx + 1,
    }));

    try {
      await axios.patch(
        "/api/admin/reviews",
        { updates },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setReviews((prev) =>
        prev.map((r, idx) => ({ ...r, sort_order: idx + 1 })),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading reviews...</div>
      </div>
    );
  }

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, idx) => (
        <svg
          key={idx}
          className="w-4 h-4"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.287 3.955c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.95 2.675c-.784.57-1.838-.196-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.063 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z"
            fill={idx < rating ? "#FBBF24" : "#E5E7EB"}
          />
        </svg>
      ))}
    </div>
  );

  const categoryLabel = (cat?: string | null) => {
    switch (cat) {
      case "wedding":
        return "Wedding";
      case "birthday":
        return "Birthday & Event";
      case "corporate":
        return "Corporate";
      case "event":
        return "Event";
      default:
        return "General";
    }
  };

  const categoryBg = (cat?: string | null) => {
    switch (cat) {
      case "wedding":
        return "bg-pink-50 text-rose-800";
      case "birthday":
        return "bg-orange-50 text-amber-800";
      case "corporate":
        return "bg-slate-50 text-slate-800";
      case "event":
        return "bg-emerald-50 text-green-800";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white border-b border-brand-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-brand-gray-600 hover:text-brand-green"
              >
                ← Dashboard
              </Link>
              <div>
                <h1 className="font-heading font-bold text-xl text-brand-gray-900">
                  Reviews
                </h1>
                <p className="text-xs text-brand-gray-600">
                  {total} total · {verifiedCount} verified
                </p>
              </div>
            </div>
            <Link
              href="/admin/reviews/new"
              className="btn-primary"
            >
              + Add Review
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-brand-gray-200">
            <thead className="bg-brand-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Avatar
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Reviewer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Sort
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-gray-200">
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-brand-gray-50 cursor-move"
                  draggable
                  onDragStart={() => handleDragStart(review.id)}
                  onDragOver={(e) => handleDragOver(e, review.id)}
                  onDrop={handleDrop}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-[#2C2C2C]"
                      style={{ backgroundColor: review.avatar_colour }}
                    >
                      {review.avatar_initials}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-brand-gray-900">
                    <div>{review.reviewer_name}</div>
                    <div className="text-xs text-brand-gray-500">
                      {review.review_date}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {renderStars(review.rating)}
                  </td>
                  <td className="px-4 py-3 text-sm text-brand-gray-700">
                    {review.review_text.length > 80
                      ? review.review_text.slice(0, 80) + "…"
                      : review.review_text}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${categoryBg(
                        review.category,
                      )}`}
                    >
                      {categoryLabel(review.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleToggleVerified(review)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        review.verified
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-brand-gray-100 text-brand-gray-600 border border-brand-gray-200"
                      }`}
                    >
                      {review.verified ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <input
                      type="number"
                      className="w-16 input-field py-1 px-2 text-sm"
                      value={review.sort_order ?? 0}
                      onChange={(e) =>
                        handleSortOrderChange(review, e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/reviews/${review.id}`}
                      className="text-brand-green hover:text-brand-green/80"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(review)}
                      className="text-brand-red hover:text-brand-red/80"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-brand-gray-500"
                  >
                    No reviews yet. Click &quot;Add Review&quot; to create your
                    first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

