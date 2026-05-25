"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy /admin dashboard → staff portal */
export default function AdminDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("staff_token");
    if (token) {
      try {
        localStorage.setItem("staff_token", token);
      } catch {
        /* ignore */
      }
    }
    router.replace("/staff");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray-50">
      <p className="text-brand-gray-600">Redirecting to staff portal...</p>
    </div>
  );
}
