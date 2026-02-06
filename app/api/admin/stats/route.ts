import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getOrders } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const orders = await getOrders({});

    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      paidOrders: orders.filter((o) => o.status === "paid").length,
      totalRevenue: orders
        .filter((o) => o.status === "paid")
        .reduce((sum, o) => sum + (o.total_amount || o.total || 0), 0),
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("Stats error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

