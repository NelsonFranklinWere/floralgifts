import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const { data, error } = await (supabaseAdmin
      .from("blog_posts") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to fetch blog post" },
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

    const updateData: {
      updated_at: string;
      slug?: string;
      title?: string;
      excerpt?: string;
      content?: string;
      author?: string;
      published_at?: string;
      image?: string;
      category?: string;
      tags?: string[];
      read_time?: number;
      featured?: boolean;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.publishedAt !== undefined) updateData.published_at = body.publishedAt;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.readTime !== undefined) updateData.read_time = body.readTime;
    if (body.featured !== undefined) updateData.featured = body.featured;

    const { data, error } = await (supabaseAdmin
      .from("blog_posts") as any)
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Revalidate blog pages
    revalidatePath("/blog");
    if (data.slug) {
      revalidatePath(`/blog/${data.slug}`);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to update blog post" },
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

    const { error } = await (supabaseAdmin
      .from("blog_posts") as any)
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Revalidate blog pages
    revalidatePath("/blog");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

