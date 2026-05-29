"use client";



import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import Link from "next/link";

import Image from "next/image";

import { touchActivity, isSessionExpired, redirectStaffToLogin } from "@/lib/staff-client";

import { useStaffSession } from "@/lib/staff-session";

import { StaffAlertsProvider } from "./StaffAlertsProvider";

import StaffSidebar from "./StaffSidebar";

import { Menu, X, Bell, Radio } from "lucide-react";

import { cn } from "@/lib/utils";



export default function StaffShell({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const { user, logout } = useStaffSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);



  useEffect(() => {

    setSidebarOpen(false);

  }, [pathname]);



  useEffect(() => {

    const interval = setInterval(() => {

      if (isSessionExpired()) {

        void redirectStaffToLogin();

      }

    }, 60_000);



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

  }, []);



  const segment = pathname.split("/").filter(Boolean)[1] || "dashboard";

  const isLiveVisitors = pathname.startsWith("/staff/live-visitors");



  if (!user) return null;



  return (

    <StaffAlertsProvider>

      <div className="staff-app min-h-screen flex bg-white">

        {/* Desktop sidebar */}

        <div className="hidden lg:block shrink-0 sticky top-0 h-screen">

          <StaffSidebar role={user.role} onLogout={logout} />

        </div>



        {/* Mobile sidebar overlay */}

        {sidebarOpen && (

          <div className="lg:hidden fixed inset-0 z-50 flex">

            <div

              className="absolute inset-0 bg-black/40"

              onClick={() => setSidebarOpen(false)}

              aria-hidden

            />

            <div className="relative z-10 h-full shadow-xl">

              <StaffSidebar

                role={user.role}

                onLogout={logout}

                onNavigate={() => setSidebarOpen(false)}

                onClose={() => setSidebarOpen(false)}

              />

            </div>

          </div>

        )}



        <div className="flex flex-1 flex-col min-w-0 w-full">

          <header className="sticky top-0 z-[60] bg-white border-b border-brand-gray-200 shadow-sm">

            <div className="flex h-14 sm:h-16 md:h-[4.5rem] items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 lg:px-8">

              <div className="flex items-center gap-2 sm:gap-3 min-w-0">

                <button
                  type="button"
                  className="lg:hidden p-2 rounded-lg hover:bg-brand-gray-50 text-brand-gray-900"
                  onClick={() => setSidebarOpen((open) => !open)}
                  aria-label={sidebarOpen ? "Close menu" : "Open admin menu"}
                  aria-expanded={sidebarOpen}
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                <Link href="/staff" className="flex items-center gap-2 sm:gap-3 shrink-0 lg:hidden">

                  <Image

                    src="/images/logo/FloralLogo.jpg"

                    alt=""

                    width={48}

                    height={48}

                    className="rounded-lg h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 object-cover"

                  />

                </Link>

                <div className="min-w-0 border-l border-brand-gray-200 pl-2 sm:pl-3 lg:border-0 lg:pl-0">

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

              <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">

                <Link

                  href="/staff/live-visitors"

                  className={cn(

                    "flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-colors",

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

                <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-brand-gray-200 min-w-[2.25rem]">

                  <div className="hidden sm:block text-right max-w-[120px] md:max-w-[140px]">

                    <p className="text-xs font-medium text-brand-gray-900 truncate">

                      {user.name || user.email.split("@")[0]}

                    </p>

                    <p className="text-[10px] text-brand-gray-800 truncate">{user.email}</p>

                  </div>

                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-brand-red">

                    {(user.name || user.email).slice(0, 2).toUpperCase()}

                  </div>

                </div>

              </div>

            </div>

          </header>

          <main className="flex-1 p-3 sm:p-4 lg:p-8 overflow-auto bg-[#FAF7F2] min-w-0">

            <div className="mx-auto max-w-7xl w-full min-w-0">{children}</div>

          </main>

        </div>

      </div>

    </StaffAlertsProvider>

  );

}


