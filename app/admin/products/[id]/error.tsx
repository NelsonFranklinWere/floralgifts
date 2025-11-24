"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Edit product error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brand-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-brand-gray-900 mb-4">Something went wrong!</h2>
        <p className="text-brand-gray-600 mb-6">
          {error.message || "An unexpected error occurred while loading the product."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary"
          >
            Try again
          </button>
          <Link href="/admin/products" className="btn-outline">
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}


