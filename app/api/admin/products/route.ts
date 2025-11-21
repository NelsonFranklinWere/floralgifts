import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const products = await getProducts({});
    return NextResponse.json(products);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        slug: body.slug,
        title: body.title,
        description: body.description,
        short_description: body.short_description,
        price: body.price,
        category: body.category,
        tags: body.tags || [],
        teddy_size: body.teddy_size || null,
        teddy_color: body.teddy_color || null,
        images: body.images || [],
        included_items: body.included_items || null,
        upsells: body.upsells || null,
        stock: body.stock || 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

