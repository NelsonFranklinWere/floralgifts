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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "File must be an image" }, { status: 400 });
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ message: "File size must be less than 10MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // MANDATORY: Compress and optimize image using sharp - ALL images must be compressed
    let compressedBuffer: Buffer;
    let contentType: string;
    let fileExtension: string;

    try {
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();
      
      // Determine output format (prefer WebP for better compression)
      const shouldUseWebP = file.type !== "image/gif" && file.type !== "image/svg+xml";
      
      if (shouldUseWebP) {
        // MANDATORY: Compress to WebP format with quality 80
        // Resize if image is too large (max 2000px on longest side)
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

        compressedBuffer = await imageProcessor
          .webp({ quality: 80, effort: 6 })
          .toBuffer();
        
        contentType = "image/webp";
        fileExtension = "webp";
      } else {
        // For GIF, optimize but keep format
        if (file.type === "image/gif") {
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

          compressedBuffer = await imageProcessor
            .gif()
            .toBuffer();
          contentType = "image/gif";
          fileExtension = "gif";
        } else {
          // For SVG or other formats, convert to optimized JPEG
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

          compressedBuffer = await imageProcessor
            .jpeg({ quality: 80, mozjpeg: true })
            .toBuffer();
          contentType = "image/jpeg";
          fileExtension = "jpg";
        }
      }

      const originalSize = inputBuffer.length;
      const compressedSize = compressedBuffer.length;
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      
      console.log(`[Image Upload] MANDATORY COMPRESSION: Original: ${(originalSize / 1024).toFixed(2)}KB, Compressed: ${(compressedSize / 1024).toFixed(2)}KB, Reduction: ${reduction}%`);
    } catch (compressionError) {
      console.error("MANDATORY Image compression failed:", compressionError);
      // Compression is mandatory - if it fails, return error instead of fallback
      return NextResponse.json(
        { message: `Image compression failed: ${compressionError instanceof Error ? compressionError.message : 'Unknown error'}. Please try a different image.` },
        { status: 500 }
      );
    }

    // Generate unique filename with compressed extension
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").split('.')[0];
    const filename = `${timestamp}-${originalName}.${fileExtension}`;
    const filePath = `products/${category}/${filename}`;

    // Upload compressed image to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .upload(filePath, compressedBuffer, {
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
      return NextResponse.json(
        { message: "Failed to get public URL for uploaded image" },
        { status: 500 }
      );
    }

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

