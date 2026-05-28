"use client";

import { useEffect } from "react";

/** Removes stale service workers that reload the page when /sw.js fails. */
export default function UnregisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().catch(() => {});
      });
    });
  }, []);

  return null;
}
