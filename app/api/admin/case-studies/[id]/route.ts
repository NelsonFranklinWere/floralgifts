import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("case_studies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching case study:", error);
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error in case-studies/[id] GET:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const body = await request.json() as Record<string, unknown>;

    const { data, error } = await (supabaseAdmin
      .from("case_studies") as any)
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating case study:", error);
      return NextResponse.json({ message: "Failed to update case study" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error updating case study:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("case_studies")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting case study:", error);
      return NextResponse.json({ message: "Failed to delete case study" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Unexpected error deleting case study:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

