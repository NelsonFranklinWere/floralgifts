"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { staffFetch } from "@/lib/staff-client";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffCard from "@/components/staff/StaffCard";

const CATEGORIES = ["flowers", "teddy", "hampers", "chocolates", "wines", "cakes", "cards"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    price: 0,
    sale_price: 0,
    category: "flowers",
    stock: 10,
    sku: "",
    visibility: "published",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await staffFetch("/api/staff/products", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          slug,
          price: Math.round(form.price * 100),
          sale_price: form.sale_price ? Math.round(form.sale_price * 100) : null,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      router.push("/staff/products");
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <StaffPageHeader title="Add product" description="Create a new catalogue item." />

      <StaffCard title="Product details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title">
            <input className="staff-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </Field>
          <Field label="Slug">
            <input className="staff-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
          </Field>
          <Field label="Category">
            <select className="staff-select w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (KES)">
              <input type="number" className="staff-input" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </Field>
            <Field label="Sale price (KES)">
              <input type="number" className="staff-input" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: Number(e.target.value) })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Stock">
              <input type="number" className="staff-input" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            </Field>
            <Field label="SKU">
              <input className="staff-input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </Field>
          </div>
          <Field label="Short description">
            <input className="staff-input" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea className="staff-input min-h-[100px] py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          </Field>
          <Field label="Tags (comma-separated)">
            <input className="staff-input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </Field>
          <Field label="Visibility">
            <select className="staff-select w-full" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
          <p className="text-xs text-slate-500">Upload images after saving on the edit page.</p>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="staff-btn-primary">
              {loading ? "Saving…" : "Create product"}
            </button>
            <Link href="/staff/products" className="staff-btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </StaffCard>
    </div>
  );
}
