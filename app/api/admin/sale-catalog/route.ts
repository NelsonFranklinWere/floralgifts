import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getSaleCatalogIds, setSaleCatalogIds } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const [{ data, error }, saleIds] = await Promise.all([
      (supabaseAdmin.from("products") as any)
        .select("id, slug, title, price, category, images, stock, updated_at")
        .order("created_at", { ascending: false }),
      getSaleCatalogIds(),
    ]);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const saleIdSet = new Set(saleIds);
    const products = (data || []).map((p: any) => ({
      ...p,
      images: p.images || [],
      in_sale_catalog: saleIdSet.has(p.id),
    }));

    return NextResponse.json(products);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to fetch sale catalog" },
      { status: 500 }
    );
  }
}

// PUT: add or remove a product from the Sale catalog
// body: { id: string, in_sale_catalog: boolean }
export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    if (!body.id || typeof body.in_sale_catalog !== "boolean") {
      return NextResponse.json(
        { message: "id and in_sale_catalog (boolean) are required" },
        { status: 400 }
      );
    }

    const ids = await getSaleCatalogIds();
    let nextIds: string[];

    if (body.in_sale_catalog) {
      nextIds = ids.includes(body.id) ? ids : [...ids, body.id];
    } else {
      nextIds = ids.filter((id) => id !== body.id);
    }

    const ok = await setSaleCatalogIds(nextIds);
    if (!ok) {
      return NextResponse.json(
        { message: "Failed to save sale catalog" },
        { status: 500 }
      );
    }

    revalidatePath("/sale");

    return NextResponse.json({
      id: body.id,
      in_sale_catalog: body.in_sale_catalog,
      total: nextIds.length,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to update sale catalog" },
      { status: 500 }
    );
  }
}
