import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getOrders } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;

    console.log(`🔍 Admin Orders: Fetching orders with status filter: ${status}`);
    
    const orders = await getOrders({ status });
    
    console.log(`📊 Admin Orders: Found ${orders.length} orders`);
    
    if (status === "failed") {
      console.log(`❌ Admin Orders: Failed orders details:`);
      orders.forEach((order, index) => {
        console.log(`  ${index + 1}. ${order.id.slice(0, 8)}... - ${order.customer_name} - Status: ${order.status}`);
      });
    }
    
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error(`❌ Admin Orders Error:`, error);
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

