"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Banknote,
  Tag,
  Truck,
  FileText,
  MessageSquare,
  ClipboardList,
  Settings,
  LogOut,
  ExternalLink,
  X,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StaffRole } from "@/lib/staff-auth";
import { canStaffViewFinancials } from "@/lib/staff-client";
import { useStaffAlerts } from "./StaffAlertsProvider";

const nav = [
  { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff/live-visitors", label: "Live visitors", icon: Radio, highlight: true },
  { href: "/staff/orders", label: "Orders", icon: ShoppingCart, badge: "orders" },
  { href: "/staff/messages", label: "Messages", icon: MessageSquare, badge: "messages" },
  { href: "/staff/products", label: "Products", icon: Package },
  { href: "/staff/customers", label: "Customers", icon: Users },
  { href: "/staff/coupons", label: "Coupons", icon: Tag },
  { href: "/staff/delivery", label: "Delivery", icon: Truck },
  { href: "/staff/content", label: "Content", icon: FileText },
  { href: "/staff/financials", label: "Financials", icon: Banknote, superAdminOnly: true },
  { href: "/staff/audit", label: "Audit log", icon: ClipboardList },
  { href: "/staff/settings", label: "Settings", icon: Settings },
];

interface StaffSidebarProps {
  role: StaffRole;
  onLogout: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
}

export default function StaffSidebar({ role, onLogout, onNavigate, onClose }: StaffSidebarProps) {
  const pathname = usePathname();
  const showFinancials = canStaffViewFinancials(role);
  const alerts = useStaffAlerts();
  const orderBadge = alerts.pendingOrders;
  const msgBadge = alerts.unreadMessages;

  return (
    <aside className="flex h-full w-64 max-w-[85vw] flex-col bg-white border-r border-brand-gray-200">
      <div className="px-4 py-5 border-b border-brand-gray-200 flex items-start justify-between gap-2">
        <Link href="/staff" onClick={onNavigate} className="flex items-center gap-3 group min-w-0">
          <Image
            src="/images/logo/FloralLogo.jpg"
            alt="Floral Whispers Gifts"
            width={52}
            height={52}
            className="rounded-lg h-12 w-12 object-cover ring-1 ring-brand-gray-200"
          />
          <div>
            <p className="font-heading font-bold text-base leading-tight">
              <span className="text-brand-red group-hover:text-brand-red">Floral Whispers</span>
            </p>
            <p className="text-xs text-brand-gray-800 font-medium">& Gifts · Admin</p>
          </div>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-brand-gray-50 text-brand-gray-800 shrink-0"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {nav.map((item) => {
          if (item.superAdminOnly && !showFinancials) return null;
          const Icon = item.icon;
          const active =
            pathname === item.href || (item.href !== "/staff" && pathname.startsWith(item.href));
          const badge =
            item.badge === "orders" && orderBadge > 0
              ? orderBadge
              : item.badge === "messages" && msgBadge > 0
                ? msgBadge
                : null;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-red/5 text-brand-red border-l-2 border-brand-red pl-[10px]"
                  : "text-brand-gray-900 hover:text-brand-red hover:bg-brand-gray-50",
                "highlight" in item && item.highlight && !active && "ring-1 ring-brand-green/30 bg-brand-green/5"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-brand-red" : "text-brand-gray-800")} />
                {item.label}
              </span>
              {badge != null && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-red px-1.5 text-[10px] font-bold text-white">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-brand-gray-200 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-gray-900 hover:text-brand-red hover:bg-brand-gray-50 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          View website
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-gray-900 hover:text-brand-red hover:bg-brand-gray-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
