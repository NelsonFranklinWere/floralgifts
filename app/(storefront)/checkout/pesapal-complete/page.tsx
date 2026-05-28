"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function PesapalCompleteContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    const orderId = searchParams.get("OrderMerchantReference");
    const trackingId = searchParams.get("OrderTrackingId");

    if (!orderId || !trackingId) {
      setMessage("Payment response incomplete. You can close this window.");
      return;
    }

    fetch("/api/pesapal/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        OrderTrackingId: trackingId,
        OrderMerchantReference: orderId,
        OrderNotificationType: "CALLBACKURL",
      }),
    })
      .catch(() => {})
      .finally(() => {
        if (window.parent !== window) {
          window.parent.postMessage(
            {
              type: "PESAPAL_PAYMENT_DONE",
              orderId,
              trackingId,
            },
            window.location.origin
          );
          setMessage("Payment submitted. Returning to your order...");
        } else {
          window.location.href = `/order/success?id=${orderId}&pesapal_tracking_id=${trackingId}`;
        }
      });
  }, [searchParams]);

  return (
    <div className="min-h-[200px] flex items-center justify-center p-8 bg-white">
      <p className="text-sm text-brand-gray-700 text-center">{message}</p>
    </div>
  );
}

export default function PesapalCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <p className="text-sm text-brand-gray-600">Loading...</p>
        </div>
      }
    >
      <PesapalCompleteContent />
    </Suspense>
  );
}
