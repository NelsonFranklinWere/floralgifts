"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import StaffAuthLayout from "@/components/staff/StaffAuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/staff/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message);
    setLoading(false);
  };

  return (
    <StaffAuthLayout title="Forgot password" subtitle="We'll email you a reset link">
      {message && (
        <p className="text-sm text-brand-green bg-brand-green/10 border border-brand-green/20 rounded-lg px-3 py-2 mb-4">
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-gray-900 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray-800 pointer-events-none" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field h-11 text-sm pl-10"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full h-11 text-sm disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
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
