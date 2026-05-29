import { NextRequest, NextResponse } from "next/server";
import { requireStaff, requireSuperAdmin, logStaffAction, getClientIp, staffRouteErrorResponse } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const SETTING_KEYS = [
  "store_name",
  "store_address",
  "store_phone",
  "store_email",
  "whatsapp_number",
  "instagram_url",
  "facebook_url",
  "mpesa_paybill",
  "mpesa_till",
  "mpesa_account",
  "visa_enabled",
  "delivery_fee_default",
  "tax_rate",
  "email_new_order",
  "email_low_stock",
];

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const { data: settings } = await (supabaseAdmin.from("site_settings") as ReturnType<typeof supabaseAdmin.from>).select("*");
    const map: Record<string, string> = {};
    for (const s of settings || []) {
      map[(s as { key: string }).key] = (s as { value: string }).value;
    }

    const { data: staff } = await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
      .select("id, email, name, role, is_active, last_login_at, created_at")
      .order("created_at");

    const { data: categories } = await (supabaseAdmin.from("product_categories") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .order("sort_order");

    return NextResponse.json({ settings: map, staff: staff || [], categories: categories || [] });
  } catch (error) {
    return staffRouteErrorResponse(error, "staff/settings GET");
  }
}

export async function POST(request: NextRequest) {
  try {
    const staff = requireSuperAdmin(request);
    const body = await request.json();

    if (body.type === "staff_user") {
      const { email, password, name, role } = body;
      const { data, error } = await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
        .insert({
          email: email.trim().toLowerCase(),
          password_hash: password,
          name,
          role: role || "staff",
          is_active: true,
        })
        .select("id, email, name, role, is_active")
        .single();
      if (error) throw error;
      await logStaffAction({
        staffEmail: staff.email,
        action: "staff_user_create",
        details: { email },
        ipAddress: getClientIp(request),
      });
      return NextResponse.json(data);
    }

    if (body.type === "category") {
      const { data, error } = await (supabaseAdmin.from("product_categories") as ReturnType<typeof supabaseAdmin.from>)
        .insert({ slug: body.slug, name: body.name, sort_order: body.sort_order || 0 })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: "Unknown type" }, { status: 400 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const body = await request.json();

    if (body.settings) {
      requireSuperAdmin(request);
      for (const [key, value] of Object.entries(body.settings)) {
        await (supabaseAdmin.from("site_settings") as ReturnType<typeof supabaseAdmin.from>).upsert(
          { key, value: String(value) },
          { onConflict: "key" }
        );
      }
      await logStaffAction({
        staffEmail: staff.email,
        action: "settings_update",
        ipAddress: getClientIp(request),
      });
    }

    if (body.staffId) {
      requireSuperAdmin(request);
      await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
        .update(body.updates)
        .eq("id", body.staffId);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
