import { NextRequest, NextResponse } from "next/server";
import { requireStaff, staffRouteErrorResponse } from "@/lib/staff-auth";
import type { StaffRole } from "@/lib/staff-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const payload = requireStaff(request);
    const rawRole = payload.role as string;
    const role: StaffRole =
      rawRole === "super_admin" || rawRole === "admin" ? "super_admin" : "staff";

    return NextResponse.json({
      email: payload.email,
      role,
      name: payload.name,
      id: payload.id,
    });
  } catch (error) {
    return staffRouteErrorResponse(error, "staff/me");
  }
}
