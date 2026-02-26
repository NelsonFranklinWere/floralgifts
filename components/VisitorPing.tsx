"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Sends a lightweight ping to the server on each page view so the admin
 * live-visitors dashboard can show activity and trigger sounds/alerts.
 */
export default function VisitorPing() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    fetch("/api/visitor-ping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: typeof window !== "undefined" ? document.referrer || "" : "",
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
