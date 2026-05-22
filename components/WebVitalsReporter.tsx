"use client";

import { useEffect } from "react";

/**
 * Collects Core Web Vitals (LCP, CLS, FCP, TTFB) and reports them to Google Analytics.
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reportMetric = (name: string, value: number, rating: string) => {
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", name, {
          event_category: "Web Vitals",
          event_label: rating,
          value: Math.round(name === "CLS" ? value * 1000 : value),
          non_interaction: true,
        });
      }
    };

    try {
      const lcpObs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number;
        };
        const v = last.startTime;
        reportMetric(
          "LCP",
          v,
          v <= 2500 ? "good" : v <= 4000 ? "needs-improvement" : "poor"
        );
      });
      lcpObs.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      /* unsupported */
    }

    try {
      let clsValue = 0;
      const clsObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          if (!e.hadRecentInput) clsValue += e.value;
        }
        reportMetric(
          "CLS",
          clsValue,
          clsValue <= 0.1
            ? "good"
            : clsValue <= 0.25
              ? "needs-improvement"
              : "poor"
        );
      });
      clsObs.observe({ type: "layout-shift", buffered: true });
    } catch {
      /* unsupported */
    }

    try {
      const fcpObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            const v = entry.startTime;
            reportMetric(
              "FCP",
              v,
              v <= 1800 ? "good" : v <= 3000 ? "needs-improvement" : "poor"
            );
            fcpObs.disconnect();
          }
        }
      });
      fcpObs.observe({ type: "paint", buffered: true });
    } catch {
      /* unsupported */
    }

    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const nav = navEntries[0] as PerformanceNavigationTiming;
        const ttfb = nav.responseStart - nav.requestStart;
        reportMetric(
          "TTFB",
          ttfb,
          ttfb <= 800 ? "good" : ttfb <= 1800 ? "needs-improvement" : "poor"
        );
      }
    } catch {
      /* unsupported */
    }
  }, []);

  return null;
}
