"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { useStaffRealtime, onStaffRealtime, type RealtimeNotification } from "@/lib/hooks/useStaffRealtime";
import { X, ShoppingBag, MessageSquare } from "lucide-react";

interface StaffRealtimeContextValue {
  connected: boolean;
  notifications: RealtimeNotification[];
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const StaffRealtimeContext = createContext<StaffRealtimeContextValue | null>(null);

/** Safe for sidebar — returns null outside provider */
export function useStaffRealtimeOptional() {
  return useContext(StaffRealtimeContext);
}

export function useStaffRealtimeContext() {
  const ctx = useContext(StaffRealtimeContext);
  if (!ctx) throw new Error("useStaffRealtimeContext must be used within StaffRealtimeProvider");
  return ctx;
}

export function StaffRealtimeProvider({ children }: { children: React.ReactNode }) {
  const realtime = useStaffRealtime();

  return (
    <StaffRealtimeContext.Provider value={realtime}>
      {children}
      <ToastStack notifications={realtime.notifications} onDismiss={realtime.dismiss} />
    </StaffRealtimeContext.Provider>
  );
}

function ToastStack({
  notifications,
  onDismiss,
}: {
  notifications: RealtimeNotification[];
  onDismiss: (id: string) => void;
}) {
  const visible = notifications.slice(0, 4);
  if (visible.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {visible.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto flex gap-3 rounded-lg border border-brand-gray-200 bg-white p-4 shadow-card"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
            {n.type === "message_new" ? <MessageSquare className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-brand-gray-900">{n.title}</p>
            <p className="text-xs text-brand-gray-800 truncate">{n.body}</p>
            {n.type.startsWith("order") && (
              <Link href="/staff/orders" className="text-xs font-medium text-brand-green hover:text-brand-pink hover:underline mt-1 inline-block">
                View orders →
              </Link>
            )}
            {n.type === "message_new" && (
              <Link href="/staff/messages" className="text-xs font-medium text-brand-green hover:text-brand-pink hover:underline mt-1 inline-block">
                View messages →
              </Link>
            )}
          </div>
          <button type="button" onClick={() => onDismiss(n.id)} className="text-brand-gray-800 hover:text-brand-red">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/** Call from pages to refetch when realtime fires */
export function useStaffRealtimeRefresh(
  onRefresh: () => void,
  deps: string[] = [],
  events: string[] = ["order_new", "order_updated", "message_new"]
) {
  const refreshRef = useRef(onRefresh);
  refreshRef.current = onRefresh;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const schedule = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => refreshRef.current(), 2000);
    };
    const unsub = onStaffRealtime((event) => {
      if (events.includes(event)) schedule();
    });
    return () => {
      unsub();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, deps);
}
