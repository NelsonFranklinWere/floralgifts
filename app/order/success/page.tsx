"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { SHOP_INFO } from "@/lib/constants";
import type { Order } from "@/lib/db";
import axios from "axios";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    async function fetchOrder() {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);
        
        // If order is pending and has mpesa_checkout_request_id, start polling
        if (response.data.status === "pending" && response.data.mpesa_checkout_request_id) {
          setIsPolling(true);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  // Poll for payment status if order is pending with STK push
  useEffect(() => {
    if (!orderId || !isPolling || !order) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        const updatedOrder = response.data;
        setOrder(updatedOrder);

        // Stop polling if payment is confirmed
        if (updatedOrder.status === "paid") {
          setIsPolling(false);
          clearInterval(pollInterval);
          
          // Redirect to WhatsApp after payment confirmation
          const hasRedirected = sessionStorage.getItem(`whatsapp_redirected_${orderId}`);
          if (!hasRedirected) {
            setTimeout(() => {
              const whatsappMessage = `Hello! I just completed payment for order #${orderId.slice(0, 8)}. Please confirm receipt and delivery details.`;
              const whatsappLink = `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
              window.open(whatsappLink, "_blank");
              sessionStorage.setItem(`whatsapp_redirected_${orderId}`, "true");
              console.log("WhatsApp redirect triggered for order:", orderId);
            }, 2000); // Wait 2 seconds before opening WhatsApp
          }
        }
      } catch (error) {
        console.error("Error polling order status:", error);
      }
    }, 3000); // Poll every 3 seconds

    // Stop polling after 2 minutes (40 attempts)
    const timeout = setTimeout(() => {
      setIsPolling(false);
      clearInterval(pollInterval);
    }, 120000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [orderId, isPolling, order]);

  // Also check if order is already paid when component loads and redirect to WhatsApp
  useEffect(() => {
    if (order && order.status === "paid" && !isPolling) {
      // Only redirect once, check if we haven't redirected yet
      const hasRedirected = sessionStorage.getItem(`whatsapp_redirected_${orderId}`);
      if (!hasRedirected) {
        setTimeout(() => {
          const whatsappMessage = `Hello! I just completed payment for order #${orderId?.slice(0, 8)}. Please confirm receipt and delivery details.`;
          const whatsappLink = `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
          window.open(whatsappLink, "_blank");
          sessionStorage.setItem(`whatsapp_redirected_${orderId}`, "true");
        }, 2000);
      }
    }
  }, [order, orderId, isPolling]);

  if (isLoading) {
    return (
      <div className="py-12 bg-white min-h-screen">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-12 bg-white min-h-screen">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-4">
            Order Not Found
          </h1>
          <Link href="/collections" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-2">
            {order.status === "pending" ? "Payment Pending" : order.status === "paid" ? "Order Confirmed!" : "Order Failed"}
          </h1>
          <p className="text-brand-gray-600">
            {order.status === "pending" && order.mpesa_checkout_request_id
              ? "Waiting for M-Pesa payment confirmation. Please check your phone and enter your PIN."
              : order.status === "paid"
              ? "Thank you for your order. We'll process it shortly."
              : "Your payment could not be processed. Please try again or contact support."}
          </p>
          {isPolling && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-brand-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-green"></div>
              <span>Checking payment status...</span>
            </div>
          )}
        </div>

        <div className="card p-6 mb-6">
          <h2 className="font-heading font-semibold text-xl mb-4">Order Details</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-brand-gray-600">Order ID:</span>
              <span className="font-medium">{order.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray-600">Status:</span>
              <span className={`font-medium ${
                order.status === "paid" ? "text-brand-green" :
                order.status === "pending" ? "text-brand-pink" :
                "text-brand-red"
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            {order.mpesa_receipt_number && (
              <div className="flex justify-between">
                <span className="text-brand-gray-600">MPESA Receipt:</span>
                <span className="font-medium font-mono">{order.mpesa_receipt_number}</span>
              </div>
            )}
                <div className="flex justify-between">
                  <span className="text-brand-gray-600">Total:</span>
                  <span className="font-semibold text-brand-green text-lg">
                    {formatCurrency(order.total_amount || order.total || 0)}
                  </span>
                </div>
          </div>

          <div className="border-t border-brand-gray-200 pt-4 space-y-2">
            <p className="text-brand-gray-900">
              <span className="font-semibold">Customer:</span> {order.customer_name}
            </p>
            <p className="text-brand-gray-900">
              <span className="font-semibold">Phone:</span> {order.phone}
            </p>
            <p className="text-brand-gray-900">
              <span className="font-semibold">Delivery Address:</span> {order.delivery_address}
            </p>
            <p className="text-brand-gray-900">
              <span className="font-semibold">Delivery Date:</span> {formatDateTime(order.delivery_date)}
            </p>
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h2 className="font-heading font-semibold text-xl mb-4">Order Items</h2>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-brand-gray-700">
                  {item.quantity}x {item.name}
                  {item.options && ` (${Object.values(item.options).join(", ")})`}
                </span>
                <span className="font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/collections" className="btn-outline flex-1 text-center">
            Continue Shopping
          </Link>
          <a
            href={`https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(`Hello! I placed order ${order.id.slice(0, 8)}. Please confirm delivery details.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 text-center"
          >
            Contact via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="py-12 bg-white min-h-screen">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

