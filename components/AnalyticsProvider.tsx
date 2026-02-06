"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@/lib/analytics";

const GA_MEASUREMENT_ID = "G-DTDMCDNB9F";

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route change
    Analytics.trackPageView(pathname);

    // Track page view in Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return <>{children}</>;
}

