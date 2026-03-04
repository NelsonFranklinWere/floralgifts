"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Sends lightweight pings to the server on each page view (and key scroll points)
 * for the admin live-visitors dashboard. Deferred so it never blocks render.
 */
export default function VisitorPing() {
  const pathname = usePathname();

  // Basic page-view ping
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

  // Scroll-depth pings (e.g. 25%, 50%, 75%, 90%)
  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;

    const thresholds = [25, 50, 75, 90];
    const fired: number[] = [];

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const percent = (scrollTop / maxScroll) * 100;

      for (const t of thresholds) {
        if (percent >= t && !fired.includes(t)) {
          fired.push(t);
          fetch("/api/visitor-ping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: pathname,
              referrer: document.referrer || "",
            }),
          }).catch(() => {});
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
