import { NextRequest, NextResponse } from "next/server";
import { requireStaff, signStaffToken, staffRouteErrorResponse } from "@/lib/staff-auth";
import type { StaffRole } from "@/lib/staff-auth";

export const dynamic = "force-dynamic";

/** Re-issue JWT for localStorage when the httpOnly cookie is valid but storage was cleared. */
export async function GET(request: NextRequest) {
  try {
    const payload = requireStaff(request);
    const rawRole = payload.role as string;
    const role: StaffRole =
      rawRole === "super_admin" || rawRole === "admin" ? "super_admin" : "staff";

    const token = signStaffToken({
      email: payload.email,
      role,
      id: payload.id,
      name: payload.name,
    });

    return NextResponse.json({
      token,
      user: {
        email: payload.email,
        role,
        name: payload.name,
        id: payload.id,
      },
    });
  } catch (error) {
    return staffRouteErrorResponse(error, "staff/sync-token");
  }
}
