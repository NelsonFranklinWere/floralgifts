import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const featured = searchParams.get("featured");

    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    if (featured !== null) {
      query = query.eq("featured", featured === "true");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching blog posts:", error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

