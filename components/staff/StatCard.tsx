"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  href?: string;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({ label, value, icon: Icon, href, sublabel, trend }: StatCardProps) {
  const inner = (
    <div className={cn("card p-4 transition-shadow h-full", href && "hover:shadow-cardHover cursor-pointer")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-brand-gray-800 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-bold text-brand-gray-900 tabular-nums font-heading">{value}</p>
          {sublabel && (
            <p
              className={cn(
                "text-xs mt-1.5",
                trend === "up" && "text-brand-green",
                trend === "down" && "text-brand-red",
                trend === "neutral" && "text-brand-gray-800"
              )}
            >
              {sublabel}
            </p>
          )}
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-gray-50 text-brand-red border border-brand-gray-100">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
