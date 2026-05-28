"use client";

import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ShoppingBag, Inbox } from "lucide-react";

type RecentOrder = {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
};

export default function DashboardRecentActivity({ orders }: { orders: RecentOrder[] }) {
  return (
    <div className="staff-card">
      <div className="staff-card-header flex items-center justify-between">
        <h3>Latest activity</h3>
        <Link href="/staff/orders" className="staff-link text-sm">
          View all →
        </Link>
      </div>
      <div className="staff-card-body">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-brand-gray-800">
            <Inbox className="h-8 w-8 text-brand-gray-200 mb-2" />
            <p className="text-sm">No recent orders</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex gap-3 text-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-gray-900 truncate">{o.customer_name}</p>
                  <p className="text-xs text-brand-gray-800">
                    {formatCurrency(o.total)} · <span className="capitalize">{o.status}</span>
                  </p>
                  <p className="text-[10px] text-brand-gray-800/70 mt-0.5">{formatDateTime(o.created_at)}</p>
                  <Link href={`/staff/orders/${o.id}`} className="text-xs text-brand-green hover:text-brand-pink hover:underline">
                    Open order →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
