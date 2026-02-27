"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Sends a lightweight ping to the server on each page view for admin live-visitors.
 * Deferred so it never blocks initial render or mobile.
 */
export default function VisitorPing() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const t = setTimeout(() => {
      fetch("/api/visitor-ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: typeof document !== "undefined" ? document.referrer || "" : "",
        }),
      }).catch(() => {});
    }, 2000);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
