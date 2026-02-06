import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import sharp from "sharp";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Admin auth - catch auth errors gracefully
    try {
      requireAdmin(request);
    } catch (authError: any) {
      if (authError?.message === "Unauthorized") {
        return NextResponse.json(
          { message: "Please log in to upload images" },
          { 
            status: 401,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      throw authError;
    }

    let formData;
    try {
      formData = await request.formData();
    } catch (formError: any) {
      console.error("FormData parse error:", formError);
      return NextResponse.json(
        { message: "Invalid file upload. Please try again." },
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null;

    if (!file) {
      return NextResponse.json(
        { message: "Please select an image to upload" },
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!category || !["flowers", "hampers", "teddy", "wines", "chocolates", "cards"].includes(category)) {
      return NextResponse.json(
        { message: "Please select a valid category" },
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Basic type guard – still allow all image types from phone storage
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Please upload an image file" },
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    let bytes;
    let buffer;
    try {
      bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } catch (bufferError: any) {
      console.error("Buffer conversion error:", bufferError);
      return NextResponse.json(
        { message: "Error processing image. Please try a different file." },
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Convert ALL images to optimized JPEG for fast loading
    // Aggressive optimization for super fast loading
    let processedBuffer: Buffer;
    try {
      processedBuffer = await sharp(buffer)
        .jpeg({ 
          quality: 70, // Reduced for faster loading
          mozjpeg: true, 
          progressive: true,
          optimizeScans: true,
          trellisQuantisation: true,
          overshootDeringing: true,
          optimizeCoding: true,
        })
        .resize(1200, 1200, { // Reduced for faster loading - product cards don't need larger
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .toBuffer();
    } catch (sharpError: any) {
      console.error("Sharp conversion error:", sharpError);
      // If sharp fails, use original buffer (fallback)
      processedBuffer = buffer;
    }

    // Unique filename - always use .jpg extension for JPEG
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").replace(/\.[^.]+$/, "") || "image";
    const filename = `${timestamp}-${randomStr}-${safeName}.jpg`;
    const filePath = `products/${category}/${filename}`;

    let uploadResult;
    try {
      uploadResult = await supabaseAdmin.storage
        .from("product-images")
        .upload(filePath, processedBuffer, {
          contentType: "image/jpeg", // Always JPEG
          upsert: false,
          cacheControl: "public, max-age=31536000, immutable, stale-while-revalidate=86400", // Cache for 1 year with stale-while-revalidate
        });
    } catch (uploadError: any) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { message: "Failed to upload image. Please try again." },
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (uploadResult.error) {
      console.error("Supabase storage error:", uploadResult.error);
      if (
        uploadResult.error.message?.includes("Bucket not found") ||
        uploadResult.error.message?.includes("The resource was not found")
      ) {
        return NextResponse.json(
          {
            message: "Storage configuration error. Please contact support.",
          },
          { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      return NextResponse.json(
        { message: "Failed to save image. Please try again." },
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    let urlData;
    try {
      const urlResult = supabaseAdmin.storage
        .from("product-images")
        .getPublicUrl(filePath);
      urlData = urlResult.data;
    } catch (urlError: any) {
      console.error("URL generation error:", urlError);
      return NextResponse.json(
        { message: "Image uploaded but failed to get URL. Please try again." },
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { message: "Image uploaded but URL is missing. Please try again." },
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return NextResponse.json({ 
      url: urlData.publicUrl,
    }, {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("Unexpected upload error:", error);
    return NextResponse.json(
      { message: "An error occurred while uploading. Please try again." },
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}


