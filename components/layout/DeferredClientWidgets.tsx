"use client";

import dynamic from "next/dynamic";

const VisitorPing = dynamic(() => import("@/components/VisitorPing"), { ssr: false });
const WebVitalsReporter = dynamic(() => import("@/components/WebVitalsReporter"), {
  ssr: false,
});

/** Non-critical client widgets — loaded after hydration to protect INP on mobile. */
export default function DeferredClientWidgets() {
  return (
    <>
      <WebVitalsReporter />
      <VisitorPing />
    </>
  );
}
