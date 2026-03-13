"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ReviewForm from "../ReviewForm";

export default function EditReviewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  if (!params?.id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <ReviewForm id={params.id} />
      </div>
    </div>
  );
}

