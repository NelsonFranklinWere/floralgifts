"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import StaffPanelFallback from "@/components/staff/StaffPanelFallback";
import {
  bootstrapStaffSession,
  clearStaffSession,
  isSessionExpired,
  redirectStaffToLogin,
  setCachedStaffUser,
  touchActivity,
  type StaffUser,
} from "@/lib/staff-client";
import { openStaffSessionGate, resetStaffSessionGate } from "@/lib/staff-session-gate";
import type { StaffSessionUser } from "@/lib/staff-server";

export type StaffSessionStatus = "loading" | "authenticated" | "unauthenticated";

interface StaffSessionValue {
  status: StaffSessionStatus;
  user: StaffUser | null;
  logout: () => Promise<void>;
}

const StaffSessionContext = createContext<StaffSessionValue | null>(null);

export function StaffAuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: StaffSessionUser | null;
}) {
  const [status, setStatus] = useState<StaffSessionStatus>(
    initialUser ? "authenticated" : "loading"
  );
  const [user, setUser] = useState<StaffUser | null>(initialUser);

  useEffect(() => {
    let cancelled = false;

    if (initialUser) {
      resetStaffSessionGate();
      setCachedStaffUser(initialUser);
      touchActivity();
      openStaffSessionGate();
      void bootstrapStaffSession();
      return;
    }

    (async () => {
      resetStaffSessionGate();

      if (isSessionExpired()) {
        setStatus("unauthenticated");
        await redirectStaffToLogin();
        return;
      }

      const sessionUser = await bootstrapStaffSession();
      if (cancelled) return;

      if (!sessionUser) {
        setStatus("unauthenticated");
        await redirectStaffToLogin();
        return;
      }

      setUser(sessionUser);
      setStatus("authenticated");
      openStaffSessionGate();
    })();

    return () => {
      cancelled = true;
    };
  }, [initialUser]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/staff/logout", { method: "POST", credentials: "include" });
    } catch {
      /* ignore */
    }
    clearStaffSession();
    resetStaffSessionGate();
    window.location.replace("/staff/login");
  }, []);

  const value = useMemo(
    () => ({ status, user, logout }),
    [status, user, logout]
  );

  if (status === "loading") {
    return <StaffPanelFallback />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <StaffSessionContext.Provider value={value}>{children}</StaffSessionContext.Provider>
  );
}

export function useStaffSession(): StaffSessionValue {
  const ctx = useContext(StaffSessionContext);
  if (!ctx) {
    throw new Error("useStaffSession must be used within StaffAuthProvider");
  }
  return ctx;
}
