import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff-auth";
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
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Failed to load dashboard" }, { status: 500 });
  }
}
