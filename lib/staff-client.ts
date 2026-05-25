"use client";

import type { StaffRole } from "./staff-auth";

const TOKEN_KEY = "staff_token";
const USER_KEY = "staff_user";
const ACTIVITY_KEY = "staff_last_activity";
const INACTIVITY_MS = 30 * 60 * 1000;

export interface StaffUser {
  email: string;
  role: StaffRole;
  name?: string;
  id?: string;
}

function decodeJwtPayload(token: string): StaffUser | null {
  try {
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
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw) as StaffUser;
  } catch {
    /* ignore */
  }
  const token = getStaffToken();
  return token ? decodeJwtPayload(token) : null;
}

export function setCachedStaffUser(user: StaffUser): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStaffToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("admin_token");
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

export async function staffFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  if (isSessionExpired()) {
    clearStaffSession();
    window.location.href = "/staff/login?expired=1";
    throw new Error("Session expired");
  }

  touchActivity();
  const token = getStaffToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    clearStaffSession();
    window.location.href = "/staff/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data as T;
}

export function canStaffDelete(role: StaffRole): boolean {
  return role === "super_admin";
}

export function canStaffViewFinancials(role: StaffRole): boolean {
  return role === "super_admin";
}
