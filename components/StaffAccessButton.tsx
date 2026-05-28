"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogIn, LogOut, X } from "lucide-react";
import { getStaffToken, clearStaffSession } from "@/lib/staff-client";

/** Discreet storefront control — staff login is not linked in the footer. */
export default function StaffAccessButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSignedIn(!!getStaffToken());
  }, [pathname, open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (pathname?.startsWith("/staff")) return null;

  const handleSignOut = async () => {
    try {
      await fetch("/api/staff/logout", { method: "POST", credentials: "include" });
    } catch {
      /* ignore */
    }
    clearStaffSession();
    setSignedIn(false);
    setOpen(false);
  };

  return (
    <div ref={panelRef} className="fixed bottom-20 left-4 z-[45] flex flex-col items-start gap-2">
      {open && (
        <div
          className="rounded-xl border border-brand-gray-200 bg-white shadow-lg py-2 min-w-[180px]"
          role="menu"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-brand-gray-100">
            <span className="text-xs font-semibold text-brand-gray-900">Staff</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-brand-gray-50 text-brand-gray-600"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {signedIn ? (
            <>
              <Link
                href="/staff"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-brand-gray-800 hover:bg-brand-gray-50 hover:text-brand-red"
                onClick={() => setOpen(false)}
              >
                <LayoutGrid className="h-4 w-4" />
                Open dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-brand-gray-800 hover:bg-brand-gray-50 hover:text-brand-red"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/staff/login"
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-brand-gray-800 hover:bg-brand-gray-50 hover:text-brand-red"
              onClick={() => setOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              Staff sign in
            </Link>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gray-200 bg-white/90 text-brand-gray-600 shadow-md backdrop-blur-sm opacity-40 hover:opacity-100 hover:text-brand-red hover:border-brand-red/30 transition-all"
        aria-label={open ? "Close staff menu" : "Open staff menu"}
        aria-expanded={open}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  );
}
