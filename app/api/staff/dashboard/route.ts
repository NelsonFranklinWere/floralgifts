import { NextRequest, NextResponse } from "next/server";
import { requireStaff, staffRouteErrorResponse } from "@/lib/staff-auth";
import { fetchStaffDashboard } from "@/lib/staff-queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "daily";
    const data = await fetchStaffDashboard(period);
    return NextResponse.json(data);
  } catch (error: unknown) {
    return staffRouteErrorResponse(error, "staff/dashboard");
  }
}
