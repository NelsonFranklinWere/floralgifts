import { NextRequest, NextResponse } from "next/server";
import { getAllCatalogProducts } from "@/lib/catalog-products";
import {
  detectRecipientFromQuery,
  filterProductsByRecipient,
  type GiftRecipient,
} from "@/lib/recipient-gifts";
import {
  detectOccasionFromQuery,
  filterProductsByOccasion,
  type GiftOccasion,
} from "@/lib/occasion-gifts";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const RECIPIENTS: GiftRecipient[] = ["mens", "womens", "kids"];
const OCCASIONS: GiftOccasion[] = [
  "graduation",
  "wedding",
  "valentines",
  "corporate",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const recipientParam = searchParams.get("recipient") as GiftRecipient | null;
    const occasionParam = searchParams.get("occasion") as GiftOccasion | null;
    const category = searchParams.get("category");

    const allProducts = await getAllCatalogProducts();
    let pool = allProducts;

    if (category && category.trim()) {
      const cat = category.trim().toLowerCase();
      pool = pool.filter((p) => String(p.category).toLowerCase() === cat);
    }

    const recipient =
      recipientParam && RECIPIENTS.includes(recipientParam)
        ? recipientParam
        : query
          ? detectRecipientFromQuery(query)
          : null;

    const occasion =
      occasionParam && OCCASIONS.includes(occasionParam)
        ? occasionParam
        : query
          ? detectOccasionFromQuery(query)
          : null;

    if (recipient) {
      pool = filterProductsByRecipient(pool, recipient);
    }
    if (occasion) {
      pool = filterProductsByOccasion(pool, occasion);
    }

    if (!query || !query.trim()) {
      if (recipient || occasion) {
        const response = NextResponse.json(pool.slice(0, 40));
        response.headers.set(
          "Cache-Control",
          "public, s-maxage=60, stale-while-revalidate=300"
        );
        return response;
      }
      return NextResponse.json([]);
    }

    const searchTerm = query.trim().toLowerCase();
    const pureRecipient = recipient && detectRecipientFromQuery(query) === recipient;
    const pureOccasion = occasion && detectOccasionFromQuery(query) === occasion;

    const matchingProducts = pool.filter((product) => {
      if (pureRecipient || pureOccasion) return true;

      return (
        product.title?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.short_description?.toLowerCase().includes(searchTerm) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.subcategory?.toLowerCase().includes(searchTerm)
      );
    });

    const response = NextResponse.json(matchingProducts.slice(0, 40));
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    return response;
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to search products" },
      { status: 500 }
    );
  }
}
