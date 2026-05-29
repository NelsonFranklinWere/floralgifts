import { NextRequest, NextResponse } from "next/server";
import { requireStaff, requireSuperAdmin, staffRouteErrorResponse } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    requireStaff(request);
    const { email } = await params;
    const decoded = decodeURIComponent(email);

    const { data: orders } = await (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .select("id, customer_name, phone, email, total_amount, status, order_status, created_at, items")
      .or(`email.eq.${decoded},phone.eq.${decoded},customer_name.eq.${decoded}`)
      .order("created_at", { ascending: false })
      .limit(50);

    const { data: notes } = await (supabaseAdmin.from("customer_notes") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .eq("customer_email", decoded)
      .order("created_at", { ascending: false });

    const { data: blocked } = await (supabaseAdmin.from("blocked_customers") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .eq("customer_email", decoded)
      .maybeSingle();

    return NextResponse.json({ orders: orders || [], notes: notes || [], blocked: !!blocked });
  } catch (error) {
    return staffRouteErrorResponse(error, "staff/customers/[email] GET");
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    const staff = requireStaff(request);
    const { email } = await params;
    const decoded = decodeURIComponent(email);
    const { blocked, reason } = await request.json();

    if (blocked) {
      await (supabaseAdmin.from("blocked_customers") as ReturnType<typeof supabaseAdmin.from>).upsert({
        customer_email: decoded,
        reason: reason || "Blocked by staff",
        blocked_by: staff.email,
      });
    } else {
      requireSuperAdmin(request);
      await (supabaseAdmin.from("blocked_customers") as ReturnType<typeof supabaseAdmin.from>)
        .delete()
        .eq("customer_email", decoded);
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Only super admin can unblock" }, { status: 403 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
