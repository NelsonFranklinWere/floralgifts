import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

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

    const { data, error } = await (supabaseAdmin
      .from("products") as any)
      .insert({
        slug: body.slug,
        title: body.title,
        description: body.description,
        short_description: body.short_description,
        price: body.price,
        category: body.category,
        subcategory: body.subcategory || null,
        tags: [],
        teddy_size: body.teddy_size || null,
        teddy_color: body.teddy_color || null,
        images: body.images || [],
        included_items: body.included_items || null,
        upsells: null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Revalidate product pages
    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath("/collections/flowers");
    revalidatePath("/collections/teddy-bears");
    revalidatePath("/collections/gift-hampers");
    revalidatePath("/collections/wines");
    revalidatePath("/collections/chocolates");
    revalidatePath(`/product/${data.slug}`);

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

