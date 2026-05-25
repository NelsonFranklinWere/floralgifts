import { NextRequest, NextResponse } from "next/server";
import { requireStaff, logStaffAction, getClientIp } from "@/lib/staff-auth";
import { getOrderById } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const STATUS_FLOW = ["pending", "confirmed", "packed", "out_for_delivery", "delivered"];

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireStaff(request);
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const staff = requireStaff(request);
    const { id } = await params;
    const body = await request.json();
    const order = await getOrderById(id);
    if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.order_status) {
      const history = ((order as { status_history?: unknown[] }).status_history || []) as unknown[];
      history.push({
        status: body.order_status,
        at: new Date().toISOString(),
        by: staff.email,
      });
      updates.order_status = body.order_status;
      updates.status_history = history;
      if (body.order_status === "delivered") updates.status = "shipped";
      if (body.order_status === "confirmed") updates.status = "paid";
    }

    if (body.delivery_address) updates.delivery_address = body.delivery_address;
    if (body.delivery_time) updates.delivery_time = body.delivery_time;
    if (body.delivery_date) updates.delivery_date = body.delivery_date;
    if (body.assigned_to) updates.assigned_to = body.assigned_to;
    if (body.cancel_reason) {
      updates.cancel_reason = body.cancel_reason;
      updates.status = "cancelled";
      updates.order_status = "cancelled";
    }
    if (body.refund_notes) updates.refund_notes = body.refund_notes;
    if (body.items) updates.items = body.items;
    if (body.special_instructions) updates.special_instructions = body.special_instructions;
    if (body.notes) updates.notes = body.notes;

    const { data, error } = await (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await logStaffAction({
      staffEmail: staff.email,
      action: "order_update",
      entityType: "order",
      entityId: id,
      details: body,
      ipAddress: getClientIp(request),
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
