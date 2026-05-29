import { NextRequest, NextResponse } from "next/server";
import { requireStaff, requireSuperAdmin, logStaffAction, getClientIp, staffRouteErrorResponse } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireStaff(request);
    const { id } = await params;
    const { data, error } = await (supabaseAdmin.from("product_variants") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .eq("product_id", id)
      .order("created_at");
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return staffRouteErrorResponse(error, "staff/products/[id]/variants GET");
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const staff = requireStaff(request);
    const { id } = await params;
    const body = await request.json();
    const { data, error } = await (supabaseAdmin.from("product_variants") as ReturnType<typeof supabaseAdmin.from>)
      .insert({
        product_id: id,
        size: body.size || null,
        color: body.color || null,
        sku: body.sku || null,
        price: body.price,
        stock: body.stock ?? 0,
      })
      .select()
      .single();
    if (error) throw error;
    await logStaffAction({
      staffEmail: staff.email,
      action: "variant_create",
      entityType: "product",
      entityId: id,
      ipAddress: getClientIp(request),
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const staff = requireSuperAdmin(request);
    const { searchParams } = new URL(request.url);
    const variantId = searchParams.get("variantId");
    if (!variantId) return NextResponse.json({ message: "variantId required" }, { status: 400 });
    await (supabaseAdmin.from("product_variants") as ReturnType<typeof supabaseAdmin.from>)
      .delete()
      .eq("id", variantId);
    await logStaffAction({
      staffEmail: staff.email,
      action: "variant_delete",
      entityId: variantId,
      ipAddress: getClientIp(request),
    });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
