import { NextRequest, NextResponse } from "next/server";
import { requireStaff, staffRouteErrorResponse, isStaffUnauthorized } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const { searchParams } = new URL(request.url);
    const staffEmail = searchParams.get("staff");
    const action = searchParams.get("action");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let query = (supabaseAdmin.from("staff_audit_logs") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (staffEmail) query = query.eq("staff_email", staffEmail);
    if (action) query = query.eq("action", action);
    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to + "T23:59:59");

    const { data, error } = await query;
    if (error) {
      console.warn("[staff/audit] staff_audit_logs:", error.message);
      return NextResponse.json({ logs: [], logins: [] });
    }

    const { data: logins, error: loginErr } = await (
      supabaseAdmin.from("staff_login_logs") as ReturnType<typeof supabaseAdmin.from>
    )
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (loginErr) {
      console.warn("[staff/audit] staff_login_logs:", loginErr.message);
      return NextResponse.json({ logs: data || [], logins: [] });
    }

    return NextResponse.json({ logs: data || [], logins: logins || [] });
  } catch (error) {
    if (isStaffUnauthorized(error)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return staffRouteErrorResponse(error, "staff/audit");
  }
}
