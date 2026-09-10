"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Always start each route change at the top of the page
 * (prevents landing mid-page / footer after nav or menu clicks).
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {
      // ignore
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    // Skip hash-only in-page anchors
    if (window.location.hash) return;

    const forceTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    forceTop();
    // Mobile browsers may restore previous Y after paint — re-assert
    const t1 = window.setTimeout(forceTop, 0);
    const t2 = window.setTimeout(forceTop, 50);
    const t3 = window.setTimeout(forceTop, 150);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [pathname, search]);

  return null;
}
