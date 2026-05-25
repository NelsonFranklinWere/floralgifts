"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  clearStaffSession,
  getStaffToken,
  getCachedStaffUser,
  isSessionExpired,
  touchActivity,
} from "@/lib/staff-client";
import type { StaffUser } from "@/lib/staff-client";
import { StaffRealtimeProvider } from "./StaffRealtimeProvider";
import { StaffAlertsProvider } from "./StaffAlertsProvider";
import { Menu, Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";

const StaffSidebar = dynamic(() => import("./StaffSidebar"), { ssr: false });

function ShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<StaffUser | null>(() => getCachedStaffUser());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getStaffToken();
    if (!token || isSessionExpired()) {
      clearStaffSession();
      router.push("/staff/login");
      return;
    }
    const cached = getCachedStaffUser();
    if (cached) setUser(cached);
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        clearStaffSession();
        router.push("/staff/login?expired=1");
      }
    }, 60000);
    const onActivity = () => touchActivity();
    window.addEventListener("click", onActivity);
    window.addEventListener("keydown", onActivity);
    return () => {
      clearInterval(interval);
      window.removeEventListener("click", onActivity);
      window.removeEventListener("keydown", onActivity);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/staff/logout", { method: "POST", credentials: "include" });
    } catch {
      /* ignore */
    }
    clearStaffSession();
    router.push("/staff/login");
  };

  if (!user) {
    return (
      <div className="staff-app min-h-screen flex items-center justify-center bg-white">
        <div className="h-10 w-10 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
      </div>
    );
  }

  const segment = pathname.split("/").filter(Boolean)[1] || "dashboard";

  return (
    <div className="staff-app min-h-screen flex bg-white">
      {sidebarOpen && (
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
                onClick={() => setSidebarOpen((open) => !open)}
                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                aria-expanded={sidebarOpen}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Link href="/staff" className="flex items-center gap-3 shrink-0">
                <Image src="/images/logo/FloralLogo.jpg" alt="" width={48} height={48} className="rounded-lg h-10 w-10 md:h-12 md:w-12 object-cover" />
              </Link>
              <div className="min-w-0 border-l border-brand-gray-200 pl-3">
                <p className="font-heading text-sm md:text-base font-semibold text-brand-gray-900 capitalize truncate">
                  {segment.replace(/-/g, " ")}
                </p>
                <p className="text-[11px] text-brand-gray-800 hidden sm:block">Floral Whispers Gifts · Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex text-xs font-medium text-brand-gray-800 hover:text-brand-red transition-colors mr-2"
              >
                View store
              </Link>
              <Link
                href="/staff/messages"
                className="p-2 rounded-lg hover:bg-brand-gray-50 text-brand-gray-800 hover:text-brand-red transition-colors relative"
                aria-label="Messages"
              >
                <Bell className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-brand-gray-200">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-medium text-brand-gray-900">{user.name || user.email.split("@")[0]}</p>
                  <p className="text-[10px] text-brand-green font-medium">
                    {user.role === "super_admin" ? "Super Admin" : "Staff"}
                  </p>
                </div>
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white",
                    user.role === "super_admin" ? "bg-brand-green" : "bg-brand-pink"
                  )}
                >
                  {(user.name || user.email).slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto bg-[#FAF7F2]">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function StaffShell({ children }: { children: React.ReactNode }) {
  return (
    <StaffRealtimeProvider>
      <StaffAlertsProvider>
        <ShellInner>{children}</ShellInner>
      </StaffAlertsProvider>
    </StaffRealtimeProvider>
  );
}
