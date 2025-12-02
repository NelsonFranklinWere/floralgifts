import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import sharp from "sharp";

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

    // Convert ALL images to JPEG for universal browser compatibility
    // This ensures images work on Windows, Android, Chrome, Brave, Safari, etc.
    let processedBuffer: Buffer;
    try {
      processedBuffer = await sharp(buffer)
        .jpeg({ 
          quality: 90, 
          mozjpeg: true, 
          progressive: true 
        })
        .resize(2000, 2000, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .toBuffer();
    } catch (sharpError) {
      console.error("Sharp conversion error:", sharpError);
      // If sharp fails, use original buffer (fallback)
      processedBuffer = buffer;
    }

    // Unique filename - always use .jpg extension for JPEG
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\.[^.]+$/, "");
    const filename = `${timestamp}-${safeName}.jpg`;
    const filePath = `products/${category}/${filename}`;

    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(filePath, processedBuffer, {
        contentType: "image/jpeg", // Always JPEG
        upsert: false,
        cacheControl: "public, max-age=31536000, immutable", // Cache for 1 year
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


