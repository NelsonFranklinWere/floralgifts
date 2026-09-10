import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

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

    if (!category || !["flowers", "hampers", "teddy", "wines", "chocolates", "cards", "cakes"].includes(category)) {
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
    const relativePath = `images/products/${category}/${filename}`;

    try {
      const absoluteDir = path.join(process.cwd(), "public", "images", "products", category);
      await fs.mkdir(absoluteDir, { recursive: true });
      await fs.writeFile(path.join(absoluteDir, filename), processedBuffer);
    } catch (writeError: any) {
      console.error("Local image write error:", writeError);
      return NextResponse.json(
        { message: "Failed to save image. Please try again." },
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return NextResponse.json({
      url: `/${relativePath}`,
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


