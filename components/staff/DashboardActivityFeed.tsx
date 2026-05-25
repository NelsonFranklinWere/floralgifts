"use client";

import Link from "next/link";
import { useStaffRealtimeOptional } from "./StaffRealtimeProvider";
import { formatDateTime } from "@/lib/utils";
import { ShoppingBag, MessageSquare, Inbox } from "lucide-react";

export default function DashboardActivityFeed() {
  const realtime = useStaffRealtimeOptional();
  const items = realtime?.notifications.slice(0, 8) ?? [];

  return (
    <div className="staff-card">
      <div className="staff-card-header">
        <h3>Recent updates</h3>
      </div>
      <div className="staff-card-body">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-brand-gray-800">
            <Inbox className="h-8 w-8 text-brand-gray-200 mb-2" />
            <p className="text-sm">No recent updates</p>
            <p className="text-xs mt-1">New orders and enquiries appear here</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((n) => (
              <li key={n.id} className="flex gap-3 text-sm">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                  {n.type === "message_new" ? (
                    <MessageSquare className="h-4 w-4" />
                  ) : (
                    <ShoppingBag className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-gray-900">{n.title}</p>
                  <p className="text-xs text-brand-gray-800 truncate">{n.body}</p>
                  <p className="text-[10px] text-brand-gray-800/70 mt-0.5">{formatDateTime(new Date(n.at).toISOString())}</p>
                  {n.type.startsWith("order") && (
                    <Link href="/staff/orders" className="text-xs text-brand-green hover:text-brand-pink hover:underline">
                      View orders
                    </Link>
                  )}
                  {n.type === "message_new" && (
                    <Link href="/staff/messages" className="text-xs text-brand-green hover:text-brand-pink hover:underline">
                      View messages
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
