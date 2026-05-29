import { NextRequest, NextResponse } from "next/server";
import { requireStaff, requireSuperAdmin, logStaffAction, getClientIp, staffRouteErrorResponse } from "@/lib/staff-auth";
import { getProductById } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidateContentTag, CACHE_TAG_PRODUCTS } from "@/lib/cache-tags";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireStaff(request);
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const { data: variants } = await (supabaseAdmin.from("product_variants") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .eq("product_id", id);

    return NextResponse.json({ ...product, variants: variants || [] });
  } catch (error) {
    return staffRouteErrorResponse(error, "staff/products/[id] GET");
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const staff = requireStaff(request);
    const { id } = await params;
    const body = await request.json();
    const { data, error } = await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    await logStaffAction({
      staffEmail: staff.email,
      action: "product_update",
      entityType: "product",
      entityId: id,
      details: body,
      ipAddress: getClientIp(request),
    });
    revalidateContentTag(CACHE_TAG_PRODUCTS);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const staff = requireSuperAdmin(request);
    const { id } = await params;
    await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>).delete().eq("id", id);
    await logStaffAction({
      staffEmail: staff.email,
      action: "product_delete",
      entityType: "product",
      entityId: id,
      ipAddress: getClientIp(request),
    });
    revalidateContentTag(CACHE_TAG_PRODUCTS);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Staff cannot delete products" }, { status: 403 });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
