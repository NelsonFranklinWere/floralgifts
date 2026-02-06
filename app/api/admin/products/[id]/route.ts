import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await (supabaseAdmin
      .from("products") as any)
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Get old product before update to revalidate old slug if changed
    const oldProduct = await getProductById(id);
    
    // Revalidate product pages
    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath("/collections/flowers");
    revalidatePath("/collections/teddy-bears");
    revalidatePath("/collections/gift-hampers");
    revalidatePath("/collections/wines");
    revalidatePath("/collections/chocolates");
    revalidatePath(`/product/${data.slug}`);
    if (oldProduct && oldProduct.slug !== data.slug) {
      // If slug changed, revalidate old slug too
      revalidatePath(`/product/${oldProduct.slug}`);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    // Get product before deletion to revalidate its pages
    const product = await getProductById(id);
    
    const { error } = await (supabaseAdmin.from("products") as any).delete().eq("id", id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Revalidate product pages
    if (product) {
      revalidatePath("/");
      revalidatePath("/collections");
      revalidatePath("/collections/flowers");
      revalidatePath("/collections/teddy-bears");
      revalidatePath("/collections/gift-hampers");
      revalidatePath("/collections/wines");
      revalidatePath("/collections/chocolates");
      revalidatePath(`/product/${product.slug}`);
    }

    return NextResponse.json({ message: "Product deleted" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

