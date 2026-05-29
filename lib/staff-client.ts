"use client";

import type { StaffRole } from "./staff-jwt";
import { waitForStaffSessionGate } from "./staff-session-gate";

const TOKEN_KEY = "staff_token";
const USER_KEY = "staff_user";
const ACTIVITY_KEY = "staff_last_activity";
const INACTIVITY_MS = 8 * 60 * 60 * 1000;

let redirectInFlight = false;

export interface StaffUser {
  email: string;
  role: StaffRole;
  name?: string;
  id?: string;
}

function decodeJwtPayload(token: string): StaffUser | null {
  try {
    if (isStaffTokenExpired(token)) return null;
    const part = token.split(".")[1];
    if (!part) return null;
    const json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
    const role: StaffRole =
      json.role === "super_admin" || json.role === "admin" ? "super_admin" : "staff";
    return {
      email: json.email,
      role,
      name: json.name,
      id: json.id,
    };
  } catch {
    return null;
  }
}

export function getCachedStaffUser(): StaffUser | null {
  if (typeof window === "undefined") return null;
  const token = getStaffToken();
  if (token) {
    const fromJwt = decodeJwtPayload(token);
    if (fromJwt) return fromJwt;
  }
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw) as StaffUser;
  } catch {
    /* ignore */
  }
  return null;
}

export function setCachedStaffUser(user: StaffUser): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isStaffTokenExpired(token: string): boolean {
  try {
    const part = token.split(".")[1];
    if (!part) return true;
    const json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof json.exp !== "number") return false;
    return Date.now() >= json.exp * 1000 - 15_000;
  } catch {
    return true;
  }
}

export function getStaffToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem("admin_token");
  if (!token) return null;
  if (isStaffTokenExpired(token) || !decodeJwtPayload(token)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("admin_token");
    return null;
  }
  return token;
}

export function setStaffToken(token: string, user?: StaffUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem("admin_token", token);
  const u = user || decodeJwtPayload(token);
  if (u) setCachedStaffUser(u);
  touchActivity();
}

export function clearStaffSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("admin_token");
  localStorage.removeItem(ACTIVITY_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function touchActivity(): void {
  localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
}

export function isSessionExpired(): boolean {
  const last = localStorage.getItem(ACTIVITY_KEY);
  if (!last) return false;
  return Date.now() - Number(last) > INACTIVITY_MS;
}

/** Restore session from JWT in storage or httpOnly cookie via /api/staff/me. */
export async function bootstrapStaffSession(): Promise<StaffUser | null> {
  if (typeof window === "undefined") return null;

  const token = getStaffToken();
  if (token) {
    const fromJwt = decodeJwtPayload(token);
    if (fromJwt) {
      setCachedStaffUser(fromJwt);
      touchActivity();
      return fromJwt;
    }
  }

  try {
    const res = await fetch("/api/staff/me", { credentials: "include", cache: "no-store" });
    if (!res.ok) return null;
    const user = (await res.json()) as StaffUser;
    setCachedStaffUser(user);
    touchActivity();

    if (!getStaffToken()) {
      try {
        const syncRes = await fetch("/api/staff/sync-token", {
          credentials: "include",
          cache: "no-store",
        });
        if (syncRes.ok) {
          const { token } = (await syncRes.json()) as { token: string };
          if (token) setStaffToken(token, user);
        }
      } catch {
        /* cookie-only session still works for API calls */
      }
    }

    return user;
  } catch {
    return null;
  }
}

export async function redirectStaffToLogin(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/staff/login")) {
    redirectInFlight = false;
    return;
  }
  if (redirectInFlight) return;

  redirectInFlight = true;
  clearStaffSession();

  try {
    await fetch("/api/staff/logout", { method: "POST", credentials: "include" });
  } catch {
    /* ignore */
  }

  window.location.replace("/staff/login?expired=1");
}

async function isStaffSessionInvalid(): Promise<boolean> {
  try {
    const res = await fetch("/api/staff/me", { credentials: "include", cache: "no-store" });
    return !res.ok;
  } catch {
    return true;
  }
}

export async function staffFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  if (typeof window !== "undefined") {
    await waitForStaffSessionGate();
  }

  if (isSessionExpired()) {
    await redirectStaffToLogin();
    throw new Error("Session expired");
  }

  touchActivity();

  const performRequest = async (): Promise<Response> => {
    const token = getStaffToken();
    const controller = new AbortController();
    const timeoutMs = process.env.NODE_ENV === "development" ? 90_000 : 30_000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, {
        ...options,
        signal: options.signal ?? controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
        credentials: "include",
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("Request timed out — try again");
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  };

  let res = await performRequest();

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("admin_token");
    const user = await bootstrapStaffSession();
    if (user) {
      res = await performRequest();
    }
  }

  let data: { message?: string };
  try {
    data = await res.json();
  } catch {
    if (res.status === 401 && (await isStaffSessionInvalid())) {
      await redirectStaffToLogin();
      throw new Error("Session expired");
    }
    if (res.status === 403) {
      throw new Error("You do not have permission for this action");
    }
    throw new Error(res.ok ? "Invalid server response" : `Request failed (${res.status})`);
  }

  if (res.status === 401) {
    if (await isStaffSessionInvalid()) {
      await redirectStaffToLogin();
      throw new Error("Session expired");
    }
    throw new Error(data.message || "Unauthorized");
  }

  if (res.status === 403) {
    throw new Error(data.message || "You do not have permission for this action");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}

export function canStaffDelete(role: StaffRole): boolean {
  return role === "super_admin";
}

export function canStaffViewFinancials(role: StaffRole): boolean {
  return role === "super_admin";
}
