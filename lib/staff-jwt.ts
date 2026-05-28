import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export type StaffRole = "super_admin" | "staff";

export interface StaffTokenPayload {
  email: string;
  role: StaffRole;
  id?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

function verifyTokenString(token: string): StaffTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as StaffTokenPayload;
  } catch {
    return null;
  }
}

export function verifyStaffToken(request: NextRequest): StaffTokenPayload | null {
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const cookieToken =
    request.cookies.get("staff_token")?.value || request.cookies.get("admin_token")?.value;

  for (const token of [bearer, cookieToken]) {
    if (!token) continue;
    const payload = verifyTokenString(token);
    if (payload) return payload;
  }
  return null;
}
