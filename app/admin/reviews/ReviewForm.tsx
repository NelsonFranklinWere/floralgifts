"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Review } from "@/lib/reviews";

type Props = { id?: string };

const AVATAR_COLOURS = [
  "#F9D5E5",
  "#BBF7D0",
  "#DDD6FE",
  "#FED7AA",
  "#FDE68A",
  "#E0F2FE",
];

type FormState = {
  reviewer_name: string;
  avatar_initials: string;
  avatar_colour: string;
  rating: number;
  review_text: string;
  review_date: string;
  category: string;
  verified: boolean;
  sort_order: number;
};

const EMPTY: FormState = {
  reviewer_name: "",
  avatar_initials: "",
  avatar_colour: AVATAR_COLOURS[0],
  rating: 5,
  review_text: "",
  review_date: "",
  category: "general",
  verified: true,
  sort_order: 0,
};

export default function ReviewForm({ id }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    if (!id) return;

    async function fetchReview() {
      try {
        const res = await axios.get<Review>(`/api/admin/reviews/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const r = res.data;
        setValues({
          reviewer_name: r.reviewer_name,
          avatar_initials: r.avatar_initials,
          avatar_colour: r.avatar_colour,
          rating: r.rating,
          review_text: r.review_text,
          review_date: r.review_date,
          category: r.category || "general",
          verified: r.verified,
          sort_order: r.sort_order ?? 0,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load review.");
      } finally {
        setLoading(false);
      }
    }

    fetchReview();
  }, [id, router]);

  const autoInitialsFromName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
    return (
      (parts[0][0] ?? "").toUpperCase() +
      (parts[parts.length - 1][0] ?? "").toUpperCase()
    ).slice(0, 2);
  };

  const handleNameChange = (value: string) => {
    setValues((prev) => ({
      ...prev,
      reviewer_name: value,
      avatar_initials:
        prev.avatar_initials.trim().length === 0
          ? autoInitialsFromName(value)
          : prev.avatar_initials,
    }));
  };

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = values;
      if (id) {
        await axios.put(`/api/admin/reviews/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const res = await axios.post("/api/admin/reviews", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const created = res.data as Review;
        router.replace(`/admin/reviews/${created.id}`);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to save review. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-brand-gray-600">Loading review…</div>
      </div>
    );
  }

  const charCount = values.review_text.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-brand-gray-900">
            {id ? "Edit Review" : "New Review"}
          </h1>
          <p className="text-sm text-brand-gray-600">
            Manage the reviews that appear in your homepage Google-style carousel.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-brand-red/10 border border-brand-red rounded-md px-4 py-3 text-sm text-brand-red">
          {error}
        </div>
      )}

      {/* Basics */}
      <section className="bg-white rounded-lg shadow-sm border border-brand-gray-200 p-5 space-y-4">
        <h2 className="font-heading text-lg text-brand-gray-900">
          Reviewer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Reviewer Name*
            </label>
            <input
              type="text"
              className="input-field"
              value={values.reviewer_name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Sarah M."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Avatar Initials*
            </label>
            <input
              type="text"
              maxLength={2}
              className="input-field"
              value={values.avatar_initials}
              onChange={(e) =>
                handleChange("avatar_initials", e.target.value.toUpperCase())
              }
              placeholder="SM"
              required
            />
            <p className="mt-1 text-xs text-brand-gray-500">
              Auto-fills from the name above. Max 2 characters.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-2">
              Avatar Background Colour*
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_COLOURS.map((hex) => {
                const selected = values.avatar_colour === hex;
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => handleChange("avatar_colour", hex)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selected
                        ? "border-[#D4617A]"
                        : "border-transparent hover:border-brand-gray-300"
                    }`}
                    style={{ backgroundColor: hex }}
                    aria-label={hex}
                  />
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Review Date*
            </label>
            <input
              type="text"
              className="input-field"
              value={values.review_date}
              onChange={(e) => handleChange("review_date", e.target.value)}
              placeholder="e.g. February 2026"
              required
            />
          </div>
        </div>
      </section>

      {/* Rating & category */}
      <section className="bg-white rounded-lg shadow-sm border border-brand-gray-200 p-5 space-y-4">
        <h2 className="font-heading text-lg text-brand-gray-900">
          Rating &amp; Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Star Rating*
            </label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => {
                const n = idx + 1;
                const active = values.rating >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleChange("rating", n)}
                    className="p-0.5"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.287 3.955c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.95 2.675c-.784.57-1.838-.196-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.063 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z"
                        fill={active ? "#FBBF24" : "#E5E7EB"}
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Category
            </label>
            <select
              className="input-field"
              value={values.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="general">General</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday &amp; Event</option>
              <option value="corporate">Corporate</option>
              <option value="event">Event</option>
            </select>
          </div>
        </div>
      </section>

      {/* Review text */}
      <section className="bg-white rounded-lg shadow-sm border border-brand-gray-200 p-5 space-y-4">
        <h2 className="font-heading text-lg text-brand-gray-900">
          Review Text
        </h2>
        <div>
          <label className="block text-sm font-medium text-brand-gray-800 mb-1">
            Review Text*
          </label>
          <textarea
            className="input-field min-h-[120px]"
            value={values.review_text}
            onChange={(e) => handleChange("review_text", e.target.value)}
            required
          />
          <div className="mt-1 text-xs text-brand-gray-500 flex justify-between">
            <span>
              Paste the review exactly as written on Google. Minor typo fixes
              are okay.
            </span>
            <span>{charCount} characters</span>
          </div>
        </div>
      </section>

      {/* Visibility & sort */}
      <section className="bg-white rounded-lg shadow-sm border border-brand-gray-200 p-5 space-y-4">
        <h2 className="font-heading text-lg text-brand-gray-900">
          Visibility
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.verified}
                onChange={(e) => handleChange("verified", e.target.checked)}
              />
              <span className="font-medium">Show on website</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              className="input-field w-24"
              value={values.sort_order}
              onChange={(e) =>
                handleChange("sort_order", parseInt(e.target.value, 10) || 0)
              }
            />
            <p className="mt-1 text-xs text-brand-gray-500">
              Lower numbers appear first in the carousel.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-brand-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <p className="text-xs text-brand-gray-500">
            Verified reviews appear in the homepage Google-style carousel.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/admin/reviews")}
              className="px-4 py-2 rounded-md border border-brand-gray-200 text-sm text-brand-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-[#D4617A] text-white text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Review"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

