"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import "../staff-theme.css";

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
    <div className="staff-app staff-auth-shell min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Image src="/images/logo/FloralLogo.jpg" alt="" width={56} height={56} className="rounded-lg mx-auto mb-3 shadow-card" />
          <h1 className="font-heading text-xl font-bold text-brand-gray-900">Set new password</h1>
        </div>

        <div className="staff-card p-8">
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
              <label htmlFor="password" className="block text-sm font-medium text-brand-gray-900 mb-1">
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="staff-input"
                minLength={6}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="staff-btn-primary w-full">
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm">
          <Link href="/staff/login" className="text-brand-green hover:text-brand-pink font-medium">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="staff-app min-h-screen flex items-center justify-center">Loading…</div>}>
      <ResetForm />
    </Suspense>
  );
}
