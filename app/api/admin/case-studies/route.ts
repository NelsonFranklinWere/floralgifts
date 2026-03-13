import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { data, error } = await supabaseAdmin
      .from("case_studies")
      .select(
        "id, title, slug, category, hero_image_url, published, featured, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching case studies:", error);
      return NextResponse.json({ message: "Failed to load case studies" }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error in /api/admin/case-studies:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("case_studies")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error("Error creating case study:", error);
      return NextResponse.json({ message: "Failed to create case study" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error creating case study:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

