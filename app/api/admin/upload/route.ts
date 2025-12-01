import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import sharp from "sharp";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    if (!category || !["flowers", "hampers", "teddy", "wines", "chocolates"].includes(category)) {
      return NextResponse.json({ message: "Invalid category" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Convert to mobile-compatible JPEG for all images (except GIFs)
    let processedBuffer: Buffer;
    let contentType: string;
    let fileExtension: string;

    try {
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();

      // Resize if too large (max 2000px on longest side for mobile compatibility)
      const maxDimension = 2000;
      let needsResize = false;
      let resizeWidth: number | undefined;
      let resizeHeight: number | undefined;

      if (metadata.width && metadata.height) {
        if (metadata.width > maxDimension || metadata.height > maxDimension) {
          needsResize = true;
          if (metadata.width > metadata.height) {
            resizeWidth = maxDimension;
          } else {
            resizeHeight = maxDimension;
          }
        }
      }

      let imageProcessor = image;
      if (needsResize) {
        imageProcessor = imageProcessor.resize(resizeWidth, resizeHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      if (file.type === "image/gif") {
        // Keep GIF format (for animations) but resize if needed
        processedBuffer = await imageProcessor.gif().toBuffer();
        contentType = "image/gif";
        fileExtension = "gif";
      } else {
        // Convert ALL other formats to JPEG for universal mobile compatibility
        // This ensures HEIC, PNG, WebP, etc. all work on phones
        processedBuffer = await imageProcessor
          .jpeg({ 
            quality: 85, 
            mozjpeg: true, 
            progressive: true,
            chromaSubsampling: '4:2:0' // Better mobile compatibility
          })
          .toBuffer();
        contentType = "image/jpeg";
        fileExtension = "jpg";
      }

      const originalSize = inputBuffer.length;
      const processedSize = processedBuffer.length;
      const reduction = ((1 - processedSize / originalSize) * 100).toFixed(1);
      
      console.log(`[Upload] File: ${file.name}, Type: ${file.type}, Size: ${(originalSize / 1024).toFixed(2)}KB`);
      console.log(`[Upload] Converted to: ${contentType}, Size: ${(processedSize / 1024).toFixed(2)}KB, Reduction: ${reduction}%`);
    } catch (processingError) {
      console.error("Image processing failed:", processingError);
      return NextResponse.json(
        { message: `Image processing failed: ${processingError instanceof Error ? processingError.message : 'Unknown error'}. Please try a different image.` },
        { status: 500 }
      );
    }

    // Generate unique filename with correct extension
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").split('.')[0];
    const filename = `${timestamp}-${originalName}.${fileExtension}`;
    const filePath = `products/${category}/${filename}`;
    
    console.log(`[Upload] Generated path: ${filePath}`);

    // Upload processed image to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(filePath, processedBuffer, {
        contentType: contentType,
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error("Supabase storage error:", error);
      // If bucket doesn't exist, provide helpful error
      if (error.message?.includes("Bucket not found") || error.message?.includes("The resource was not found")) {
        return NextResponse.json(
          { 
            message: "Storage bucket not configured. Please create a 'product-images' bucket in Supabase Storage with public access.",
            error: "BUCKET_NOT_FOUND"
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: error.message || "Failed to upload image to storage" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      console.error("[Upload] Failed to get public URL");
      return NextResponse.json(
        { message: "Failed to get public URL for uploaded image" },
        { status: 500 }
      );
    }

    console.log(`[Upload] Success! Public URL: ${urlData.publicUrl}`);
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}

