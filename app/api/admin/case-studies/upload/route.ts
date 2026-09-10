import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    try {
      requireAdmin(request);
    } catch (authError: any) {
      if (authError?.message === "Unauthorized") {
        return NextResponse.json(
          { message: "Please log in to upload images" },
          { status: 401 },
        );
      }
      throw authError;
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const slug = (formData.get("slug") as string | null)?.trim();
    const kind = (formData.get("kind") as string | null) || "gallery";

    if (!file) {
      return NextResponse.json(
        { message: "Please select an image to upload" },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { message: "Please set a slug before uploading images" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Please upload an image file" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let processedBuffer: Buffer;
    try {
      processedBuffer = await sharp(buffer)
        .jpeg({
          quality: 75,
          mozjpeg: true,
          progressive: true,
        })
        .resize(1600, 1600, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();
    } catch {
      processedBuffer = buffer;
    }

    const timestamp = Date.now();
    const filename =
      kind === "hero"
        ? `hero-${timestamp}.jpg`
        : `gallery-${timestamp}.jpg`;

    try {
      const absoluteDir = path.join(process.cwd(), "public", "images", "case-studies", slug);
      await fs.mkdir(absoluteDir, { recursive: true });
      await fs.writeFile(path.join(absoluteDir, filename), processedBuffer);
    } catch (writeError: any) {
      console.error("Local image write error (case-studies):", writeError);
      return NextResponse.json(
        { message: "Failed to upload image. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: `/images/case-studies/${slug}/${filename}` });
  } catch (error: any) {
    console.error("Unexpected case study upload error:", error);
    return NextResponse.json(
      { message: "An error occurred while uploading. Please try again." },
      { status: 500 },
    );
  }
}
