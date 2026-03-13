import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error in /api/admin/reviews:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json() as Record<string, unknown>;

    const { data, error } = await (supabaseAdmin
      .from("reviews") as any)
      .insert({
        reviewer_name: body.reviewer_name,
        avatar_initials: body.avatar_initials,
        avatar_colour: body.avatar_colour,
        rating: body.rating,
        review_text: body.review_text,
        review_date: body.review_date,
        category: (body.category as string | null) || null,
        verified: (body.verified as boolean | undefined) ?? true,
        sort_order: (body.sort_order as number | undefined) ?? 0,
      } as any)
      .select()
      .single();

    if (error) {
      console.error("Error creating review:", error);
      return NextResponse.json({ message: "Failed to create review" }, { status: 400 });
    }

    revalidatePath("/");

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error creating review:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  // Used for batch sort_order updates
  try {
    requireAdmin(request);
    const body = await request.json();
    const updates: { id: string; sort_order: number }[] = body?.updates ?? [];

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ message: "No updates provided" }, { status: 400 });
    }

    const { error } = await (supabaseAdmin.rpc as any)(
      "bulk_update_review_sort_order",
      { updates_arg: updates }
    );

    if (error) {
      console.error("Error updating sort order:", error);
      return NextResponse.json({ message: "Failed to update sort order" }, { status: 400 });
    }

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error updating sort order:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

