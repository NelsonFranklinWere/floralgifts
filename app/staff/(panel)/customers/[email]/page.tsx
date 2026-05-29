"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { staffFetch } from "@/lib/staff-client";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffCard from "@/components/staff/StaffCard";
import type { Order } from "@/lib/db";

export default function CustomerDetailPage() {
  const { email } = useParams();
  const key = decodeURIComponent(email as string);
  const [data, setData] = useState<{
    orders: Order[];
    notes: { note: string; created_at: string }[];
    blocked: boolean;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState("");

  const load = () =>
    staffFetch<NonNullable<typeof data>>(`/api/staff/customers/${encodeURIComponent(key)}`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setReady(true));

  useEffect(() => {
    load();
  }, [key]);

  const addNote = async () => {
    await staffFetch("/api/staff/customers", {
      method: "POST",
      body: JSON.stringify({ email: key, note }),
    });
    setNote("");
    load();
  };

  const toggleBlock = async () => {
    await staffFetch(`/api/staff/customers/${encodeURIComponent(key)}`, {
      method: "PATCH",
      body: JSON.stringify({ blocked: !data?.blocked, reason: "Blocked from staff portal" }),
    });
    load();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <StaffPageHeader
        title={key}
        actions={
          data ? (
          <button
            type="button"
            onClick={toggleBlock}
            className={
              data.blocked
                ? "staff-btn-secondary"
                : "rounded-lg px-4 py-2 text-sm font-medium bg-rose-600 text-white hover:bg-rose-700"
            }
          >
            {data.blocked ? "Unblock customer" : "Block customer"}
          </button>
          ) : undefined
        }
      />

      {ready && !data && (
        <p className="text-sm text-brand-gray-800">Could not load customer.</p>
      )}

      {data && (
      <>

      <StaffCard title={`Order history (${data.orders.length})`}>
        <div className="space-y-3 text-sm">
          {data.orders.map((o) => (
            <div key={o.id} className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">
                {formatDateTime(o.created_at)} — {o.status}
              </span>
              <span className="font-medium tabular-nums">{formatCurrency(o.total_amount || o.total || 0)}</span>
            </div>
          ))}
        </div>
      </StaffCard>

      <StaffCard title="Staff notes">
        <div className="space-y-3">
          {data.notes.map((n, i) => (
            <p key={i} className="text-sm bg-slate-50 border border-slate-100 p-3 rounded-lg text-slate-700">
              {n.note}
            </p>
          ))}
          <textarea
            className="staff-input min-h-[80px] py-2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VIP, special instructions..."
          />
          <button type="button" onClick={addNote} className="staff-btn-primary">
            Add note
          </button>
        </div>
      </StaffCard>

      <Link href="/staff/customers" className="staff-link text-sm">
        ← All customers
      </Link>
      </>
      )}
    </div>
  );
}
