"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import "../staff-theme.css";

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
    <div className="staff-app staff-auth-shell min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Image src="/images/logo/FloralLogo.jpg" alt="" width={56} height={56} className="rounded-lg mx-auto mb-3 shadow-card" />
          <h1 className="font-heading text-xl font-bold text-brand-gray-900">
            <span className="text-brand-red">Forgot</span> password
          </h1>
          <p className="text-sm text-brand-gray-800 mt-1">We&apos;ll email you a reset link</p>
        </div>

        <div className="staff-card p-8">
          {message && (
            <p className="text-sm text-brand-green bg-brand-green/10 border border-brand-green/20 rounded-lg px-3 py-2 mb-4">
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-gray-900 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray-800" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="staff-input pl-10" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="staff-btn-primary w-full">
              {loading ? "Sending…" : "Send reset link"}
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
