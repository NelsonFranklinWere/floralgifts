"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy /admin/live-visitors → staff portal */
export default function AdminLiveVisitorsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/staff/live-visitors");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
      <p className="text-brand-gray-800">Redirecting to live visits…</p>
    </div>
  );
}
