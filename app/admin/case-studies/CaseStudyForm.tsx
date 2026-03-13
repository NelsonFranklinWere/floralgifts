"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type CaseStudyFormValues = {
  id?: string;
  title: string;
  slug: string;
  category: "wedding" | "birthday" | "event" | "corporate";
  client_first_name: string;
  event_type: string;
  event_date: string;
  location: string;
  guest_count: string;
  brief: string;
  challenge: string;
  solution: string;
  result: string;
  client_quote: string;
  flowers_used: string[];
  colour_palette: { name: string; hex: string }[];
  hero_image_url: string;
  gallery_images: string[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  published: boolean;
  featured: boolean;
};

const EMPTY_FORM: CaseStudyFormValues = {
  title: "",
  slug: "",
  category: "wedding",
  client_first_name: "",
  event_type: "",
  event_date: "",
  location: "",
  guest_count: "",
  brief: "",
  challenge: "",
  solution: "",
  result: "",
  client_quote: "",
  flowers_used: [],
  colour_palette: [],
  hero_image_url: "",
  gallery_images: [],
  seo_title: "",
  seo_description: "",
  seo_keywords: [],
  published: false,
  featured: false,
};

type Props = {
  initialId?: string;
};

export default function CaseStudyForm({ initialId }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<CaseStudyFormValues>(EMPTY_FORM);
  const [loading, setLoading] = useState<boolean>(!!initialId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugLocked, setSlugLocked] = useState(false);

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("admin_token")
      : null;

  useEffect(() => {
    if (!initialId) {
      return;
    }
    const tokenLocal = window.localStorage.getItem("admin_token");
    if (!tokenLocal) {
      router.push("/admin/login");
      return;
    }
    async function fetchExisting() {
      try {
        const res = await axios.get(`/api/admin/case-studies/${initialId}`, {
          headers: { Authorization: `Bearer ${tokenLocal}` },
        });
        const data = res.data;
        setValues({
          id: data.id,
          title: data.title ?? "",
          slug: data.slug ?? "",
          category: data.category ?? "wedding",
          client_first_name: data.client_first_name ?? "",
          event_type: data.event_type ?? "",
          event_date: data.event_date ?? "",
          location: data.location ?? "",
          guest_count: data.guest_count ?? "",
          brief: data.brief ?? "",
          challenge: data.challenge ?? "",
          solution: data.solution ?? "",
          result: data.result ?? "",
          client_quote: data.client_quote ?? "",
          flowers_used: data.flowers_used ?? [],
          colour_palette: data.colour_palette ?? [],
          hero_image_url: data.hero_image_url ?? "",
          gallery_images: data.gallery_images ?? [],
          seo_title: data.seo_title ?? "",
          seo_description: data.seo_description ?? "",
          seo_keywords: data.seo_keywords ?? [],
          published: data.published ?? false,
          featured: data.featured ?? false,
        });
        setSlugLocked(true);
      } catch (err) {
        console.error(err);
        setError("Failed to load case study.");
      } finally {
        setLoading(false);
      }
    }
    fetchExisting();
  }, [initialId, router]);

  const handleChange = (
    field: keyof CaseStudyFormValues,
    value: string | boolean,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value: string) => {
    setValues((prev) => ({
      ...prev,
      title: value,
      slug:
        !slugLocked && !prev.slug
          ? value
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "")
          : prev.slug,
    }));
  };

  const handleAddTag = (field: "flowers_used" | "seo_keywords", value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setValues((prev) => ({
      ...prev,
      [field]: Array.from(new Set([...(prev[field] as string[]), trimmed])),
    }));
  };

  const handleRemoveTag = (field: "flowers_used" | "seo_keywords", value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((t) => t !== value),
    }));
  };

  const handleAddColour = () => {
    setValues((prev) => ({
      ...prev,
      colour_palette: [
        ...prev.colour_palette,
        { name: "New Colour", hex: "#F9D5E5" },
      ],
    }));
  };

  const handleUpdateColour = (
    index: number,
    field: "name" | "hex",
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      colour_palette: prev.colour_palette.map((c, i) =>
        i === index ? { ...c, [field]: value } : c,
      ),
    }));
  };

  const handleRemoveColour = (index: number) => {
    setValues((prev) => ({
      ...prev,
      colour_palette: prev.colour_palette.filter((_, i) => i !== index),
    }));
  };

  const handleAddGalleryUrl = () => {
    const url = prompt("Paste image URL from Supabase storage");
    if (!url) return;
    setValues((prev) => ({
      ...prev,
      gallery_images: [...prev.gallery_images, url],
    }));
  };

  const handleRemoveGalleryImage = (url: string) => {
    setValues((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((u) => u !== url),
    }));
  };

  const seoTitleCount = values.seo_title.length;
  const seoDescriptionCount = values.seo_description.length;

  const snippetTitle = useMemo(() => {
    const t = values.seo_title || values.title;
    return t.length > 60 ? t.slice(0, 57) + "…" : t;
  }, [values.seo_title, values.title]);

  const snippetDescription = useMemo(() => {
    const d =
      values.seo_description || values.brief || "Floral Whispers Gifts, Nairobi.";
    return d.length > 155 ? d.slice(0, 152) + "…" : d;
  }, [values.seo_description, values.brief]);

  const handleSubmit = async (publish: boolean) => {
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...values,
        published: publish ? true : values.published,
      };
      const method = values.id ? "patch" : "post";
      const url = values.id
        ? `/api/admin/case-studies/${values.id}`
        : "/api/admin/case-studies";
      const res = await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const saved = res.data;
      if (!values.id && saved.id) {
        router.replace(`/admin/case-studies/${saved.id}`);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to save case study. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="text-brand-gray-600">Loading case study…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-brand-gray-900">
            {values.id ? "Edit Case Study" : "New Case Study"}
          </h1>
          <p className="text-sm text-brand-gray-600">
            Tell the story behind your flowers — weddings, birthdays, events and
            corporate work.
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
          Basics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Title*
            </label>
            <input
              type="text"
              className="input-field"
              value={values.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Sarah & Daniel's Blush Garden Wedding"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-gray-500">
                /case-studies/
              </span>
              <input
                type="text"
                className="input-field flex-1"
                value={values.slug}
                onChange={(e) => {
                  setSlugLocked(true);
                  handleChange("slug", e.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Category*
            </label>
            <select
              className="input-field"
              value={values.category}
              onChange={(e) =>
                handleChange(
                  "category",
                  e.target.value as CaseStudyFormValues["category"],
                )
              }
            >
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday &amp; Event</option>
              <option value="event">Event</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Client First Name
            </label>
            <input
              type="text"
              className="input-field"
              value={values.client_first_name}
              onChange={(e) =>
                handleChange("client_first_name", e.target.value)
              }
              placeholder="e.g. Sarah"
            />
            <p className="mt-1 text-xs text-brand-gray-500">
              First name only — shown as &quot;Sarah&apos;s Wedding&quot;.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Event Type
            </label>
            <input
              type="text"
              className="input-field"
              value={values.event_type}
              onChange={(e) => handleChange("event_type", e.target.value)}
              placeholder="e.g. Garden Wedding Reception"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Event Date
            </label>
            <input
              type="text"
              className="input-field"
              value={values.event_date}
              onChange={(e) => handleChange("event_date", e.target.value)}
              placeholder="e.g. February 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Location
            </label>
            <input
              type="text"
              className="input-field"
              value={values.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g. Karen, Nairobi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Guest Count
            </label>
            <input
              type="text"
              className="input-field"
              value={values.guest_count}
              onChange={(e) => handleChange("guest_count", e.target.value)}
              placeholder="e.g. 150 guests"
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white rounded-lg shadow-sm border border-brand-gray-200 p-5 space-y-4">
        <h2 className="font-heading text-lg text-brand-gray-900">
          The Story
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              What the Client Asked For (brief)*
            </label>
            <textarea
              className="input-field min-h-[80px]"
              value={values.brief}
              onChange={(e) => handleChange("brief", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              The Challenge
            </label>
            <textarea
              className="input-field min-h-[100px]"
              value={values.challenge}
              onChange={(e) => handleChange("challenge", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              How We Brought It To Life (solution)
            </label>
            <textarea
              className="input-field min-h-[100px]"
              value={values.solution}
              onChange={(e) => handleChange("solution", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              The Result
            </label>
            <textarea
              className="input-field min-h-[100px]"
              value={values.result}
              onChange={(e) => handleChange("result", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Client Quote (optional)
            </label>
            <textarea
              className="input-field min-h-[80px]"
              value={values.client_quote}
              onChange={(e) => handleChange("client_quote", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Floral details */}
      <section className="bg-white rounded-lg shadow-sm border border-brand-gray-200 p-5 space-y-4">
        <h2 className="font-heading text-lg text-brand-gray-900">
          Floral Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Flowers &amp; Foliage Used
            </label>
            <TagInput
              values={values.flowers_used}
              placeholder="Type a flower and press Enter"
              onAdd={(val) => handleAddTag("flowers_used", val)}
              onRemove={(val) => handleRemoveTag("flowers_used", val)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-2">
              Colour Palette
            </label>
            <div className="space-y-3">
              {values.colour_palette.map((colour, index) => (
                <div
                  key={`${colour.name}-${index}`}
                  className="flex items-center gap-3"
                >
                  <input
                    type="color"
                    className="h-9 w-9 rounded-full border border-brand-gray-200"
                    value={colour.hex}
                    onChange={(e) =>
                      handleUpdateColour(index, "hex", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="input-field flex-1"
                    value={colour.name}
                    onChange={(e) =>
                      handleUpdateColour(index, "name", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveColour(index)}
                    className="text-xs text-brand-red hover:text-brand-red/80"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddColour}
                className="text-xs text-brand-green hover:text-brand-green/80"
              >
                + Add Colour
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="bg-white rounded-lg shadow-sm border border-brand-gray-200 p-5 space-y-4">
        <h2 className="font-heading text-lg text-brand-gray-900">
          Images
        </h2>
        <p className="text-xs text-brand-gray-600">
          Upload images to your Supabase storage bucket and paste the public
          URLs here. You can refine this later with a drag-and-drop uploader.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              Hero Image URL*
            </label>
            <input
              type="text"
              className="input-field"
              value={values.hero_image_url}
              onChange={(e) => handleChange("hero_image_url", e.target.value)}
              placeholder="https://...hero.webp"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-brand-gray-800">
                Gallery Images
              </label>
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="text-xs text-brand-green hover:text-brand-green/80"
              >
                + Add Image URL
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-dashed border-brand-gray-200 rounded-md p-2">
              {values.gallery_images.map((url) => (
                <div
                  key={url}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(url)}
                    className="text-brand-red"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {values.gallery_images.length === 0 && (
                <p className="text-xs text-brand-gray-500">
                  No gallery images yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white rounded-lg shadow-sm border border-brand-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg text-brand-gray-900">
            SEO Settings
          </h2>
          <p className="text-xs text-brand-gray-500">
            Optional — will auto-fill from the story if left empty.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              SEO Title
            </label>
            <input
              type="text"
              className="input-field"
              value={values.seo_title}
              onChange={(e) => handleChange("seo_title", e.target.value)}
            />
            <div className="mt-1 text-xs text-brand-gray-500 flex justify-between">
              <span>Shown as the page title in Google results.</span>
              <span
                className={
                  seoTitleCount > 60 ? "text-brand-red font-medium" : ""
                }
              >
                {seoTitleCount} / 60
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              SEO Description
            </label>
            <textarea
              className="input-field min-h-[80px]"
              value={values.seo_description}
              onChange={(e) =>
                handleChange("seo_description", e.target.value)
              }
            />
            <div className="mt-1 text-xs text-brand-gray-500 flex justify-between">
              <span>Short summary shown under the title in Google.</span>
              <span
                className={
                  seoDescriptionCount > 155 ? "text-brand-red font-medium" : ""
                }
              >
                {seoDescriptionCount} / 155
              </span>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-brand-gray-800 mb-1">
              SEO Keywords
            </label>
            <TagInput
              values={values.seo_keywords}
              placeholder="e.g. wedding flowers Nairobi"
              onAdd={(val) => handleAddTag("seo_keywords", val)}
              onRemove={(val) => handleRemoveTag("seo_keywords", val)}
            />
          </div>
        </div>

        {/* Google snippet preview */}
        <div className="mt-4 border border-brand-gray-200 rounded-md p-4 bg-brand-gray-50">
          <div className="text-xs text-brand-gray-500 mb-2">
            Google result preview
          </div>
          <div className="text-[11px] text-[#1a0dab] mb-0.5">
            floralwhispersgifts.co.ke
          </div>
          <div className="text-sm text-[#1a0dab] leading-snug">
            {snippetTitle}
          </div>
          <div className="text-xs text-[#4d5156] mt-1 leading-snug">
            {snippetDescription}
          </div>
        </div>
      </section>

      {/* Sticky publishing bar */}
      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-brand-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.published}
                onChange={(e) => handleChange("published", e.target.checked)}
              />
              <span className="font-medium">
                {values.published ? "Live — visible on website" : "Draft — not visible to public"}
              </span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(e) => handleChange("featured", e.target.checked)}
              />
              <span>Show on homepage</span>
            </label>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 rounded-md border border-[#D4617A] text-[#D4617A] text-sm font-medium bg-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 rounded-md bg-[#D4617A] text-white text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save & Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type TagInputProps = {
  values: string[];
  placeholder?: string;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
};

function TagInput({ values, placeholder, onAdd, onRemove }: TagInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) {
        onAdd(input.trim());
        setInput("");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center px-3 py-1 rounded-full bg-brand-gray-100 text-xs text-brand-gray-800"
          >
            {value}
            <button
              type="button"
              onClick={() => onRemove(value)}
              className="ml-2 text-brand-gray-500 hover:text-brand-red"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="input-field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}

