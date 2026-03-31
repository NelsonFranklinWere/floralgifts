"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { formatCurrency } from "@/lib/utils";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  requiresPhone: boolean;
  requiresEmail: boolean;
}

interface PaymentLinkData {
  orderId: string;
  paymentMethod: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  amount: number;
  description?: string;
  paymentLink: string;
  instructions: string;
  createdAt: string;
}

export default function AdminPaymentLinksPage() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [createdLinks, setCreatedLinks] = useState<PaymentLinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    amount: "",
    paymentMethod: "pesapal",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function fetchPaymentMethods() {
      try {
        const response = await axios.get("/api/admin/payment-links", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPaymentMethods(response.data.paymentMethods || []);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchPaymentMethods();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethod);
      
      // Validate required fields based on payment method
      if (!formData.customerName || !formData.amount || !formData.paymentMethod) {
        setError("Please fill in all required fields");
        setIsCreating(false);
        return;
      }

      if (selectedMethod?.requiresPhone && !formData.customerPhone) {
        setError("Phone number is required for this payment method");
        setIsCreating(false);
        return;
      }

      const response = await axios.post("/api/admin/payment-links", {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone || undefined,
        customerEmail: formData.customerEmail || undefined,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        description: formData.description || "Payment for manual order",
        orderNotes: "Admin created payment link"
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newLink = response.data.data;
      setCreatedLinks([newLink, ...createdLinks]);
      
      // Reset form
      setFormData({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        amount: "",
        paymentMethod: "pesapal",
        description: "",
      });

      setSuccess("Payment link created successfully!");
      
      // Copy link to clipboard if it's a Pesapal link
      if (formData.paymentMethod === "pesapal" && newLink.paymentLink) {
        navigator.clipboard.writeText(newLink.paymentLink);
        setSuccess(prev => prev + " Payment link copied to clipboard!");
      }

    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create payment link");
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Link copied to clipboard!");
    setTimeout(() => setSuccess(""), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
        <div className="text-brand-gray-600">Loading payment methods...</div>
      </div>
    );
  }

  const selectedMethod = paymentMethods.find(m => m.id === formData.paymentMethod);

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white border-b border-brand-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-brand-gray-600 hover:text-brand-green">
                ← Dashboard
              </Link>
              <h1 className="font-heading font-bold text-xl text-brand-gray-900">Payment Links</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Payment Link Form */}
          <div className="card">
            <h2 className="text-lg font-semibold text-brand-gray-900 mb-6">Create Payment Link</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-brand-red/10 border border-brand-red rounded-md text-brand-red text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-brand-green/10 border border-brand-green rounded-md text-brand-green text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  required
                >
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-brand-gray-500">
                  {selectedMethod?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                  Amount (KES) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              {selectedMethod?.requiresPhone && (
                <div>
                  <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                    placeholder="2547XXXXXXXX"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  placeholder="customer@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  rows={3}
                  placeholder="Payment for manual order..."
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Payment Link"}
              </button>
            </form>
          </div>

          {/* Created Links */}
          <div className="card">
            <h2 className="text-lg font-semibold text-brand-gray-900 mb-6">Recent Payment Links</h2>
            
            {createdLinks.length === 0 ? (
              <div className="text-center py-8 text-brand-gray-500">
                No payment links created yet
              </div>
            ) : (
              <div className="space-y-4">
                {createdLinks.map((link, index) => (
                  <div key={`${link.orderId}-${index}`} className="border border-brand-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-brand-gray-900">{link.customerName}</h3>
                        <p className="text-sm text-brand-gray-600">{link.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-brand-green">{formatCurrency(link.amount)}</p>
                        <p className="text-xs text-brand-gray-500">
                          {new Date(link.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {link.paymentLink && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={link.paymentLink}
                            readOnly
                            className="flex-1 px-2 py-1 text-xs bg-brand-gray-50 border border-brand-gray-200 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => copyToClipboard(link.paymentLink)}
                            className="px-3 py-1 text-xs bg-brand-green text-white rounded hover:bg-brand-green/90"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="mt-2 text-xs text-brand-gray-600">{link.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
