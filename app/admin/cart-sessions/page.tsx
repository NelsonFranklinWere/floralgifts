"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { formatCurrency } from "@/lib/utils";

interface CartSessionItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartSession {
  session_id: string;
  status: "active" | "converted" | "abandoned";
  items: CartSessionItem[];
  cart_total: number;
  fields: Record<string, string | undefined>;
  path?: string;
  converted_order_id?: string | null;
  created_at: string;
  updated_at: string;
}

function displayName(fields: CartSession["fields"]) {
  const full = [fields.first_name, fields.last_name].filter(Boolean).join(" ").trim();
  return full || fields.name || "—";
}

function displayContact(fields: CartSession["fields"]) {
  return fields.phone || fields.stk_phone || fields.recipient_phone || fields.email || "—";
}

export default function AdminCartSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<CartSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "converted">("all");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    (async () => {
      try {
        const res = await axios.get("/api/admin/cart-sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const filtered = sessions.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <p className="text-brand-gray-600">Loading cart sessions…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/admin" className="text-sm text-brand-green hover:underline">
              ← Admin
            </Link>
            <h1 className="mt-2 font-heading text-2xl font-bold text-brand-gray-900">
              Cart &amp; checkout leads
            </h1>
            <p className="mt-1 text-sm text-brand-gray-600">
              Cart from add-to-cart, plus details saved as they type on checkout
            </p>
          </div>
          <div className="flex gap-2">
            {(["all", "active", "converted"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-sm capitalize ${
                  filter === f
                    ? "bg-brand-green text-white"
                    : "bg-white text-brand-gray-700 border border-brand-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-brand-gray-200 bg-white p-8 text-center text-brand-gray-600">
            No cart sessions yet. They appear when someone adds to cart or fills checkout.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((s) => (
              <article
                key={s.session_id}
                className="rounded-lg border border-brand-gray-200 bg-white p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-brand-gray-900">{displayName(s.fields)}</p>
                    <p className="text-sm text-brand-gray-600">{displayContact(s.fields)}</p>
                    {s.fields.email && displayContact(s.fields) !== s.fields.email && (
                      <p className="text-sm text-brand-gray-500">{s.fields.email}</p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        s.status === "converted"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {s.status}
                    </span>
                    <p className="mt-1 text-brand-gray-500">
                      {new Date(s.updated_at).toLocaleString()}
                    </p>
                    <p className="font-medium text-brand-gray-900">
                      {formatCurrency(s.cart_total || 0)}
                    </p>
                  </div>
                </div>

                {(s.fields.address || s.fields.city || s.fields.delivery_address) && (
                  <p className="mt-2 text-sm text-brand-gray-600">
                    {[
                      s.fields.address || s.fields.delivery_address,
                      s.fields.apartment,
                      s.fields.city || s.fields.delivery_location,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                {s.items?.length > 0 && (
                  <ul className="mt-3 border-t border-brand-gray-100 pt-3 text-sm text-brand-gray-700">
                    {s.items.map((item, idx) => (
                      <li key={`${item.id}-${idx}`} className="flex justify-between gap-2 py-0.5">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-brand-gray-500">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {s.converted_order_id && (
                  <p className="mt-2 text-xs text-brand-gray-500">
                    Order {s.converted_order_id.slice(0, 8)}…
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
