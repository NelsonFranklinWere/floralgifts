import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getRecentVisitorPings } from "@/lib/visitor-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const since = request.nextUrl.searchParams.get("since");
    const sinceNum = since ? parseInt(since, 10) : undefined;
    const pings = getRecentVisitorPings(Number.isFinite(sinceNum) ? sinceNum : undefined);

    return NextResponse.json({
      visitors: pings,
      count: pings.length,
    });
  } catch (e: any) {
    if (e.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: e.message || "Error" }, { status: 500 });
  }
}
