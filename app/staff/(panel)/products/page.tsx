"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { staffFetch, canStaffDelete } from "@/lib/staff-client";
type StaffProduct = {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  stock?: number | null;
  visibility?: string;
};
import type { StaffRole } from "@/lib/staff-auth";
import { formatCurrency } from "@/lib/utils";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffLoading from "@/components/staff/StaffLoading";
import { useStaffRealtimeRefresh } from "@/components/staff/StaffRealtimeProvider";
import { Plus, Search, Trash2 } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All categories" },
  { value: "flowers", label: "Flower Bouquets" },
  { value: "teddy", label: "Teddy Bears" },
  { value: "hampers", label: "Gift Hampers" },
  { value: "chocolates", label: "Chocolates" },
  { value: "wines", label: "Wines" },
  { value: "cakes", label: "Cakes" },
  { value: "cards", label: "Cards" },
];

export default function StaffProductsPage() {
  const [products, setProducts] = useState<StaffProduct[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [role, setRole] = useState<StaffRole>("staff");
  const [loading, setLoading] = useState(true);

  const load = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    staffFetch<StaffProduct[]>(`/api/staff/products?${params}`)
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    staffFetch<{ role: StaffRole }>("/api/staff/me").then((u) => setRole(u.role));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      load();
    }, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [category, q]);

  useStaffRealtimeRefresh(() => load(), [category, q], ["sync"]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const bulkAction = async (action: string) => {
    await staffFetch("/api/staff/products", {
      method: "PATCH",
      body: JSON.stringify({ ids: Array.from(selected), action }),
    });
    setSelected(new Set());
    load();
  };

  if (loading && products.length === 0) return <StaffLoading />;

  return (
    <div className="space-y-6">
      <StaffPageHeader
        title="Products"
        description="Manage your catalogue — flowers, teddies, hampers, wines, and more."
        actions={
          <Link href="/staff/products/new" className="staff-btn-primary">
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        }
      />

      <div className="staff-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search by name or slug..."
              className="staff-input pl-10"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select className="staff-select sm:w-48" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        {selected.size > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            <span className="text-sm text-slate-500 self-center mr-2">{selected.size} selected</span>
            <button type="button" onClick={() => bulkAction("publish")} className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-brand-green/15 text-brand-green hover:bg-brand-green/25">
              Publish
            </button>
            <button type="button" onClick={() => bulkAction("unpublish")} className="rounded-lg px-3 py-1.5 text-xs font-semibold bg-brand-gray-100 text-brand-gray-800 hover:bg-brand-gray-200">
              Unpublish
            </button>
            {canStaffDelete(role) && (
              <button type="button" onClick={() => bulkAction("delete")} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold bg-brand-red/10 text-brand-red hover:bg-brand-red/20">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            )}
          </div>
        )}
      </div>

      <div className="staff-table-wrap">
        <table>
          <thead>
            <tr>
              <th className="w-10"></th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <input type="checkbox" className="rounded border-brand-gray-200 text-brand-green accent-brand-green" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                </td>
                <td className="font-medium text-slate-900">{p.title}</td>
                <td className="capitalize text-slate-500">{p.category}</td>
                <td className="font-semibold tabular-nums">{formatCurrency(p.price)}</td>
                <td>
                  {(p.stock ?? 0) <= 5 ? (
                    <span className="staff-pill-warning">{p.stock ?? 0}</span>
                  ) : (
                    <span className="text-slate-600">{p.stock ?? "—"}</span>
                  )}
                </td>
                <td>
                  <span className="staff-pill-neutral">{(p as { visibility?: string }).visibility || "published"}</span>
                </td>
                <td>
                  <Link href={`/staff/products/${p.id}`} className="staff-link text-sm">
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center py-12 text-slate-500 text-sm">No products found.</p>
        )}
      </div>
    </div>
  );
}
