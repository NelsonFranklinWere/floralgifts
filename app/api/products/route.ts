import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";
import { getAllCatalogProducts } from "@/lib/catalog-products";
import {
  filterProductsByRecipient,
  type GiftRecipient,
} from "@/lib/recipient-gifts";
import {
  filterProductsByOccasion,
  type GiftOccasion,
} from "@/lib/occasion-gifts";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const recipient = searchParams.get("recipient") as GiftRecipient | null;
    const occasion = searchParams.get("occasion") as GiftOccasion | null;
    const tagsParam = searchParams.get("tags");

    // Recipient or occasion filters — across all categories
    if (
      recipient === "mens" ||
      recipient === "womens" ||
      recipient === "kids" ||
      occasion === "graduation" ||
      occasion === "wedding" ||
      occasion === "valentines" ||
      occasion === "corporate"
    ) {
      let products = await getAllCatalogProducts();
      if (category) {
        products = products.filter(
          (p) => String(p.category).toLowerCase() === category.toLowerCase()
        );
      }
      if (
        recipient === "mens" ||
        recipient === "womens" ||
        recipient === "kids"
      ) {
        products = filterProductsByRecipient(products, recipient);
      }
      if (
        occasion === "graduation" ||
        occasion === "wedding" ||
        occasion === "valentines" ||
        occasion === "corporate"
      ) {
        products = filterProductsByOccasion(products, occasion);
      }
      const response = NextResponse.json(products);
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=300"
      );
      return response;
    }

    const filters: any = {};
    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;
    if (tagsParam) {
      filters.tags = tagsParam.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const dbProducts = await getProducts(filters);

    let allProducts = [...dbProducts];
    if (
      category === "flowers" ||
      category === "wines" ||
      category === "chocolates" ||
      category === "cards" ||
      category === "cakes" ||
      category === "hampers" ||
      category === "teddy"
    ) {
      const predefinedProducts = getPredefinedProducts(category);
      const dbSlugs = new Set(dbProducts.map((p) => p.slug));
      const uniquePredefined = predefinedProducts.filter(
        (p) => !dbSlugs.has(p.slug)
      );
      allProducts = [...dbProducts, ...uniquePredefined];
    }

    const response = NextResponse.json(allProducts);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
