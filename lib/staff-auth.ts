import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "./supabase";
import {
  verifyStaffToken,
  type StaffRole,
  type StaffTokenPayload,
} from "./staff-jwt";

export { verifyStaffToken, type StaffRole, type StaffTokenPayload };

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
export const STAFF_SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours
export const STAFF_COOKIE = "staff_token";

export function signStaffToken(payload: Omit<StaffTokenPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

export class StaffUnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "StaffUnauthorizedError";
  }
}

export class StaffForbiddenError extends Error {
  constructor() {
    super("Forbidden");
    this.name = "StaffForbiddenError";
  }
}

export function isStaffUnauthorized(error: unknown): boolean {
  return error instanceof StaffUnauthorizedError;
}

export function isStaffForbidden(error: unknown): boolean {
  return error instanceof StaffForbiddenError;
}

export function staffRouteErrorResponse(error: unknown, logLabel: string) {
  if (isStaffUnauthorized(error)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (isStaffForbidden(error)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  console.error(`[${logLabel}]`, error);
  const message = error instanceof Error ? error.message : "Request failed";
  return NextResponse.json({ message }, { status: 500 });
}

export function requireStaff(request: NextRequest): StaffTokenPayload {
  const payload = verifyStaffToken(request);
  if (!payload) throw new StaffUnauthorizedError();
  return payload;
}

export function requireSuperAdmin(request: NextRequest): StaffTokenPayload {
  const payload = requireStaff(request);
  if (payload.role !== "super_admin") throw new StaffForbiddenError();
  return payload;
}

export function canDelete(role: StaffRole): boolean {
  return role === "super_admin";
}

export function canViewFinancials(role: StaffRole): boolean {
  return role === "super_admin";
}

export function setStaffCookie(response: NextResponse, token: string): void {
  response.cookies.set(STAFF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: STAFF_SESSION_MS / 1000,
    path: "/",
  });
}

export function clearStaffCookie(response: NextResponse): void {
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
  response.cookies.set(STAFF_COOKIE, "", opts);
  response.cookies.set("admin_token", "", opts);
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function logStaffAction(params: {
  staffEmail: string;
  staffId?: string;
  staffName?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}): Promise<void> {
  try {
    await (supabaseAdmin.from("staff_audit_logs") as ReturnType<typeof supabaseAdmin.from>).insert({
      staff_email: params.staffEmail,
      staff_id: params.staffId || null,
      staff_name: params.staffName || null,
      action: params.action,
      entity_type: params.entityType || null,
      entity_id: params.entityId || null,
      details: params.details || {},
      ip_address: params.ipAddress || null,
    });
  } catch (err) {
    console.error("[Audit] Failed to log action:", err);
  }
}

export async function logStaffLogin(params: {
  email: string;
  ip: string;
  userAgent?: string;
  success: boolean;
}): Promise<void> {
  try {
    await (supabaseAdmin.from("staff_login_logs") as ReturnType<typeof supabaseAdmin.from>).insert({
      staff_email: params.email,
      ip_address: params.ip,
      user_agent: params.userAgent || null,
      success: params.success,
    });
  } catch (err) {
    console.error("[Login] Failed to log:", err);
  }
}

export function getDefaultAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || "floral@gmail.com").trim().toLowerCase();
}

export function getDefaultAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "Admin@123";
}

export async function authenticateStaff(
  email: string,
  password: string
): Promise<{ admin: Record<string, unknown>; token: string } | null> {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: admin, error } = await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
    .select("*")
    .eq("email", normalizedEmail)
    .single();

  if (!error && admin) {
    const row = admin as Record<string, unknown>;
    if (row.is_active !== false && row.password_hash === password) {
      const role: StaffRole =
        row.role === "super_admin" || row.role === "admin" ? "super_admin" : "staff";

      const token = signStaffToken({
        email: row.email as string,
        role,
        id: row.id as string,
        name: (row.name as string) || undefined,
      });

      return { admin: row, token };
    }
  }

  // Env-configured fallback (also used when DB row not yet migrated)
  if (normalizedEmail === getDefaultAdminEmail() && password === getDefaultAdminPassword()) {
    const token = signStaffToken({
      email: getDefaultAdminEmail(),
      role: "super_admin",
    });
    return {
      admin: { email: getDefaultAdminEmail(), role: "super_admin", name: "Admin" },
      token,
    };
  }

  return null;
}
