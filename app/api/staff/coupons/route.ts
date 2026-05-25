import { NextRequest, NextResponse } from "next/server";
import { requireStaff, logStaffAction, getClientIp } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const { data, error } = await (supabaseAdmin.from("coupons") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const body = await request.json();
    const { data, error } = await (supabaseAdmin.from("coupons") as ReturnType<typeof supabaseAdmin.from>)
      .insert({
        code: body.code.toUpperCase(),
        discount_type: body.discount_type,
        discount_value: body.discount_value,
        min_order_value: body.min_order_value || 0,
        usage_limit: body.usage_limit || null,
        expires_at: body.expires_at || null,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();
    if (error) throw error;
    await logStaffAction({
      staffEmail: staff.email,
      action: "coupon_create",
      entityType: "coupon",
      entityId: (data as { id: string }).id,
      ipAddress: getClientIp(request),
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireStaff(request);
    const { id, ...updates } = await request.json();
    const { data, error } = await (supabaseAdmin.from("coupons") as ReturnType<typeof supabaseAdmin.from>)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
