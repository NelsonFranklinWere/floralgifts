"use client";

import Script from "next/script";

const FORMILLA_GUID = process.env.NEXT_PUBLIC_FORMILLA_GUID || "cs93b0c5-4f25-47d0-8bdd-a9b21e1568e1";
const FORMILLA_SCRIPT =
  typeof window !== "undefined" && window.location?.protocol === "https:"
    ? "https://www.formilla.com/scripts/feedback.js"
    : "https://www.formilla.com/scripts/feedback.js";

export default function FormillaWidget() {
  if (!FORMILLA_GUID) return null;

  return (
    <Script
      id="formilla-feedback"
      strategy="afterInteractive"
      src={FORMILLA_SCRIPT}
      onLoad={() => {
        if (typeof window !== "undefined" && (window as any).Formilla) {
          (window as any).Formilla.guid = FORMILLA_GUID;
          (window as any).Formilla.loadWidgets();
        }
      }}
    />
  );
}
