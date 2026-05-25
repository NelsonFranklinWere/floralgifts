"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { staffFetch } from "@/lib/staff-client";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffLoading from "@/components/staff/StaffLoading";
import { useStaffRealtimeRefresh } from "@/components/staff/StaffRealtimeProvider";

interface OrderRow {
  id: string;
  customer_name: string;
  total_amount: number;
  payment_method: string;
  status: string;
  order_status: string;
  delivery_address: string;
  created_at: string;
}

function statusPill(status: string) {
  const s = status.toLowerCase();
  if (s === "paid" || s === "delivered" || s === "shipped") return "staff-pill-success";
  if (s === "pending" || s === "confirmed") return "staff-pill-warning";
  if (s === "cancelled" || s === "failed") return "staff-pill-danger";
  return "staff-pill-neutral";
}

function StaffOrdersPage() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = searchParams.get("status") || "";
    setStatus(q);
  }, [searchParams]);

  const load = () => {
    const params = status ? `?status=${status}` : "";
    staffFetch<OrderRow[]>(`/api/staff/orders${params}`)
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [status]);

  useStaffRealtimeRefresh(load, [status], ["order_new", "order_updated", "sync"]);

  if (loading && orders.length === 0) return <StaffLoading />;

  return (
    <div className="space-y-6">
      <StaffPageHeader
        title="Orders"
        description="Live order list — refreshes when new orders arrive."
      />

      <div className="staff-card p-4">
        <select className="staff-select max-w-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="staff-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Delivery</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <Link href={`/staff/orders/${o.id}`} className="staff-link font-mono text-xs">
                    {o.id.slice(0, 12)}…
                  </Link>
                </td>
                <td className="font-medium">{o.customer_name}</td>
                <td className="font-semibold tabular-nums">{formatCurrency(o.total_amount)}</td>
                <td className="capitalize text-slate-500 text-xs">{o.payment_method?.replace(/_/g, " ")}</td>
                <td>
                  <span className={statusPill(o.order_status || o.status)}>{o.order_status || o.status}</span>
                </td>
                <td className="text-xs text-slate-500 max-w-[140px] truncate">{o.delivery_address}</td>
                <td className="text-xs text-slate-500 whitespace-nowrap">{formatDateTime(o.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-12 text-slate-500 text-sm">No orders found.</p>}
      </div>
    </div>
  );
}

export default function StaffOrdersPageWrapper() {
  return (
    <Suspense fallback={<StaffLoading label="Loading orders..." />}>
      <StaffOrdersPage />
    </Suspense>
  );
}
