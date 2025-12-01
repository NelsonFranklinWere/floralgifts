import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Admin auth
    requireAdmin(request);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    if (!category || !["flowers", "hampers", "teddy", "wines", "chocolates"].includes(category)) {
      return NextResponse.json({ message: "Invalid category" }, { status: 400 });
    }

    // Basic type guard – still allow all image types from phone storage
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "File must be an image" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Unique filename, keep original extension
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${safeName}`;
    const filePath = `products/${category}/${filename}`;

    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      if (
        error.message?.includes("Bucket not found") ||
        error.message?.includes("The resource was not found")
      ) {
        return NextResponse.json(
          {
            message:
              "Storage bucket not configured. Please create a 'product-images' bucket in Supabase Storage with public access.",
            error: "BUCKET_NOT_FOUND",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: error.message || "Failed to upload image to storage" },
        { status: 500 }
      );
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { message: "Failed to get public URL for uploaded image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("Upload error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}


