"use client";

import { useEffect, useState } from "react";
import { staffFetch, canStaffViewFinancials } from "@/lib/staff-client";
import type { StaffRole } from "@/lib/staff-auth";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffCard from "@/components/staff/StaffCard";
import StatCard from "@/components/staff/StatCard";
import { EMPTY_FINANCIALS } from "@/lib/staff-page-defaults";
import { Banknote, ShoppingCart, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FinancialsPage() {
  const router = useRouter();
  const [role, setRole] = useState<StaffRole | null>(null);
  const [data, setData] = useState<Record<string, unknown>>(EMPTY_FINANCIALS);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    staffFetch<{ role: StaffRole }>("/api/staff/me").then((u) => {
      setRole(u.role);
      if (!canStaffViewFinancials(u.role)) router.replace("/staff");
    });
  }, [router]);

  useEffect(() => {
    if (role === null) return;
    if (role !== "super_admin") return;
    staffFetch<Record<string, unknown>>(`/api/staff/financials?period=${period}`)
      .then(setData)
      .catch(console.error);
  }, [role, period]);

  const byPayment = data.byPayment as Record<string, number>;
  const byCategory = data.byCategory as Record<string, number>;
  const topProducts = data.topProducts as { name: string; units: number; revenue: number }[];

  return (
    <div className="space-y-6">
      <StaffPageHeader
        title="Financials"
        description="Revenue breakdown — admin only."
        actions={
          <div className="inline-flex rounded-lg border border-brand-gray-200 p-0.5 bg-brand-gray-50">
            {(["daily", "weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all",
                  period === p ? "bg-white text-brand-green shadow-sm" : "text-brand-gray-800 hover:text-brand-red"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard label="Total revenue" value={formatCurrency(data.totalRevenue as number)} icon={Banknote} />
        <StatCard label="Orders" value={data.orderCount as number} icon={ShoppingCart} />
        <StatCard label="Avg order value" value={formatCurrency(data.avgOrder as number)} icon={TrendingUp} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <StaffCard title="By payment method">
          <div className="space-y-2 text-sm">
            {Object.entries(byPayment || {}).map(([k, v]) => (
              <div key={k} className="flex justify-between capitalize">
                <span className="text-slate-600">{k.replace(/_/g, " ")}</span>
                <span className="font-medium tabular-nums">{formatCurrency(v)}</span>
              </div>
            ))}
          </div>
        </StaffCard>
        <StaffCard title="By category">
          <div className="space-y-2 text-sm">
            {Object.entries(byCategory || {}).map(([k, v]) => (
              <div key={k} className="flex justify-between capitalize">
                <span className="text-slate-600">{k}</span>
                <span className="font-medium tabular-nums">{formatCurrency(v)}</span>
              </div>
            ))}
          </div>
        </StaffCard>
      </div>

      <StaffCard title="Top products">
        <div className="space-y-2 text-sm">
          {topProducts?.map((p, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-slate-700">
                {p.name} ({p.units} units)
              </span>
              <span className="font-medium tabular-nums">{formatCurrency(p.revenue)}</span>
            </div>
          ))}
        </div>
      </StaffCard>

      {data.vat != null && (
        <StaffCard>
          <p className="text-sm text-slate-600">
            VAT estimate ({(((data.vat as { rate: number }).rate) * 100).toFixed(0)}%):{" "}
            <span className="font-semibold text-slate-900">{formatCurrency((data.vat as { amount: number }).amount)}</span>
          </p>
        </StaffCard>
      )}
    </div>
  );
}
