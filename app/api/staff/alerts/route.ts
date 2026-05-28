import { NextRequest, NextResponse } from "next/server";
import { requireStaff, staffRouteErrorResponse } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const [pendingRes, unreadRes] = await Promise.all([
      (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      (supabaseAdmin.from("contact_messages") as ReturnType<typeof supabaseAdmin.from>)
        .select("id", { count: "exact", head: true })
        .eq("status", "unread"),
    ]);
    return NextResponse.json({
      pendingOrders: pendingRes.count ?? 0,
      unreadMessages: unreadRes.count ?? 0,
    });
  } catch (error) {
    return staffRouteErrorResponse(error, "staff/alerts");
  }
}
