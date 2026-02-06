"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Order } from "@/lib/db";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function fetchOrders() {
      try {
        const response = await axios.get(`/api/admin/orders?status=${filter === "all" ? "" : filter}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [router, filter]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    const token = localStorage.getItem("admin_token");
    try {
      await axios.put(
        `/api/admin/orders/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: status as any } : o)));
    } catch (error) {
      alert("Failed to update order status");
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Customer", "Phone", "Email", "Total", "Status", "Payment Method", "Date"];
    const rows = orders.map((order) => [
      order.id.slice(0, 8),
      order.customer_name,
      order.phone,
      order.email || "",
      formatCurrency(order.total_amount || order.total || 0),
      order.status,
      order.payment_method,
      formatDateTime(order.created_at),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white border-b border-brand-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-brand-gray-600 hover:text-brand-green">
                ← Dashboard
              </Link>
              <h1 className="font-heading font-bold text-xl text-brand-gray-900">Orders</h1>
            </div>
            <button type="button" onClick={exportCSV} className="btn-outline">
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex gap-2">
          {["all", "pending", "paid", "failed", "shipped"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? "bg-brand-green text-white"
                  : "bg-white text-brand-gray-900 border-2 border-brand-gray-200 hover:border-brand-green"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200">
              <thead className="bg-brand-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-brand-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-brand-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-brand-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-brand-gray-600">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-brand-gray-900">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-brand-gray-500">{order.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-green">
                        {formatCurrency(order.total_amount || order.total || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            order.status === "paid"
                              ? "bg-brand-green/10 text-brand-green"
                              : order.status === "pending"
                              ? "bg-brand-pink/10 text-brand-pink"
                              : order.status === "failed"
                              ? "bg-brand-red/10 text-brand-red"
                              : "bg-brand-gray-100 text-brand-gray-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-600 capitalize">
                        {order.payment_method}
                        {order.mpesa_receipt_number && (
                          <div className="text-xs text-brand-gray-500 font-mono">
                            {order.mpesa_receipt_number}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-600">
                        {formatDateTime(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                        {order.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, "paid")}
                              className="text-brand-green hover:text-brand-green/80"
                            >
                              Mark Paid
                            </button>
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, "failed")}
                              className="text-brand-red hover:text-brand-red/80"
                            >
                              Mark Failed
                            </button>
                          </>
                        )}
                        {order.status === "paid" && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, "shipped")}
                            className="text-brand-green hover:text-brand-green/80"
                          >
                            Mark Shipped
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

