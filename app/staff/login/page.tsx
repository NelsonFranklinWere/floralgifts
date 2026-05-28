"use client";

import StaffLoginClient from "./StaffLoginClient";

/** Client-only page — avoids RSC lazy-chunk mismatch during dev HMR. */
export default function StaffLoginPage() {
  return <StaffLoginClient />;
}
