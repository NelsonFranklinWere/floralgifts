import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff-auth";
import { fetchStaffOrdersList } from "@/lib/staff-queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    let orders = await fetchStaffOrdersList({ status, limit: 100 });

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    if (from) orders = orders.filter((o) => new Date(o.created_at) >= new Date(from));
    if (to) orders = orders.filter((o) => new Date(o.created_at) <= new Date(to + "T23:59:59"));

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
