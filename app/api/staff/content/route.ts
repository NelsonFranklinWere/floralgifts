import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);
    const { data: blogs } = await (supabaseAdmin.from("blog_posts") as ReturnType<typeof supabaseAdmin.from>)
      .select("id, slug, title, published, created_at, updated_at")
      .order("created_at", { ascending: false });

    const { data: slides } = await (supabaseAdmin.from("hero_slides") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .order("position");

    const { data: sections } = await (supabaseAdmin.from("homepage_sections") as ReturnType<typeof supabaseAdmin.from>)
      .select("*");

    return NextResponse.json({
      blogs: blogs || [],
      heroSlides: slides || [],
      homepageSections: sections || [],
    });
  } catch {
    return NextResponse.json({ blogs: [], heroSlides: [], homepageSections: [] });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireStaff(request);
    const { type, id, ...updates } = await request.json();

    if (type === "homepage_section") {
      const { data, error } = await (supabaseAdmin.from("homepage_sections") as ReturnType<typeof supabaseAdmin.from>)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: "Use blog/hero admin APIs for other content" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
