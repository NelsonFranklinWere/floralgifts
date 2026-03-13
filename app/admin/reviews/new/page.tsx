"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ReviewForm from "../ReviewForm";

export default function NewReviewPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-brand-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <ReviewForm />
      </div>
    </div>
  );
}

