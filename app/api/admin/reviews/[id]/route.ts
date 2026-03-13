import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching review:", error);
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error in reviews/[id] GET:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const body = await request.json() as Record<string, unknown>;

    const { data, error } = await (supabaseAdmin
      .from("reviews") as any)
      .update({
        reviewer_name: body.reviewer_name,
        avatar_initials: body.avatar_initials,
        avatar_colour: body.avatar_colour,
        rating: body.rating,
        review_text: body.review_text,
        review_date: body.review_date,
        category: body.category || null,
        verified: body.verified ?? true,
        sort_order: body.sort_order ?? 0,
      } as any)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating review:", error);
      return NextResponse.json({ message: "Failed to update review" }, { status: 400 });
    }

    revalidatePath("/");

    return NextResponse.json(data);
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error updating review:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  // Small partial update – e.g. verified toggle
  try {
    requireAdmin(request);
    const { id } = await params;
    const body = await request.json() as Record<string, unknown>;

    const { data, error } = await (supabaseAdmin
      .from("reviews") as any)
      .update(body as any)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error patching review:", error);
      return NextResponse.json({ message: "Failed to update review" }, { status: 400 });
    }

    revalidatePath("/");

    return NextResponse.json(data);
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error patching review:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting review:", error);
      return NextResponse.json({ message: "Failed to delete review" }, { status: 400 });
    }

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error deleting review:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

