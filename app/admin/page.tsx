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
    <div className="min-h-screen bg-brand-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-brand-gray-200">
        <div className="h-16 flex items-center justify-between px-4 border-b border-brand-gray-200">
          <div>
            <h1 className="font-heading font-bold text-lg text-brand-gray-900">Admin</h1>
            <p className="text-xs text-brand-gray-500">Floral Whispers Dashboard</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <Link
            href="/admin"
            className="block rounded-md px-3 py-2 text-sm font-medium bg-brand-green text-white"
          >
            Overview
          </Link>
          <div className="mt-4 text-xs font-semibold text-brand-gray-500 uppercase tracking-wide px-3">
            Manage
          </div>
          <Link
            href="/admin/products"
            className="block rounded-md px-3 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
          >
            Products
          </Link>
          <Link
            href="/admin/reviews"
            className="block rounded-md px-3 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
          >
            Reviews
          </Link>
          <Link
            href="/admin/blogs"
            className="block rounded-md px-3 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
          >
            Blogs
          </Link>
          <Link
            href="/admin/case-studies"
            className="block rounded-md px-3 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
          >
            Case Studies
          </Link>
          <Link
            href="/admin/orders"
            className="block rounded-md px-3 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
          >
            Payments &amp; Orders
          </Link>
          <Link
            href="/admin/payment-links"
            className="block rounded-md px-3 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
          >
            Payment Links
          </Link>
          <Link
            href="/admin/hero-slides"
            className="block rounded-md px-3 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
          >
            Hero Section
          </Link>
          <Link
            href="/admin/live-visitors"
            className="block rounded-md px-3 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
          >
            Live Visitors
          </Link>
        </nav>
        <div className="border-t border-brand-gray-200 p-4 flex items-center justify-between">
          <Link href="/" className="text-xs text-brand-gray-500 hover:text-brand-green">
            View site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-brand-red hover:text-brand-red/80"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar for mobile */}
        <header className="md:hidden bg-white border-b border-brand-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-lg text-brand-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-brand-gray-500">Overview</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-outline text-xs"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto w-full">
          <div className="mb-8">
            <h2 className="font-heading font-bold text-2xl text-brand-gray-900 mb-1">
              Overview
            </h2>
            <p className="text-sm text-brand-gray-600">
              Quick snapshot of orders, revenue and key admin tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Link href="/admin/products" className="card p-6 hover:shadow-cardHover transition-shadow block">
              <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Products</h2>
              <p className="text-brand-gray-600 mb-4">
                Add, edit, or remove products from your catalog.
              </p>
              <span className="text-brand-green font-medium">Manage products →</span>
            </Link>

            <Link href="/admin/orders" className="card p-6 hover:shadow-cardHover transition-shadow block">
              <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Payments &amp; Orders</h2>
              <p className="text-brand-gray-600 mb-4">
                View orders, track payments and update statuses.
              </p>
              <span className="text-brand-green font-medium">Manage payments →</span>
            </Link>

            <Link href="/admin/blogs" className="card p-6 hover:shadow-cardHover transition-shadow block">
              <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Blog</h2>
              <p className="text-brand-gray-600 mb-4">
                Create, edit and publish blog posts.
              </p>
              <span className="text-brand-green font-medium">Manage blog →</span>
            </Link>

            <Link href="/admin/case-studies" className="card p-6 hover:shadow-cardHover transition-shadow block">
              <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Case Studies</h2>
              <p className="text-brand-gray-600 mb-4">
                Showcase real weddings, events, birthdays and corporate floral work.
              </p>
              <span className="text-brand-green font-medium">Manage case studies →</span>
            </Link>

            <Link href="/admin/hero-slides" className="card p-6 hover:shadow-cardHover transition-shadow block">
              <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Hero Section</h2>
              <p className="text-brand-gray-600 mb-4">
                Control the homepage hero carousel images and text.
              </p>
              <span className="text-brand-green font-medium">Edit hero section →</span>
            </Link>

            <Link href="/admin/live-visitors" className="card p-6 hover:shadow-cardHover transition-shadow block border-2 border-brand-green/20">
              <h2 className="font-heading font-bold text-xl text-brand-gray-900 mb-2">Live Visitors</h2>
              <p className="text-brand-gray-600 mb-4">
                See who is on your site now with alerts for new visitors.
              </p>
              <span className="text-brand-green font-medium">Open live visitors →</span>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

