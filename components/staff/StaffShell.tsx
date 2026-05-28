"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  clearStaffSession,
  bootstrapStaffSession,
  getCachedStaffUser,
  getStaffToken,
  isSessionExpired,
  touchActivity,
  redirectStaffToLogin,
} from "@/lib/staff-client";
import type { StaffUser } from "@/lib/staff-client";
import { StaffAlertsProvider } from "./StaffAlertsProvider";
import StaffSidebar from "./StaffSidebar";
import { Menu, Bell, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

function MainSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="h-9 w-9 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
      <p className="text-sm text-brand-gray-800">Loading…</p>
    </div>
  );
}

function readCachedSession(): { user: StaffUser | null; ready: boolean } {
  if (typeof window === "undefined") return { user: null, ready: false };
  if (isSessionExpired()) return { user: null, ready: false };
  const token = getStaffToken();
  if (!token) return { user: null, ready: false };
  const user = getCachedStaffUser();
  if (user) return { user, ready: true };
  return { user: null, ready: false };
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<StaffUser | null>(() => readCachedSession().user);
  const [authReady, setAuthReady] = useState(() => readCachedSession().ready);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (isSessionExpired()) {
        await redirectStaffToLogin();
        return;
      }

      const sessionUser = await bootstrapStaffSession();
      if (cancelled) return;

      if (!sessionUser) {
        await redirectStaffToLogin();
        return;
      }

      setUser(sessionUser);
      setAuthReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!authReady) return;

    const interval = setInterval(() => {
      if (isSessionExpired()) {
        void redirectStaffToLogin();
      }
    }, 60000);
    let lastTouch = 0;
    const onActivity = () => {
      const now = Date.now();
      if (now - lastTouch < 10_000) return;
      lastTouch = now;
      touchActivity();
    };
    window.addEventListener("click", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity);
    return () => {
      clearInterval(interval);
      window.removeEventListener("click", onActivity);
      window.removeEventListener("keydown", onActivity);
    };
  }, [authReady, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/staff/logout", { method: "POST", credentials: "include" });
    } catch {
      /* ignore */
    }
    clearStaffSession();
    router.push("/staff/login");
  };

  const segment = pathname.split("/").filter(Boolean)[1] || "dashboard";
  const isLiveVisitors = pathname.startsWith("/staff/live-visitors");
  const showContent = authReady && user;

  const shell = (
    <div className="staff-app min-h-screen flex bg-white">
      {sidebarOpen && user && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <div className="relative z-10 h-full shadow-xl">
            <StaffSidebar
              role={user.role}
              onLogout={handleLogout}
              onNavigate={() => setSidebarOpen(false)}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0 w-full">
        <header className="sticky top-0 z-[60] bg-white border-b border-brand-gray-200 shadow-sm">
          <div className="flex h-16 md:h-[4.5rem] items-center justify-between gap-4 px-4 lg:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-brand-gray-50 text-brand-gray-900"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open admin menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/staff" className="flex items-center gap-3 shrink-0">
                <Image
                  src="/images/logo/FloralLogo.jpg"
                  alt=""
                  width={48}
                  height={48}
                  className="rounded-lg h-10 w-10 md:h-12 md:w-12 object-cover"
                />
              </Link>
              <div className="min-w-0 border-l border-brand-gray-200 pl-3">
                <p
                  className="font-heading text-sm md:text-base font-semibold text-brand-gray-900 capitalize truncate"
                  suppressHydrationWarning
                >
                  {segment.replace(/-/g, " ")}
                </p>
                <p className="text-[11px] text-brand-gray-800 hidden sm:block">
                  Floral Whispers Gifts · Admin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Link
                href="/staff/live-visitors"
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors",
                  isLiveVisitors
                    ? "bg-brand-green/10 text-brand-green"
                    : "text-brand-gray-800 hover:bg-brand-gray-50 hover:text-brand-red"
                )}
                title="Live visitors"
              >
                <Radio className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Live visitors</span>
              </Link>
              <Link
                href="/"
                target="_blank"
                className="hidden md:inline-flex text-xs font-medium text-brand-gray-800 hover:text-brand-red transition-colors px-2"
              >
                View store
              </Link>
              <Link
                href="/staff/messages"
                className="p-2 rounded-lg hover:bg-brand-gray-50 text-brand-gray-800 hover:text-brand-red transition-colors"
                aria-label="Messages"
              >
                <Bell className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-brand-gray-200">
                {user && (
                  <>
                    <div className="hidden sm:block text-right max-w-[140px]">
                      <p className="text-xs font-medium text-brand-gray-900 truncate">
                        {user.name || user.email.split("@")[0]}
                      </p>
                      <p className="text-[10px] text-brand-gray-800 truncate">{user.email}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-brand-red">
                      {(user.name || user.email).slice(0, 2).toUpperCase()}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto bg-[#FAF7F2]">
          <div className="mx-auto max-w-7xl">
            {showContent ? children : <MainSpinner />}
          </div>
        </main>
      </div>
    </div>
  );

  if (!showContent) return shell;

  return <StaffAlertsProvider>{shell}</StaffAlertsProvider>;
}

export default function StaffShell({ children }: { children: React.ReactNode }) {
  return <ShellInner>{children}</ShellInner>;
}
