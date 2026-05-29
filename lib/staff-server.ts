import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { StaffRole, StaffTokenPayload } from "@/lib/staff-jwt";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface StaffSessionUser {
  email: string;
  role: StaffRole;
  name?: string;
  id?: string;
}

export async function getStaffSessionFromCookies(): Promise<StaffSessionUser | null> {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("staff_token")?.value || cookieStore.get("admin_token")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as StaffTokenPayload;
    const rawRole = payload.role as string;
    const role: StaffRole =
      rawRole === "super_admin" || rawRole === "admin" ? "super_admin" : "staff";
    return {
      email: payload.email,
      role,
      name: payload.name,
      id: payload.id,
    };
  } catch {
    return null;
  }
}
