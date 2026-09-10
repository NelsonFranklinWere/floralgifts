import { NextResponse } from "next/server";
import {
  buildMetaCatalogCsv,
  META_CATALOG_FEED_HEADERS,
} from "@/lib/meta-catalog-feed";

// Meta Commerce Manager scheduled data feed (same pattern as whitelightstore.co.ke/feeds/meta.csv):
//   https://floralwhispersgifts.co.ke/feeds/meta.csv

export const dynamic = "force-dynamic";

export async function GET() {
  const csv = await buildMetaCatalogCsv();
  return new NextResponse(csv, {
    status: 200,
    headers: META_CATALOG_FEED_HEADERS,
  });
}
