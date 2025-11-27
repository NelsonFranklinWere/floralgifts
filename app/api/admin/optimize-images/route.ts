import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import sharp from "sharp";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const productId = body.productId; // Optional: optimize specific product
    const optimizeAll = body.optimizeAll || false;

    // Fetch products
    let query = (supabaseAdmin.from("products") as any).select("id, title, images, category");
    
    if (productId) {
      query = query.eq("id", productId);
    }

    const { data: products, error: fetchError } = await query;

    if (fetchError) {
      return NextResponse.json(
        { message: `Failed to fetch products: ${fetchError.message}` },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }

    const results = {
      processed: 0,
      optimized: 0,
      skipped: 0,
      errors: [] as string[],
      details: [] as Array<{ productId: string; title: string; images: number; optimized: number }>,
    };

    // Process each product
    for (const product of products) {
      if (!product.images || product.images.length === 0) {
        results.skipped++;
        continue;
      }

      const optimizedImages: string[] = [];
      let optimizedCount = 0;

      // Process each image
      for (const imageUrl of product.images) {
        try {
          // Skip if already a Supabase Storage URL (likely already optimized)
          if (imageUrl.includes('supabase.co/storage')) {
            optimizedImages.push(imageUrl);
            continue;
          }

          // Skip local paths - these are static files that can't be optimized server-side
          // They should be optimized manually or replaced with uploaded images
          if (imageUrl.startsWith('/images/')) {
            optimizedImages.push(imageUrl);
            continue;
          }

          // Download the image
          let imageBuffer: Buffer;
          let originalUrl = imageUrl;

          // If it's a full URL, download it
          if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            const response = await fetch(imageUrl);
            if (!response.ok) {
              throw new Error(`Failed to download image: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            imageBuffer = Buffer.from(arrayBuffer);
          } else {
            // Try to get from Supabase Storage
            const pathMatch = imageUrl.match(/products\/([^\/]+)\/(.+)/);
            if (pathMatch) {
              const [, category, filename] = pathMatch;
              const { data, error: downloadError } = await supabaseAdmin.storage
                .from("product-images")
                .download(`products/${category}/${filename}`);
              
              if (downloadError || !data) {
                // If not in storage, skip
                optimizedImages.push(imageUrl);
                continue;
              }
              
              const arrayBuffer = await data.arrayBuffer();
              imageBuffer = Buffer.from(arrayBuffer);
            } else {
              // Skip if we can't determine the source
              optimizedImages.push(imageUrl);
              continue;
            }
          }

          // Compress the image
          const image = sharp(imageBuffer);
          const metadata = await image.metadata();
          
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

          const compressedBuffer = await imageProcessor
            .webp({ quality: 80, effort: 6 })
            .toBuffer();

          const originalSize = imageBuffer.length;
          const compressedSize = compressedBuffer.length;
          const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

          console.log(`[Optimize] ${product.title}: ${(originalSize / 1024).toFixed(2)}KB → ${(compressedSize / 1024).toFixed(2)}KB (${reduction}% reduction)`);

          // Upload compressed image to Supabase Storage
          const category = product.category || "flowers";
          const timestamp = Date.now();
          const filename = `${timestamp}-optimized-${product.id}-${optimizedCount}.webp`;
          const filePath = `products/${category}/${filename}`;

          const { error: uploadError } = await supabaseAdmin.storage
            .from("product-images")
            .upload(filePath, compressedBuffer, {
              contentType: "image/webp",
              upsert: true, // Overwrite if exists
            });

          if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
          }

          // Get public URL
          const { data: urlData } = supabaseAdmin.storage
            .from("product-images")
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            optimizedImages.push(urlData.publicUrl);
            optimizedCount++;
          } else {
            optimizedImages.push(imageUrl); // Fallback to original
          }

        } catch (error: any) {
          console.error(`[Optimize] Error processing image for ${product.title}:`, error);
          results.errors.push(`${product.title}: ${error.message}`);
          optimizedImages.push(imageUrl); // Keep original on error
        }
      }

      // Update product with optimized images if any were optimized
      if (optimizedCount > 0) {
        try {
          const { error: updateError } = await (supabaseAdmin
            .from("products") as any)
            .update({ images: optimizedImages })
            .eq("id", product.id);

          if (updateError) {
            throw new Error(`Update failed: ${updateError.message}`);
          }

          results.optimized++;
          results.details.push({
            productId: product.id,
            title: product.title,
            images: product.images.length,
            optimized: optimizedCount,
          });
        } catch (error: any) {
          results.errors.push(`${product.title} (update): ${error.message}`);
        }
      } else {
        results.skipped++;
      }

      results.processed++;
    }

    return NextResponse.json({
      message: "Image optimization completed",
      summary: {
        total: products.length,
        processed: results.processed,
        optimized: results.optimized,
        skipped: results.skipped,
        errors: results.errors.length,
      },
      details: results.details,
      errors: results.errors,
    });

  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Optimize images error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to optimize images" },
      { status: 500 }
    );
  }
}

