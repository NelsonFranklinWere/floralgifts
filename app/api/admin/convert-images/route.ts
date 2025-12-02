import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import sharp from "sharp";

export const dynamic = "force-dynamic";

/**
 * Bulk convert existing images in Supabase storage to JPEG
 * This endpoint processes all images in the product-images bucket
 * and converts them to JPEG format for universal browser compatibility
 */
export async function POST(request: NextRequest) {
  try {
    // Admin auth
    requireAdmin(request);

    const { category, limit = 50 } = await request.json().catch(() => ({}));

    // Get all files from storage
    const bucket = "product-images";
    const prefix = category ? `products/${category}/` : "products/";

    const { data: files, error: listError } = await supabaseAdmin.storage
      .from(bucket)
      .list(prefix, {
        limit: limit || 1000,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (listError) {
      return NextResponse.json(
        { message: "Failed to list files", error: listError.message },
        { status: 500 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json({
        message: "No files found to convert",
        converted: 0,
        skipped: 0,
        errors: [],
      });
    }

    const results = {
      converted: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Process each file
    for (const file of files) {
      try {
        // Skip if already JPEG
        if (file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".jpeg")) {
          results.skipped++;
          continue;
        }

        const filePath = `${prefix}${file.name}`;

        // Download the original file
        const { data: originalData, error: downloadError } = await supabaseAdmin.storage
          .from(bucket)
          .download(filePath);

        if (downloadError || !originalData) {
          results.errors.push(`${file.name}: Download failed`);
          continue;
        }

        // Convert to JPEG
        const buffer = Buffer.from(await originalData.arrayBuffer());
        let jpegBuffer: Buffer;

        try {
          jpegBuffer = await sharp(buffer)
            .jpeg({ quality: 90, mozjpeg: true, progressive: true })
            .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
            .toBuffer();
        } catch (sharpError) {
          results.errors.push(`${file.name}: Conversion failed`);
          continue;
        }

        // Generate new filename with .jpg extension
        const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
        const newPath = `${prefix}${newName}`;

        // Upload converted image
        const { error: uploadError } = await supabaseAdmin.storage
          .from(bucket)
          .upload(newPath, jpegBuffer, {
            contentType: "image/jpeg",
            upsert: true,
            cacheControl: "public, max-age=31536000, immutable",
          });

        if (uploadError) {
          results.errors.push(`${file.name}: Upload failed`);
          continue;
        }

        // Delete old file (optional - comment out if you want to keep originals)
        if (filePath !== newPath) {
          await supabaseAdmin.storage.from(bucket).remove([filePath]);
        }

        results.converted++;
      } catch (error: any) {
        results.errors.push(`${file.name}: ${error.message}`);
      }
    }

    return NextResponse.json({
      message: `Conversion complete: ${results.converted} converted, ${results.skipped} skipped`,
      ...results,
    });
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("Conversion error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to convert images" },
      { status: 500 }
    );
  }
}

