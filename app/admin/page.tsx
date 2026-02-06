"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Validate token by making an API call
    async function validateAndFetchStats() {
      try {
        // First validate the token by checking if it's valid
        const statsResponse = await axios.get("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(statsResponse.data);
      } catch (error: any) {
        // If unauthorized, clear token and redirect to login
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        } else {
          console.error("Error fetching stats:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    validateAndFetchStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white border-b border-brand-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="font-heading font-bold text-xl text-brand-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-brand-gray-600 hover:text-brand-green text-sm">
                View Site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn-outline text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-sm font-medium text-brand-gray-600 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-brand-gray-900">{stats?.totalOrders || 0}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-medium text-brand-gray-600 mb-2">Pending Orders</h3>
            <p className="text-3xl font-bold text-brand-pink">{stats?.pendingOrders || 0}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-medium text-brand-gray-600 mb-2">Paid Orders</h3>
            <p className="text-3xl font-bold text-brand-green">{stats?.paidOrders || 0}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-medium text-brand-gray-600 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-brand-gray-900">
              {stats ? formatCurrency(stats.totalRevenue) : formatCurrency(0)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Link href="/admin/products" className="card p-6 hover:shadow-cardHover transition-shadow block">
            <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Manage Products</h2>
            <p className="text-brand-gray-600 mb-4">Add, edit, or remove products from your catalog</p>
            <span className="text-brand-green font-medium">Go to Products →</span>
          </Link>

          <Link href="/admin/orders" className="card p-6 hover:shadow-cardHover transition-shadow block">
            <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Manage Orders</h2>
            <p className="text-brand-gray-600 mb-4">View orders, update status, and process payments</p>
            <span className="text-brand-green font-medium">Go to Orders →</span>
          </Link>

          <Link href="/admin/blogs" className="card p-6 hover:shadow-cardHover transition-shadow block">
            <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Manage Blog</h2>
            <p className="text-brand-gray-600 mb-4">Create, edit, or delete blog posts</p>
            <span className="text-brand-green font-medium">Go to Blog →</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

