import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const featured = searchParams.get("featured");

    let query = (supabaseAdmin
      .from("blog_posts") as any)
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
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    const { data, error } = await (supabaseAdmin
      .from("blog_posts") as any)
      .insert({
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author || "Floral Whispers Team",
        published_at: body.publishedAt || new Date().toISOString(),
        image: body.image,
        category: body.category,
        tags: body.tags || [],
        read_time: body.readTime || 5,
        featured: body.featured || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Revalidate blog pages
    revalidatePath("/blog");
    revalidatePath(`/blog/${body.slug}`);

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to create blog post" },
      { status: 500 }
    );
  }
}

