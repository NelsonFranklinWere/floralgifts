"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { staffFetch } from "@/lib/staff-client";
import { useStaffRealtimeRefresh } from "@/components/staff/StaffRealtimeProvider";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StatCard from "@/components/staff/StatCard";
import StaffLoading from "@/components/staff/StaffLoading";
import DashboardActivityFeed from "@/components/staff/DashboardActivityFeed";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardChart = dynamic(() => import("@/components/staff/DashboardChart"), {
  ssr: false,
  loading: () => <div className="h-80 staff-skeleton" />,
});

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
  const [data, setData] = useState<DashboardData | null>(null);
  const [period, setPeriod] = useState("daily");

  const load = () => {
    staffFetch<DashboardData>(`/api/staff/dashboard?period=${period}`).then(setData).catch(console.error);
  };

  useEffect(() => {
    load();
  }, [period]);

  useStaffRealtimeRefresh(load, [period]);

  if (!data) return <StaffLoading label="Loading dashboard..." />;

  const { stats } = data;
  const revenueTrend = stats.revenueToday >= stats.revenueYesterday ? "up" : "down";
  const ordersTrend = stats.ordersToday >= stats.ordersYesterday ? "up" : "down";

  return (
    <div className="space-y-6">
      <StaffPageHeader
        title="Dashboard"
        description="Today’s orders, revenue, and store overview."
        actions={
          <>
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
          <div className="staff-card-body">
            <DashboardChart data={data.chartData} />
          </div>
        </div>

        <DashboardActivityFeed />
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
                {data.recentOrders.map((o) => (
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
            {data.recentOrders.length === 0 && (
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
