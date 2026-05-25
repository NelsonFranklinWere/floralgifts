"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { setStaffToken, setCachedStaffUser } from "@/lib/staff-client";
import "../staff-theme.css";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6),
});

type FormData = yup.InferType<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (searchParams.get("expired")) setError("Session expired. Please sign in again.");
  }, [searchParams]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed");
      setStaffToken(result.token, result.user);
      if (result.user) setCachedStaffUser(result.user);
      router.push(searchParams.get("redirect") || "/staff");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  });

  return (
    <div className="staff-app staff-auth-shell min-h-screen">
      <div className="staff-auth-panel relative z-10">
        <div>
          <Image src="/images/logo/FloralLogo.jpg" alt="" width={64} height={64} className="rounded-lg ring-2 ring-white/40 mb-8 shadow-card" />
          <h1 className="font-heading text-3xl font-bold leading-tight">
            <span className="text-white">Floral Whispers</span>
            <span className="block text-white/90 text-2xl mt-1">& Gifts</span>
          </h1>
          <p className="mt-4 text-white/90 text-lg max-w-md">
            Staff portal — manage orders, products, and Nairobi deliveries.
          </p>
        </div>
        <p className="text-sm text-white/80 relative z-10">Same-day gifts · Nairobi delivery</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-8">
            <Image src="/images/logo/FloralLogo.jpg" alt="" width={56} height={56} className="rounded-lg mx-auto mb-3 shadow-card" />
            <h2 className="font-heading text-xl font-bold text-brand-gray-900">
              <span className="text-brand-red">Floral Whispers</span> Staff
            </h2>
          </div>

          <div className="staff-card p-8">
            <h2 className="font-heading text-lg font-semibold text-brand-gray-900 hidden lg:block">Staff sign in</h2>
            <p className="text-sm text-brand-gray-800 mt-1 mb-6">Access your admin dashboard</p>

            {error && (
              <div className="mb-4 rounded-lg bg-brand-red/10 border border-brand-red/20 px-3 py-2 text-sm text-brand-red">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">Email</label>
                <input type="email" className="staff-input" autoComplete="email" {...register("email")} />
                {errors.email && <p className="text-xs text-brand-red mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-gray-900 mb-1">Password</label>
                <input type="password" className="staff-input" autoComplete="current-password" {...register("password")} />
                {errors.password && <p className="text-xs text-brand-red mt-1">{errors.password.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="staff-btn-primary w-full mt-2">
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
            <p className="text-center mt-4 text-sm">
              <Link href="/staff/forgot-password" className="text-brand-green hover:text-brand-pink hover:underline">
                Forgot password?
              </Link>
            </p>
          </div>
          <p className="text-center mt-6 text-sm text-brand-gray-800">
            <Link href="/" className="text-brand-green hover:text-brand-red font-medium">
              ← Back to store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StaffLoginPage() {
  return (
    <Suspense fallback={<div className="staff-app min-h-screen flex items-center justify-center">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
