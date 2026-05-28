"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { setStaffToken, setCachedStaffUser, touchActivity } from "@/lib/staff-client";
import StaffAuthLayout from "@/components/staff/StaffAuthLayout";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6),
});

type FormData = yup.InferType<typeof schema>;

export default function StaffLoginClient() {
  const [redirectTo, setRedirectTo] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("expired") === "1" || params.get("expired") === "true") {
      setError("Session expired. Please sign in again.");
    }
    const redirect = params.get("redirect");
    if (redirect) setRedirectTo(redirect);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

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
      touchActivity();
      window.location.assign(redirectTo || "/staff");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  });

  return (
    <StaffAuthLayout title="Sign in" subtitle="Floral Whispers Gifts staff & admin access">
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-brand-red/10 border border-brand-red/20 px-3 py-2 text-sm text-brand-red"
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-gray-900 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="input-field h-11 text-sm"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-brand-red mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-brand-gray-900">
              Password
            </label>
            <Link
              href="/staff/forgot-password"
              className="text-xs font-medium text-brand-green hover:text-brand-red transition-colors shrink-0"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="input-field h-11 text-sm"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-brand-red mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full h-11 text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </StaffAuthLayout>
  );
}
