"use client";

import { useEffect, useRef } from "react";
import { staffFetch, getCachedStaffUser } from "@/lib/staff-client";

/** One-time realtime DB setup for super admins (uses exec_sql on Supabase). */
export default function StaffDashboardSetup() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    const user = getCachedStaffUser();
    if (user?.role !== "super_admin") return;
    ran.current = true;

    const key = "staff_realtime_setup_v1";
    if (typeof window !== "undefined" && localStorage.getItem(key) === "ok") return;

    staffFetch<{ ok: boolean; message?: string }>("/api/staff/setup-realtime", { method: "POST" })
      .then((res) => {
        if (res.ok) localStorage.setItem(key, "ok");
      })
      .catch(() => {
        /* exec_sql may be unavailable — run scripts/enable-realtime.mjs */
      });
  }, []);

  return null;
}
