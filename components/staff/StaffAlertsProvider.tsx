"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getStaffToken, staffFetch } from "@/lib/staff-client";

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
        prevRef.current = next;
        setAlerts(next);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!getStaffToken()) return;

    refresh();
    const interval = setInterval(refresh, 120_000);
    return () => clearInterval(interval);
  }, [refresh]);

  return <StaffAlertsContext.Provider value={alerts}>{children}</StaffAlertsContext.Provider>;
}
