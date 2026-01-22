import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";

// Cache products API for 60 seconds
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    const filters: any = {};
    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;

    const dbProducts = await getProducts(filters);
    
    // Include predefined products for flowers, wines, chocolates, and cards
    let allProducts = [...dbProducts];
    if (category === "flowers" || category === "wines" || category === "chocolates" || category === "cards") {
      const predefinedProducts = getPredefinedProducts(category);
      // Filter out predefined products that already exist in database (by slug)
      const dbSlugs = new Set(dbProducts.map(p => p.slug));
      const uniquePredefined = predefinedProducts.filter(p => !dbSlugs.has(p.slug));
      allProducts = [...dbProducts, ...uniquePredefined];
    }
    
    const response = NextResponse.json(allProducts);
    // Add caching headers for faster loading
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

