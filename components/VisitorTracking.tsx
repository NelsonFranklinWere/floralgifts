"use client";

import Script from "next/script";

/**
 * Loads TraceMyIP and Formilla scripts when configured via env.
 * - TraceMyIP: Set NEXT_PUBLIC_TRACEMYIP_TRACKER_URL (full script src) or NEXT_PUBLIC_TRACEMYIP_PROJECT_ID.
 *   Alerts: Enable "Instant email alerts" and notifications in your TraceMyIP dashboard.
 * - Formilla: Set NEXT_PUBLIC_FORMILLA_SCRIPT_URL (full script src from Formilla Installation).
 *   Alerts: Enable sound/desktop notifications in Formilla dashboard (Settings > Alerts).
 */
export default function VisitorTracking() {
  const traceMyIpUrl =
    process.env.NEXT_PUBLIC_TRACEMYIP_TRACKER_URL ||
    (process.env.NEXT_PUBLIC_TRACEMYIP_PROJECT_ID
      ? `https://cdn.tracemyip.org/tracker?pid=${process.env.NEXT_PUBLIC_TRACEMYIP_PROJECT_ID}`
      : "");

  const formillaScriptUrl = process.env.NEXT_PUBLIC_FORMILLA_SCRIPT_URL || "";

  return (
    <>
      {traceMyIpUrl ? (
        <Script
          id="tracemyip"
          strategy="afterInteractive"
          src={traceMyIpUrl}
        />
      ) : null}
      {formillaScriptUrl ? (
        <Script
          id="formilla"
          strategy="afterInteractive"
          src={formillaScriptUrl}
        />
      ) : null}
    </>
  );
}
