"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Order } from "@/lib/db";

type ProductsById = Record<
  string,
  { id: string; slug: string; title: string; images: string[] }
>;

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>("");
  const [order, setOrder] = useState<Order | null>(null);
  const [productsById, setProductsById] = useState<ProductsById>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p = await params;
        if (mounted) setOrderId(p.id);
      } catch {
        if (mounted) setError("Failed to load order ID");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    if (!orderId) return;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/admin/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.order);
        setProductsById(res.data.productsById || {});
      } catch (e: any) {
        if (e.response?.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        }
        setError(e.response?.data?.message || "Failed to load order");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [orderId, router]);

  const paymentLinkHref = useMemo(() => {
    if (!order) return "/admin/payment-links";
    const amount = (order.total_amount || order.total || 0) / 100;
    const sp = new URLSearchParams();
    sp.set("customerName", order.customer_name || "");
    if (order.phone) sp.set("customerPhone", order.phone);
    if (order.email) sp.set("customerEmail", order.email);
    sp.set("amount", String(amount));
    sp.set("description", `Payment for order ${order.id.slice(0, 8)}`);
    return `/admin/payment-links?${sp.toString()}`;
  }, [order]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading order...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-red mb-4">{error || "Order not found"}</p>
          <Link href="/admin/orders" className="btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white border-b border-brand-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin/orders" className="text-brand-gray-600 hover:text-brand-green">
              ← Back to Orders
            </Link>
            <h1 className="font-heading font-bold text-xl text-brand-gray-900">
              Order {order.id.slice(0, 8)}
            </h1>
            <Link href={paymentLinkHref} className="btn-outline">
              Create payment link
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-brand-gray-900 mb-4">Items</h2>
            <div className="divide-y divide-brand-gray-200">
              {order.items.map((item, idx) => {
                const p = item.productId ? productsById[item.productId] : undefined;
                const href = p?.slug ? `/product/${p.slug}` : null;
                const title = p?.title || item.name;
                return (
                  <div key={`${item.productId || item.name}-${idx}`} className="py-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      {href ? (
                        <Link href={href} className="font-medium text-brand-green hover:underline">
                          {title}
                        </Link>
                      ) : (
                        <div className="font-medium text-brand-gray-900">{title}</div>
                      )}
                      <div className="text-sm text-brand-gray-500">
                        Qty: {item.quantity} · {formatCurrency(item.price)}
                      </div>
                      {item.options && Object.keys(item.options).length > 0 && (
                        <div className="text-xs text-brand-gray-500 mt-1">
                          {Object.entries(item.options)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" · ")}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-brand-gray-900 whitespace-nowrap">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-brand-gray-900 mb-4">Order details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-brand-gray-500">Customer</span>
                <span className="text-brand-gray-900 font-medium">{order.customer_name}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-brand-gray-500">Phone</span>
                <span className="text-brand-gray-900 font-medium">{order.phone}</span>
              </div>
              {order.email && (
                <div className="flex justify-between gap-4">
                  <span className="text-brand-gray-500">Email</span>
                  <span className="text-brand-gray-900 font-medium">{order.email}</span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-brand-gray-500">Status</span>
                <span className="text-brand-gray-900 font-medium">{order.status}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-brand-gray-500">Payment</span>
                <span className="text-brand-gray-900 font-medium">{order.payment_method}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-brand-gray-500">Created</span>
                <span className="text-brand-gray-900 font-medium">{formatDateTime(order.created_at)}</span>
              </div>
              <div className="pt-3 mt-3 border-t border-brand-gray-200 flex justify-between gap-4">
                <span className="text-brand-gray-500">Total</span>
                <span className="text-brand-green font-bold">
                  {formatCurrency(order.total_amount || order.total || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

