"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { formatCurrency } from "@/lib/utils";

interface SaleProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  images: string[];
  stock: number | null;
  in_sale_catalog: boolean;
  updated_at: string;
}

const MAX_FEED_PRODUCTS = 20;

export default function AdminSaleCatalogPage() {
  const router = useRouter();
  const [products, setProducts] = useState<SaleProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [feedUrl, setFeedUrl] = useState("/feeds/meta.csv");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFeedUrl(`${window.location.origin}/feeds/meta.csv`);

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function fetchProducts() {
      try {
        const response = await axios.get("/api/admin/sale-catalog", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
          return;
        }
        console.error("Error fetching sale catalog:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [router]);

  const inCatalogCount = useMemo(
    () => products.filter((p) => p.in_sale_catalog).length,
    [products]
  );

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (q && !p.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search, categoryFilter]);

  async function toggleProduct(product: SaleProduct) {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setSavingId(product.id);
    try {
      await axios.put(
        "/api/admin/sale-catalog",
        { id: product.id, in_sale_catalog: !product.in_sale_catalog },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, in_sale_catalog: !product.in_sale_catalog }
            : p
        )
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
        return;
      }
      alert(error.response?.data?.message || "Failed to update product");
    } finally {
      setSavingId(null);
    }
  }

  function copyFeedUrl() {
    navigator.clipboard.writeText(feedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading sale catalog...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white border-b border-brand-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm text-brand-gray-500 hover:text-brand-green"
            >
              ← Dashboard
            </Link>
            <h1 className="font-heading font-bold text-xl text-brand-gray-900">
              Sale Catalog (Meta)
            </h1>
          </div>
          <Link href="/sale" target="_blank" className="btn-outline text-sm">
            View Sale page →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-6 mb-6">
          <h2 className="font-heading font-bold text-lg text-brand-gray-900 mb-2">
            Meta Catalog feed
          </h2>
          <p className="text-sm text-brand-gray-600 mb-3">
            Paste this CSV feed URL into Meta Commerce Manager (Catalog → Data
            sources → Data feed) to sync products in the Sale catalog with
            Facebook &amp; Instagram. The feed includes up to{" "}
            {MAX_FEED_PRODUCTS} products marked below.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <code className="flex-1 bg-brand-gray-100 rounded-md px-3 py-2 text-sm text-brand-gray-800 break-all">
              {feedUrl}
            </code>
            <button
              type="button"
              onClick={copyFeedUrl}
              className="btn-primary-sm whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy URL"}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
          <div className="text-sm text-brand-gray-700">
            <span
              className={`font-bold ${
                inCatalogCount > MAX_FEED_PRODUCTS
                  ? "text-brand-red"
                  : "text-brand-green"
              }`}
            >
              {inCatalogCount}
            </span>{" "}
            product{inCatalogCount === 1 ? "" : "s"} in the Sale catalog
            {inCatalogCount > MAX_FEED_PRODUCTS && (
              <span className="text-brand-red">
                {" "}
                — only the first {MAX_FEED_PRODUCTS} added appear on the Sale
                page and in the feed
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-md border border-brand-gray-300 px-3 py-2 text-sm w-48"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-brand-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-gray-200">
            <thead className="bg-brand-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-gray-600 uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-gray-600 uppercase">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-gray-600 uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-gray-600 uppercase">
                  In Sale catalog
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-brand-gray-600 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-100 bg-white">
              {visibleProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-brand-gray-100 flex-shrink-0" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-brand-gray-900">
                          {product.title}
                        </div>
                        {(!product.images || product.images.length === 0) && (
                          <div className="text-xs text-brand-red">
                            No image — excluded from Meta feed
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-brand-gray-600 capitalize">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-brand-gray-900">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    {product.in_sale_catalog ? (
                      <span className="inline-flex items-center rounded-full bg-brand-green/10 px-2.5 py-0.5 text-xs font-medium text-brand-green">
                        In catalog
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-brand-gray-100 px-2.5 py-0.5 text-xs font-medium text-brand-gray-500">
                        Not listed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleProduct(product)}
                      disabled={savingId === product.id}
                      className={`text-sm font-medium disabled:opacity-50 ${
                        product.in_sale_catalog
                          ? "text-brand-red hover:text-brand-red/80"
                          : "text-brand-green hover:text-brand-green/80"
                      }`}
                    >
                      {savingId === product.id
                        ? "Saving..."
                        : product.in_sale_catalog
                        ? "− Remove"
                        : "+ Add"}
                    </button>
                  </td>
                </tr>
              ))}
              {visibleProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-brand-gray-500"
                  >
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
