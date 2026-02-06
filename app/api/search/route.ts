import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";

// Force dynamic rendering since we use request.url
export const dynamic = 'force-dynamic';

// Cache search results for 60 seconds
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    const searchTerm = query.trim().toLowerCase();

    // Fetch all products from database
    const dbProducts = await getProducts({});

    // Get all predefined products
    const predefinedFlowers = getPredefinedProducts("flowers");
    const predefinedWines = getPredefinedProducts("wines");
    const predefinedChocolates = getPredefinedProducts("chocolates");
    const allPredefined = [...predefinedFlowers, ...predefinedWines, ...predefinedChocolates];

    // Filter out predefined products that exist in database (by slug)
    const dbSlugs = new Set(dbProducts.map(p => p.slug));
    const uniquePredefined = allPredefined.filter(p => !dbSlugs.has(p.slug));

    // Combine all products
    const allProducts = [...dbProducts, ...uniquePredefined];

    // Filter products that match the search query
    const matchingProducts = allProducts.filter((product) => {
      const titleMatch = product.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = product.description?.toLowerCase().includes(searchTerm);
      const shortDescriptionMatch = product.short_description?.toLowerCase().includes(searchTerm);
      const tagsMatch = product.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
      const categoryMatch = product.category.toLowerCase().includes(searchTerm);

      return titleMatch || descriptionMatch || shortDescriptionMatch || tagsMatch || categoryMatch;
    });

    // Limit results to 10 for better performance
    const limitedResults = matchingProducts.slice(0, 10);

    const response = NextResponse.json(limitedResults);
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return response;
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to search products" },
      { status: 500 }
    );
  }
}

