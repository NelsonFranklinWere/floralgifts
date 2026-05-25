import { NextRequest, NextResponse } from "next/server";
import { requireStaff, requireSuperAdmin, logStaffAction, getClientIp } from "@/lib/staff-auth";
import { fetchStaffProductsList } from "@/lib/staff-queries";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidateContentTag, CACHE_TAG_PRODUCTS } from "@/lib/cache-tags";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const { searchParams } = new URL(request.url);
    const products = await fetchStaffProductsList({
      category: searchParams.get("category") || undefined,
      q: searchParams.get("q") || undefined,
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const body = await request.json();
    const { data, error } = await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
      .insert({
        slug: body.slug,
        title: body.title,
        description: body.description || "",
        short_description: body.short_description || "",
        price: body.price,
        sale_price: body.sale_price || null,
        category: body.category,
        tags: body.tags || [],
        stock: body.stock ?? 0,
        sku: body.sku || null,
        visibility: body.visibility || "published",
        images: body.images || [],
        low_stock_threshold: body.low_stock_threshold ?? 5,
      })
      .select()
      .single();
    if (error) throw error;
    await logStaffAction({
      staffEmail: staff.email,
      staffId: staff.id,
      action: "product_create",
      entityType: "product",
      entityId: (data as { id: string }).id,
      ipAddress: getClientIp(request),
    });
    revalidateContentTag(CACHE_TAG_PRODUCTS);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const { ids, action, price } = await request.json();
    if (!ids?.length) return NextResponse.json({ message: "No ids" }, { status: 400 });

    if (action === "delete") {
      requireSuperAdmin(request);
      await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>).delete().in("id", ids);
      await logStaffAction({ staffEmail: staff.email, action: "bulk_delete", entityType: "product", details: { ids } });
    } else if (action === "publish" || action === "unpublish") {
      await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
        .update({ visibility: action === "publish" ? "published" : "draft" })
        .in("id", ids);
    } else if (action === "update_price" && price != null) {
      requireSuperAdmin(request);
      await (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
        .update({ price })
        .in("id", ids);
    }
    revalidateContentTag(CACHE_TAG_PRODUCTS);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
