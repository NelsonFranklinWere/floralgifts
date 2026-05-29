"use client";

import { useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffCard from "@/components/staff/StaffCard";
import { Plus, X } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  usage_count: number;
  usage_limit: number | null;
  is_active: boolean;
  expires_at: string | null;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 10,
    min_order_value: 0,
    usage_limit: 100,
    expires_at: "",
  });

  const load = () => staffFetch<Coupon[]>("/api/staff/coupons").then(setCoupons).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await staffFetch("/api/staff/coupons", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        discount_value: form.discount_type === "percentage" ? form.discount_value : form.discount_value * 100,
        min_order_value: form.min_order_value * 100,
        expires_at: form.expires_at || null,
      }),
    });
    setOpen(false);
    load();
  };

  const toggle = async (id: string, is_active: boolean) => {
    await staffFetch("/api/staff/coupons", { method: "PATCH", body: JSON.stringify({ id, is_active }) });
    load();
  };

  return (
    <div className="space-y-6">
      <StaffPageHeader
        title="Coupons"
        description="Discount codes for checkout."
        actions={
          <button type="button" onClick={() => setOpen(true)} className="staff-btn-primary">
            <Plus className="h-4 w-4" />
            Create coupon
          </button>
        }
      />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="staff-card w-full max-w-md p-6 relative">
            <button type="button" className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-heading font-semibold text-lg text-slate-900 mb-4">New coupon</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                <input className="staff-input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select className="staff-select w-full" value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed amount (KES)</option>
                  <option value="free_delivery">Free delivery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Value</label>
                <input type="number" className="staff-input" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} />
              </div>
              <button type="button" onClick={create} className="staff-btn-primary w-full">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="staff-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Used</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id}>
                <td className="font-mono font-semibold">{c.code}</td>
                <td className="capitalize text-slate-600">
                  {c.discount_type.replace("_", " ")} — {c.discount_value}
                  {c.discount_type === "percentage" ? "%" : " (cents)"}
                </td>
                <td>
                  {c.usage_count}
                  {c.usage_limit ? ` / ${c.usage_limit}` : ""}
                </td>
                <td>
                  <span className={c.is_active ? "staff-pill-success" : "staff-pill-neutral"}>
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button type="button" className="staff-btn-secondary text-xs" onClick={() => toggle(c.id, !c.is_active)}>
                    {c.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && (
          <p className="text-center py-8 text-sm text-slate-500">No coupons yet.</p>
        )}
      </div>
    </div>
  );
}
