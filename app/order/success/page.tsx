"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { SHOP_INFO } from "@/lib/constants";
import type { Order } from "@/lib/db";
import axios from "axios";
import { useCartStore } from "@/lib/store/cart";
import { Analytics } from "@/lib/analytics";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const isPaymentPending = searchParams.get("pending") === "true";
  const pesapalTrackingId = searchParams.get("pesapal_tracking_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [cartCleared, setCartCleared] = useState(false);
  const [paymentTimedOut, setPaymentTimedOut] = useState(false);
  const { clearCart } = useCartStore();

  const openWhatsAppForOrder = (id: string) => {
    try {
      if (sessionStorage.getItem(`whatsapp_redirected_${id}`)) return;
      sessionStorage.setItem(`whatsapp_redirected_${id}`, "true");
    } catch {
      /* private mode */
    }
    const whatsappMessage = `Hello! I just completed payment for order #${id.slice(0, 8)}. Please confirm receipt and delivery details.`;
    const whatsappLink = `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
    window.location.href = whatsappLink;
  };

  const scheduleWhatsAppRedirect = (id: string, delayMs = 2000) => {
    try {
      if (sessionStorage.getItem(`whatsapp_redirected_${id}`)) return;
      if (sessionStorage.getItem(`whatsapp_timer_started_${id}`)) return;
      sessionStorage.setItem(`whatsapp_timer_started_${id}`, "true");
    } catch {
      /* private mode */
    }
    window.setTimeout(() => {
      axios
        .get(`/api/orders/${id}`)
        .then((response) => {
          if (response.data?.status === "paid") {
            openWhatsAppForOrder(id);
          }
        })
        .catch(() => {
          openWhatsAppForOrder(id);
        });
    }, delayMs);
  };

  // Fire Meta Purchase once when payment is confirmed
  useEffect(() => {
    if (!order || order.status !== "paid" || !orderId) return;
    try {
      const key = `fw_purchase_tracked_${orderId}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode */
    }

    const contentIds = Array.isArray(order.items)
      ? order.items.map((item) => item.productId).filter(Boolean)
      : [];
    const numItems = Array.isArray(order.items)
      ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
      : undefined;

    Analytics.trackPurchase(
      orderId,
      order.total_amount || order.total || 0,
      order.payment_method || "unknown",
      { contentIds, numItems }
    );
  }, [order, orderId]);

  // Initial load: fetch order, re-verify Pesapal if needed, start polling while pending
  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    async function loadAndConfirm() {
      try {
        // After Pesapal redirect, confirm transaction with Pesapal and mark order paid
        const trackingId =
          pesapalTrackingId ||
          undefined;

        if (trackingId) {
          try {
            await axios.post("/api/pesapal/status", {
              orderId,
              orderTrackingId: trackingId,
            });
          } catch (confirmErr) {
            console.error("Pesapal confirm on success page failed:", confirmErr);
          }
        }

        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);

        if (response.data.status === "paid") {
          clearCart();
          sessionStorage.removeItem("pendingOrder");
          setCartCleared(true);
          scheduleWhatsAppRedirect(orderId!);
          return;
        }

        // Still pending — poll DB (and re-check Pesapal when tracking id present)
        if (
          response.data.status === "pending" &&
          (response.data.mpesa_checkout_request_id ||
            response.data.pesapal_order_tracking_id ||
            trackingId)
        ) {
          setIsPolling(true);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAndConfirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, pesapalTrackingId]);

  // Poll while pending — re-verify Pesapal each cycle when tracking id exists
  useEffect(() => {
    if (!orderId || !isPolling) return;

    const pollInterval = setInterval(async () => {
      try {
        const tracking =
          pesapalTrackingId ||
          order?.pesapal_order_tracking_id ||
          null;

        if (tracking) {
          try {
            await axios.post("/api/pesapal/status", {
              orderId,
              orderTrackingId: tracking,
            });
          } catch {
            /* keep polling DB */
          }
        }

        const response = await axios.get(`/api/orders/${orderId}`);
        const updatedOrder = response.data;
        setOrder(updatedOrder);

        if (updatedOrder.status === "paid") {
          setIsPolling(false);
          clearInterval(pollInterval);
          if (!cartCleared) {
            clearCart();
            sessionStorage.removeItem("pendingOrder");
            setCartCleared(true);
          }
          scheduleWhatsAppRedirect(orderId);
        } else if (updatedOrder.status === "failed" || updatedOrder.status === "cancelled") {
          setIsPolling(false);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error("Error polling order status:", error);
      }
    }, 3000);

    const timeout = setTimeout(() => {
      setIsPolling(false);
      clearInterval(pollInterval);
      setPaymentTimedOut(true);
    }, 120000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [orderId, isPolling, pesapalTrackingId, order?.pesapal_order_tracking_id, cartCleared, clearCart]);

  // Paid on load / after state change → WhatsApp
  useEffect(() => {
    if (!order || order.status !== "paid" || !orderId) return;

    if (!cartCleared) {
      clearCart();
      sessionStorage.removeItem("pendingOrder");
      setCartCleared(true);
    }

    scheduleWhatsAppRedirect(orderId);
  }, [order?.status, orderId, cartCleared, clearCart]);

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
            {order.status === "pending" && paymentTimedOut ? "Payment Timed Out" : order.status === "pending" ? "Payment Pending" : order.status === "paid" ? "Order Confirmed!" : "Order Failed"}
          </h1>
          <p className="text-brand-gray-600">
            {order.status === "pending" && paymentTimedOut
              ? "Payment confirmation timed out. Please try using alternative payment methods below."
              : order.status === "pending" && order.mpesa_checkout_request_id
              ? "Waiting for M-Pesa payment confirmation. Please check your phone and enter your PIN."
              : order.status === "pending" && order.pesapal_order_tracking_id
              ? "Processing your card payment. Please wait while we confirm the transaction..."
              : order.status === "paid"
              ? "Thank you for your order. Redirecting you to WhatsApp to confirm delivery details…"
              : "Your M-Pesa STK Push payment could not be processed. Please try using M-Pesa Till Number or Paybill instead, or contact support."}
          </p>
          {isPolling && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-brand-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-green"></div>
              <span>Checking payment status...</span>
            </div>
          )}
          {isPaymentPending && order.status === "pending" && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Your cart is safe:</strong> Items will remain in your cart until payment is confirmed.
                If payment fails, you can easily retry without losing your selection.
              </p>
            </div>
          )}
          {cartCleared && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                ✅ <strong>Payment confirmed!</strong> Your cart has been cleared and order is now being processed.
              </p>
            </div>
          )}
          {(order.status === "failed" || paymentTimedOut) && isPaymentPending && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>💡 Payment didn&apos;t complete. Try these alternative methods:</strong>
              </p>
              <ul className="text-xs text-yellow-700 space-y-1 ml-4">
                <li>• <strong>M-Pesa Till Number:</strong> {SHOP_INFO.mpesa.till}</li>
                <li>• <strong>M-Pesa Paybill:</strong> {SHOP_INFO.mpesa.paybill} (Account: {SHOP_INFO.mpesa.account})</li>
              </ul>
              <p className="text-xs text-yellow-700 mt-2">
                These methods are processed manually and will be confirmed via WhatsApp.
              </p>
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
                <span className="text-brand-gray-600">M-Pesa Receipt:</span>
                <span className="font-medium font-mono">{order.mpesa_receipt_number}</span>
              </div>
            )}
            {order.pesapal_confirmation_code && (
              <div className="flex justify-between">
                <span className="text-brand-gray-600">Confirmation Code:</span>
                <span className="font-medium font-mono">{order.pesapal_confirmation_code}</span>
              </div>
            )}
            {order.pesapal_payment_method && (
              <div className="flex justify-between">
                <span className="text-brand-gray-600">Payment Method:</span>
                <span className="font-medium">{order.pesapal_payment_method}</span>
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
          {(order.status === "failed" || paymentTimedOut) && isPaymentPending && !cartCleared && (
            <Link href="/checkout" className="btn-primary flex-1 text-center">
              Try Alternative Payment
            </Link>
          )}
          {order.status !== "failed" && (
            <a
              href={`https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(`Hello! I placed order ${order.id.slice(0, 8)}. Please confirm delivery details.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex-1 text-center"
            >
              Contact via WhatsApp
            </a>
          )}
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

