"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface BackButtonProps {
  fallbackHref?: string;
  className?: string;
  label?: string;
}

export default function BackButton({
  fallbackHref = "/collections",
  className = "btn-outline",
  label = "Back",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        // Works well for in-site navigation; fallback covers direct visits/new tabs.
        router.back();
      }}
      className={className}
      aria-label={label}
    >
      {label}
      <span className="sr-only">
        {" "}
        (If this page was opened directly, use{" "}
        <Link href={fallbackHref}>{fallbackHref}</Link>)
      </span>
    </button>
  );
}

