import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/staff-auth";
import { startOfDay, subDays } from "date-fns";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireSuperAdmin(request);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "monthly";
    const days = period === "daily" ? 1 : period === "weekly" ? 7 : 30;
    const since = subDays(startOfDay(new Date()), days - 1);

    const { data: orders } = await (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .select("id, total_amount, status, payment_method, created_at, items")
      .gte("created_at", since.toISOString())
      .in("status", ["paid", "shipped"]);

    const filtered = orders || [];

    const totalRevenue = filtered.reduce((s, o) => s + ((o as { total_amount: number }).total_amount || 0), 0);
    const avgOrder = filtered.length ? totalRevenue / filtered.length : 0;

    const byPayment: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const productSales: Record<string, { units: number; revenue: number; name: string }> = {};

    for (const o of filtered) {
      const order = o as {
        payment_method: string;
        total_amount: number;
        items?: { productId?: string; name: string; quantity: number; price: number }[];
      };
      byPayment[order.payment_method] = (byPayment[order.payment_method] || 0) + (order.total_amount || 0);
      for (const item of order.items || []) {
        const cat = "other";
        byCategory[cat] = (byCategory[cat] || 0) + item.price * item.quantity;
        const key = item.productId || item.name;
        if (!productSales[key]) productSales[key] = { units: 0, revenue: 0, name: item.name };
        productSales[key].units += item.quantity;
        productSales[key].revenue += item.price * item.quantity;
      }
    }

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const vatRate = Number(process.env.VAT_RATE || 0.16);
    const vatAmount = Math.round(totalRevenue * (vatRate / (1 + vatRate)));

    return NextResponse.json({
      totalRevenue,
      orderCount: filtered.length,
      avgOrder,
      byPayment,
      byCategory,
      topProducts,
      vat: { rate: vatRate, amount: vatAmount },
      period,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
