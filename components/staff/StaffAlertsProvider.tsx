"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { staffFetch } from "@/lib/staff-client";
import { emitStaffRealtime, onStaffRealtime } from "@/lib/hooks/useStaffRealtime";

interface StaffAlerts {
  pendingOrders: number;
  unreadMessages: number;
}

const StaffAlertsContext = createContext<StaffAlerts>({ pendingOrders: 0, unreadMessages: 0 });

export function useStaffAlerts() {
  return useContext(StaffAlertsContext);
}

export function StaffAlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<StaffAlerts>({ pendingOrders: 0, unreadMessages: 0 });
  const prevRef = useRef<StaffAlerts>({ pendingOrders: 0, unreadMessages: 0 });

  const refresh = useCallback(() => {
    staffFetch<StaffAlerts>("/api/staff/alerts")
      .then((next) => {
        const prev = prevRef.current;
        if (next.pendingOrders > prev.pendingOrders) {
          emitStaffRealtime("order_new", { source: "poll" });
        } else if (next.pendingOrders !== prev.pendingOrders) {
          emitStaffRealtime("order_updated", { source: "poll" });
        }
        if (next.unreadMessages > prev.unreadMessages) {
          emitStaffRealtime("message_new", { source: "poll" });
        }
        prevRef.current = next;
        setAlerts(next);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 8000);
    const unsub = onStaffRealtime((event) => {
      if (event === "order_new" || event === "order_updated" || event === "message_new" || event === "sync") {
        refresh();
      }
    });
    return () => {
      clearInterval(interval);
      unsub();
    };
  }, [refresh]);

  return <StaffAlertsContext.Provider value={alerts}>{children}</StaffAlertsContext.Provider>;
}
