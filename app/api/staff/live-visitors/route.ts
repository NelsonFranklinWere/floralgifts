import { NextRequest, NextResponse } from "next/server";
import { requireStaff, staffRouteErrorResponse } from "@/lib/staff-auth";
import { getRecentVisitorPings, getVisitorStats } from "@/lib/visitor-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);

    const since = request.nextUrl.searchParams.get("since");
    const sinceNum = since ? parseInt(since, 10) : undefined;
    const pings = getRecentVisitorPings(Number.isFinite(sinceNum) ? sinceNum : undefined);
    const stats = getVisitorStats();

    return NextResponse.json({
      visitors: pings,
      count: pings.length,
      stats,
    });
  } catch (error) {
    return staffRouteErrorResponse(error, "staff/live-visitors");
  }
}
