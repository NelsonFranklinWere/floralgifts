"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import Image from "next/image";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

type LoginFormData = yup.InferType<typeof schema>;

function AdminLoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  // Clear any existing token on mount to force fresh login
  useEffect(() => {
    localStorage.removeItem("admin_token");
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // Store token only if login is successful
      if (result.token) {
        localStorage.setItem("admin_token", result.token);
        router.push("/admin");
      } else {
        throw new Error("No token received from server");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      setIsSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex justify-center mb-4">
            <Image
              src="/images/logo.jpg"
              alt="Floral Whispers Gifts Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </Link>
          <h2 className="font-heading font-bold text-3xl text-brand-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-brand-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="bg-brand-red/10 border border-brand-red rounded-lg p-4 text-brand-red text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-gray-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="input-field"
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-brand-red">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className="input-field"
                aria-required="true"
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-brand-red">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-brand-gray-600 hover:text-brand-green">
              ← Back to website
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}

