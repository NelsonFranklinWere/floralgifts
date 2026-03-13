"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CaseStudyForm from "../CaseStudyForm";

export default function EditCaseStudyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

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
        <CaseStudyForm initialId={params.id} />
      </div>
    </div>
  );
}

