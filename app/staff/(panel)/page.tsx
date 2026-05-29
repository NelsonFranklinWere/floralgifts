"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { staffFetch } from "@/lib/staff-client";
import DashboardChart from "@/components/staff/DashboardChart";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StatCard from "@/components/staff/StatCard";
import DashboardRecentActivity from "@/components/staff/DashboardRecentActivity";
import { RefreshCw } from "lucide-react";
import { EMPTY_STAFF_DASHBOARD } from "@/lib/staff-dashboard-defaults";
import {
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  Banknote,
  Plus,
  Tag,
  ArrowUpRight,
  MessageSquare,
  Truck,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardData {
  stats: {
    ordersToday: number;
    revenueToday: number;
    ordersYesterday: number;
    revenueYesterday: number;
    pendingOrders: number;
    lowStock: number;
    newCustomers: number;
    unreadMessages: number;
    activeDeliveries: number;
    liveVisitors: number;
  };
  chartData: { date: string; revenue: number; orders: number }[];
  recentOrders: {
    id: string;
    customer_name: string;
    total: number;
    status: string;
    payment_method: string;
    created_at: string;
  }[];
}

function statusPill(status: string) {
  const s = status.toLowerCase();
  if (s === "paid" || s === "delivered" || s === "shipped") return "staff-pill-success";
  if (s === "pending") return "staff-pill-warning";
  if (s === "cancelled" || s === "failed") return "staff-pill-danger";
  return "staff-pill-neutral";
}

function trendSublabel(today: number, yesterday: number, isMoney = false) {
  if (yesterday === 0) return today > 0 ? "Up from yesterday" : "No data yesterday";
  const diff = today - yesterday;
  const pct = Math.round((diff / yesterday) * 100);
  const sign = diff >= 0 ? "+" : "";
  const label = isMoney ? formatCurrency(Math.abs(diff)) : String(Math.abs(diff));
  return `${sign}${pct}% vs yesterday (${diff >= 0 ? "+" : "-"}${label})`;
}

export default function StaffDashboardPage() {
  const [data, setData] = useState<DashboardData>(EMPTY_STAFF_DASHBOARD);
  const [period, setPeriod] = useState("daily");
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const d = await staffFetch<DashboardData>(`/api/staff/dashboard?period=${period}`);
      setData(d);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load dashboard");
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const dashboard = data;

  const { stats } = dashboard;
  const revenueTrend = stats.revenueToday >= stats.revenueYesterday ? "up" : "down";
  const ordersTrend = stats.ordersToday >= stats.ordersYesterday ? "up" : "down";

  return (
    <div className="space-y-6">
      {loadError && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          {loadError}. Showing partial data — try Refresh.
        </div>
      )}

      <StaffPageHeader
        title="Dashboard"
        description="Today’s orders, revenue, and store overview."
        actions={
          <>
            <button
              type="button"
              onClick={() => load()}
              className="staff-btn-secondary"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <Link href="/staff/products/new" className="staff-btn-primary">
              <Plus className="h-4 w-4" />
              Add product
            </Link>
            <Link href="/staff/orders" className="staff-btn-secondary">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <StatCard
          label="Orders today"
          value={stats.ordersToday}
          icon={ShoppingCart}
          href="/staff/orders"
          sublabel={trendSublabel(stats.ordersToday, stats.ordersYesterday)}
          trend={ordersTrend}
        />
        <StatCard
          label="Revenue today"
          value={formatCurrency(stats.revenueToday)}
          icon={Banknote}
          href="/staff/financials"
          sublabel={trendSublabel(stats.revenueToday, stats.revenueYesterday, true)}
          trend={revenueTrend}
        />
        <StatCard
          label="Pending payment"
          value={stats.pendingOrders}
          icon={Package}
          href="/staff/orders"
          sublabel={stats.pendingOrders > 0 ? "Needs action" : "All clear"}
          trend={stats.pendingOrders > 0 ? "down" : "neutral"}
        />
        <StatCard
          label="Unread messages"
          value={stats.unreadMessages}
          icon={MessageSquare}
          href="/staff/messages"
          sublabel="Contact enquiries"
        />
        <StatCard
          label="Active deliveries"
          value={stats.activeDeliveries}
          icon={Truck}
          href="/staff/delivery"
        />
        <StatCard
          label="Low stock"
          value={stats.lowStock}
          icon={AlertTriangle}
          href="/staff/products"
          sublabel={stats.lowStock > 0 ? "Restock soon" : "Stock OK"}
          trend={stats.lowStock > 0 ? "down" : "neutral"}
        />
        <StatCard
          label="Live on site"
          value={stats.liveVisitors}
          icon={Radio}
          href="/staff/live-visitors"
          sublabel={stats.liveVisitors > 0 ? "Browsing now" : "No active visitors"}
          trend={stats.liveVisitors > 0 ? "up" : "neutral"}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="staff-card lg:col-span-2">
          <div className="staff-card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3>Revenue & orders</h3>
            <div className="inline-flex rounded-lg border border-brand-gray-200 p-0.5 bg-brand-gray-50">
              {(["daily", "weekly", "monthly"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all",
                    period === p ? "bg-white text-brand-red shadow-sm font-semibold" : "text-brand-gray-800 hover:text-brand-red"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="staff-card-body min-h-[320px]">
            <DashboardChart data={dashboard.chartData} />
          </div>
        </div>

        <DashboardRecentActivity orders={dashboard.recentOrders} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="staff-card lg:col-span-2">
          <div className="staff-card-header flex items-center justify-between">
            <h3>Recent orders</h3>
            <Link href="/staff/orders" className="staff-link text-sm">
              View all →
            </Link>
          </div>
          <div className="staff-table-wrap border-0 rounded-none shadow-none">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/staff/orders/${o.id}`} className="staff-link font-mono text-xs">
                        {o.id.slice(0, 8)}…
                      </Link>
                    </td>
                    <td>{o.customer_name}</td>
                    <td className="font-medium tabular-nums">{formatCurrency(o.total)}</td>
                    <td className="capitalize text-slate-500 text-xs">{o.payment_method?.replace(/_/g, " ")}</td>
                    <td>
                      <span className={statusPill(o.status)}>{o.status}</span>
                    </td>
                    <td className="text-xs text-slate-500">{formatDateTime(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dashboard.recentOrders.length === 0 && (
              <p className="text-center py-8 text-sm text-slate-500">No orders yet.</p>
            )}
          </div>
        </div>

        <div className="staff-card">
          <div className="staff-card-header">
            <h3>Quick actions</h3>
          </div>
          <div className="staff-card-body space-y-2">
            {[
              { href: "/staff/orders", label: "Manage orders", icon: ShoppingCart },
              { href: "/staff/products", label: "Products", icon: Package },
              { href: "/staff/delivery", label: "Delivery", icon: Truck },
              { href: "/staff/messages", label: "Messages", icon: Users },
              { href: "/staff/coupons", label: "Coupons", icon: Tag },
              { href: "/staff/customers", label: "Customers", icon: Users },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-lg border border-brand-gray-200 px-4 py-3 text-sm text-brand-gray-800 hover:border-brand-green/40 hover:bg-brand-green/5 transition-all group"
              >
                <span className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-brand-green" />
                  {item.label}
                </span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 text-brand-red" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
