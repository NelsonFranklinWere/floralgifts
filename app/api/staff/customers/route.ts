import { NextRequest, NextResponse } from "next/server";
import { requireStaff, staffRouteErrorResponse } from "@/lib/staff-auth";
import { fetchStaffCustomersSummary } from "@/lib/staff-queries";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || undefined;

    const customers = await fetchStaffCustomersSummary(q);

    const { data: blocked } = await (supabaseAdmin.from("blocked_customers") as ReturnType<typeof supabaseAdmin.from>).select("customer_email");
    const blockedSet = new Set((blocked || []).map((b: { customer_email: string }) => b.customer_email));

    return NextResponse.json(
      customers.map((c) => ({ ...c, blocked: blockedSet.has(c.email) }))
    );
  } catch (error) {
    return staffRouteErrorResponse(error, "staff/customers");
  }
}

export async function POST(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const { email, note } = await request.json();
    if (!email || !note) return NextResponse.json({ message: "Required fields" }, { status: 400 });

    const { data, error } = await (supabaseAdmin.from("customer_notes") as ReturnType<typeof supabaseAdmin.from>)
      .insert({ customer_email: email, note, created_by: staff.email })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
