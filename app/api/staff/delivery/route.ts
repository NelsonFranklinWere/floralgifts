import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff-auth";
import { fetchStaffOrdersList } from "@/lib/staff-queries";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const orders = await fetchStaffOrdersList({ limit: 50 });
    const pending = orders.filter((o) => {
      const os = (o as { order_status?: string }).order_status;
      return os === "out_for_delivery" || os === "confirmed" || os === "packed" || o.status === "paid";
    });

    const { data: zones } = await (supabaseAdmin.from("delivery_zones") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .order("sort_order");
    const { data: personnel } = await (supabaseAdmin.from("delivery_personnel") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .eq("is_active", true);

    return NextResponse.json({
      deliveries: pending.slice(0, 50),
      zones: zones || [],
      personnel: personnel || [],
    });
  } catch {
    return NextResponse.json({ deliveries: [], zones: [], personnel: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireStaff(request);
    const { type, ...body } = await request.json();

    if (type === "zone") {
      const { data, error } = await (supabaseAdmin.from("delivery_zones") as ReturnType<typeof supabaseAdmin.from>)
        .insert({ name: body.name, fee: body.fee, sort_order: body.sort_order || 0 })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (type === "personnel") {
      const { data, error } = await (supabaseAdmin.from("delivery_personnel") as ReturnType<typeof supabaseAdmin.from>)
        .insert({ name: body.name, phone: body.phone })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: "Unknown type" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireStaff(request);
    const { type, id, ...updates } = await request.json();
    const table = type === "zone" ? "delivery_zones" : "delivery_personnel";
    const { data, error } = await (supabaseAdmin.from(table) as ReturnType<typeof supabaseAdmin.from>)
      .update(updates)
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
