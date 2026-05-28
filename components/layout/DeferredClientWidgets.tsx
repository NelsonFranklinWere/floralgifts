"use client";

import dynamic from "next/dynamic";
import UnregisterServiceWorker from "@/components/UnregisterServiceWorker";

const VisitorPing = dynamic(() => import("@/components/VisitorPing"), { ssr: false });
const WebVitalsReporter = dynamic(() => import("@/components/WebVitalsReporter"), {
  ssr: false,
});
const StaffAccessButton = dynamic(() => import("@/components/StaffAccessButton"), { ssr: false });

/** Non-critical client widgets — loaded after hydration to protect INP on mobile. */
export default function DeferredClientWidgets() {
  return (
    <>
      <UnregisterServiceWorker />
      <StaffAccessButton />
      <WebVitalsReporter />
      <VisitorPing />
    </>
  );
}
