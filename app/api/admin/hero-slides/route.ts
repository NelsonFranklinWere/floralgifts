import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await (supabaseAdmin.from("hero_slides") as any)
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching hero slides:", error);
      return NextResponse.json({ message: "Failed to fetch hero slides" }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Unexpected error fetching hero slides:", error);
    return NextResponse.json({ message: "Failed to fetch hero slides" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin auth
    try {
      requireAdmin(request);
    } catch (authError: any) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { image, title, subtitle, ctaText, ctaLink, position } = body || {};

    if (!image || !title || !ctaText || !ctaLink) {
      return NextResponse.json(
        { message: "image, title, ctaText and ctaLink are required" },
        { status: 400 }
      );
    }

    const insertData: any = {
      image,
      title,
      subtitle: subtitle || "",
      cta_text: ctaText,
      cta_link: ctaLink,
    };

    if (typeof position === "number") {
      insertData.position = position;
    }

    const { data, error } = await (supabaseAdmin.from("hero_slides") as any)
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      console.error("Error creating hero slide:", error);
      return NextResponse.json({ message: "Failed to create hero slide" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Unexpected error creating hero slide:", error);
    return NextResponse.json({ message: "Failed to create hero slide" }, { status: 500 });
  }
}

