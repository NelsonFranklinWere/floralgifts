"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy /admin/login → staff portal */
export default function AdminLoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/staff/login");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray-50">
      <p className="text-brand-gray-600">Redirecting to staff login...</p>
    </div>
  );
}
