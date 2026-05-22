"use client";

import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export type PesapalPaymentModalProps = {
  paymentUrl: string;
  orderId: string;
  onClose: () => void;
  onComplete: (orderId: string, trackingId: string) => void;
};

export default function PesapalPaymentModal({
  paymentUrl,
  orderId,
  onClose,
  onComplete,
}: PesapalPaymentModalProps) {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (
        event.data?.type === "PESAPAL_PAYMENT_DONE" &&
        event.data.orderId === orderId
      ) {
        onComplete(orderId, event.data.trackingId || "");
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [orderId, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Secure payment"
    >
      <div className="bg-white w-full sm:max-w-lg sm:rounded-xl shadow-xl flex flex-col h-[92vh] sm:h-[min(640px,85vh)]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-brand-gray-200 shrink-0">
          <p className="font-semibold text-sm text-brand-gray-900">
            Pay securely — M-Pesa or card
          </p>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-brand-gray-100 text-brand-gray-600"
            aria-label="Close payment window"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <iframe
          src={paymentUrl}
          title="Pesapal secure checkout"
          className="flex-1 w-full border-0"
          allow="payment *"
        />
      </div>
    </div>
  );
}
