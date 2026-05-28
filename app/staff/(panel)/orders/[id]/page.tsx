"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { staffFetch } from "@/lib/staff-client";
import type { Order } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffCard from "@/components/staff/StaffCard";
import { StaffCardLoading } from "@/components/staff/StaffInlineLoaders";

const STATUSES = ["pending", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [refundNotes, setRefundNotes] = useState("");

  const load = () => {
    setLoading(true);
    return staffFetch<Order>(`/api/staff/orders/${id}`)
      .then((o) => {
        setOrder(o);
        setOrderStatus((o as { order_status?: string }).order_status || o.status);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const updateStatus = async () => {
    await staffFetch(`/api/staff/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ order_status: orderStatus }),
    });
    load();
  };

  const cancel = async () => {
    await staffFetch(`/api/staff/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ cancel_reason: cancelReason }),
    });
    load();
  };

  const saveRefund = async () => {
    await staffFetch(`/api/staff/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ refund_notes: refundNotes }),
    });
    load();
  };

  const history = order
    ? (order as { status_history?: { status: string; at: string; by: string }[] }).status_history || []
    : [];

  return (
    <div className="space-y-6 max-w-4xl">
      <StaffPageHeader
        title={`Order ${id?.toString().slice(0, 12)}…`}
        description={order ? formatDateTime(order.created_at) : loading ? "Loading order…" : "Order not found"}
        actions={
          order ? <span className="staff-pill-warning capitalize">{orderStatus}</span> : undefined
        }
      />

      {loading && !order && <StaffCardLoading label="Loading order…" />}
      {!loading && !order && (
        <p className="text-sm text-brand-gray-800">Could not load this order.</p>
      )}

      {order && (
      <>

      <div className="grid md:grid-cols-2 gap-6">
        <StaffCard title="Customer">
          <div className="text-sm space-y-2 text-slate-700">
            <p className="font-semibold text-slate-900">{order.customer_name}</p>
            <p>{order.phone}</p>
            <p>{order.email}</p>
            <p>{order.delivery_address}</p>
            <p>Delivery: {order.delivery_date}</p>
            {order.notes && <p className="text-slate-500">Notes: {order.notes}</p>}
          </div>
        </StaffCard>

        <StaffCard title="Items">
          <ul className="space-y-2 text-sm">
            {order.items?.map((item, i) => (
              <li key={i} className="flex justify-between text-slate-700">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="font-bold mt-4 text-right text-slate-900">{formatCurrency(order.total_amount || order.total || 0)}</p>
          <p className="text-xs text-slate-500 capitalize mt-1">Payment: {order.payment_method}</p>
        </StaffCard>
      </div>

      <StaffCard title="Update status">
        <div className="space-y-4">
          <select className="staff-select w-full" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <button type="button" onClick={updateStatus} className="staff-btn-primary">
            Update status
          </button>
          {history.length > 0 && (
            <ul className="text-xs text-slate-500 space-y-1 border-t border-slate-100 pt-3">
              {history.map((h, i) => (
                <li key={i}>
                  {h.status} — {formatDateTime(h.at)} by {h.by}
                </li>
              ))}
            </ul>
          )}
        </div>
      </StaffCard>

      <StaffCard title="Cancel / Refund">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cancel reason</label>
            <input className="staff-input" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
            <button type="button" className="mt-2 rounded-lg px-4 py-2 text-sm font-medium bg-rose-600 text-white hover:bg-rose-700" onClick={cancel}>
              Cancel order
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Refund notes</label>
            <textarea className="staff-input min-h-[80px] py-2" value={refundNotes} onChange={(e) => setRefundNotes(e.target.value)} />
            <button type="button" className="staff-btn-secondary mt-2" onClick={saveRefund}>
              Save refund notes
            </button>
          </div>
        </div>
      </StaffCard>

      <div className="flex gap-2">
        <button type="button" className="staff-btn-secondary" onClick={() => window.print()}>
          Print receipt
        </button>
        <Link href="/staff/orders" className="staff-btn-secondary">
          ← All orders
        </Link>
      </div>
      </>
      )}
    </div>
  );
}
