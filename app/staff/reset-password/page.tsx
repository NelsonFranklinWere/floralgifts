"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import StaffAuthLayout from "@/components/staff/StaffAuthLayout";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/staff/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    const data = await res.json();
    setMessage(data.message);
    setLoading(false);
    if (res.ok) setTimeout(() => router.push("/staff/login"), 2000);
  };

  return (
    <StaffAuthLayout title="Set new password" subtitle="Choose a strong password for your account">
      {message && (
        <p
          className={`text-sm rounded-lg px-3 py-2 mb-4 ${
            message.toLowerCase().includes("success")
              ? "text-brand-green bg-brand-green/10 border border-brand-green/20"
              : "text-brand-red bg-brand-red/10 border border-brand-red/20"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-brand-gray-900 mb-1.5">
            New password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field h-11 text-sm"
            minLength={6}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full h-11 text-sm disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        <Link href="/staff/login" className="text-brand-green font-medium hover:text-brand-red">
          ← Back to sign in
        </Link>
      </p>
    </StaffAuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] text-brand-gray-800">
          Loading…
        </div>
      }
    >
      <ResetForm />
    </Suspense>
  );
}
