import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    try {
      requireAdmin(request);
    } catch (authError: any) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { image, title, subtitle, ctaText, ctaLink, position } = body || {};

    const updates: any = {};
    if (image !== undefined) updates.image = image;
    if (title !== undefined) updates.title = title;
    if (subtitle !== undefined) updates.subtitle = subtitle;
    if (ctaText !== undefined) updates.cta_text = ctaText;
    if (ctaLink !== undefined) updates.cta_link = ctaLink;
    if (position !== undefined) updates.position = position;

    const { data, error } = await (supabaseAdmin.from("hero_slides") as any)
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating hero slide:", error);
      return NextResponse.json({ message: "Failed to update hero slide" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error updating hero slide:", error);
    return NextResponse.json({ message: "Failed to update hero slide" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    try {
      requireAdmin(request);
    } catch (authError: any) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const { error } = await (supabaseAdmin.from("hero_slides") as any)
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting hero slide:", error);
      return NextResponse.json({ message: "Failed to delete hero slide" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error deleting hero slide:", error);
    return NextResponse.json({ message: "Failed to delete hero slide" }, { status: 500 });
  }
}

