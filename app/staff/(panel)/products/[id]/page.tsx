"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { staffFetch, canStaffDelete } from "@/lib/staff-client";
import type { StaffRole } from "@/lib/staff-auth";
import type { Product } from "@/lib/db";
import ProductImageManager from "@/components/staff/ProductImageManager";
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

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [role, setRole] = useState<StaffRole>("staff");
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<{ id: string; size: string; color: string; price: number; stock: number }[]>([]);
  const [newVariant, setNewVariant] = useState({ size: "", color: "", price: 0, stock: 0 });
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    price: 0,
    sale_price: 0,
    stock: 0,
    sku: "",
    category: "flowers",
    visibility: "published",
    low_stock_threshold: 5,
  });

  useEffect(() => {
    staffFetch<{ role: StaffRole }>("/api/staff/me").then((u) => setRole(u.role));
    staffFetch<Product & { sale_price?: number; visibility?: string; sku?: string; low_stock_threshold?: number }>(
      `/api/staff/products/${id}`
    )
      .then((p) => {
        setForm({
          title: p.title,
          slug: p.slug,
          description: p.description || "",
          short_description: p.short_description || "",
          price: p.price / 100,
          sale_price: (p.sale_price || 0) / 100,
          stock: p.stock ?? 0,
          sku: p.sku || "",
          category: p.category,
          visibility: p.visibility || "published",
          low_stock_threshold: p.low_stock_threshold ?? 5,
        });
        setImages(p.images || []);
      })
      .catch(() => {});
    staffFetch<{ id: string; size: string; color: string; price: number; stock: number }[]>(
      `/api/staff/products/${id}/variants`
    )
      .then(setVariants)
      .catch(() => setVariants([]));
  }, [id]);

  const addVariant = async () => {
    if (!newVariant.size && !newVariant.color) {
      alert("Enter size or color");
      return;
    }
    await staffFetch(`/api/staff/products/${id}/variants`, {
      method: "POST",
      body: JSON.stringify({
        size: newVariant.size || null,
        color: newVariant.color || null,
        price: Math.round(newVariant.price * 100),
        stock: newVariant.stock,
      }),
    });
    const list = await staffFetch<typeof variants>(`/api/staff/products/${id}/variants`);
    setVariants(list);
    setNewVariant({ size: "", color: "", price: 0, stock: 0 });
  };

  const save = async () => {
    await staffFetch(`/api/staff/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: form.title,
        slug: form.slug,
        description: form.description,
        short_description: form.short_description,
        price: Math.round(form.price * 100),
        sale_price: form.sale_price ? Math.round(form.sale_price * 100) : null,
        stock: form.stock,
        sku: form.sku || null,
        category: form.category,
        visibility: form.visibility,
        low_stock_threshold: form.low_stock_threshold,
        images,
      }),
    });
    alert("Product saved — website catalogue will update on next visit.");
  };

  const remove = async () => {
    if (!confirm("Delete this product permanently?")) return;
    await staffFetch(`/api/staff/products/${id}`, { method: "DELETE" });
    router.push("/staff/products");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <StaffPageHeader
        title="Edit product"
        description={form.title || "Product details"}
        actions={
          <Link href="/staff/products" className="staff-btn-secondary text-sm">
            ← Products
          </Link>
        }
      />

      <StaffCard title="Images">
        <ProductImageManager
          images={images}
          category={form.category}
          onChange={setImages}
          isUploading={isUploading}
          onUploadingChange={setIsUploading}
        />
      </StaffCard>

      <StaffCard title="Details">
        <div className="space-y-4">
          <Field label="Title">
            <input className="staff-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Slug">
            <input className="staff-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
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
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Price (KES)">
              <input type="number" className="staff-input" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </Field>
            <Field label="Sale price (KES)">
              <input type="number" className="staff-input" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: Number(e.target.value) })} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Stock">
              <input type="number" className="staff-input" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            </Field>
            <Field label="Low stock at">
              <input type="number" className="staff-input" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: Number(e.target.value) })} />
            </Field>
            <Field label="SKU">
              <input className="staff-input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </Field>
          </div>
          <Field label="Short description">
            <input className="staff-input" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea className="staff-input min-h-[120px] py-2" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Visibility">
            <select className="staff-select w-full" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
        </div>
      </StaffCard>

      <StaffCard title="Variants (size / color)">
        <div className="space-y-4">
          {variants.length > 0 && (
            <ul className="text-sm space-y-2">
              {variants.map((v) => (
                <li key={v.id} className="flex justify-between border-b border-slate-100 pb-2 text-slate-700">
                  <span>
                    {v.size && `${v.size} `}
                    {v.color && v.color}
                  </span>
                  <span className="tabular-nums">
                    KES {(v.price / 100).toLocaleString()} · stock {v.stock}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input className="staff-input" placeholder="Size (25cm)" value={newVariant.size} onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })} />
            <input className="staff-input" placeholder="Color" value={newVariant.color} onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })} />
            <input type="number" className="staff-input" placeholder="Price KES" value={newVariant.price} onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })} />
            <input type="number" className="staff-input" placeholder="Stock" value={newVariant.stock} onChange={(e) => setNewVariant({ ...newVariant, stock: Number(e.target.value) })} />
          </div>
          <button type="button" className="staff-btn-secondary text-sm" onClick={addVariant}>
            Add variant
          </button>
        </div>
      </StaffCard>

      <StaffCard title="Save">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={save} className="staff-btn-primary">
            Save changes
          </button>
          {canStaffDelete(role) && (
            <button type="button" onClick={remove} className="rounded-lg px-4 py-2 text-sm font-medium bg-rose-600 text-white hover:bg-rose-700">
              Delete product
            </button>
          )}
        </div>
      </StaffCard>
    </div>
  );
}
