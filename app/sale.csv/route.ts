import { NextResponse } from "next/server";
import {
  buildMetaCatalogCsv,
  META_CATALOG_FEED_HEADERS,
} from "@/lib/meta-catalog-feed";

// Legacy alias — prefer /feeds/meta.csv for Meta Commerce Manager

export const dynamic = "force-dynamic";

export async function GET() {
  const csv = await buildMetaCatalogCsv();
  return new NextResponse(csv, {
    status: 200,
    headers: {
      ...META_CATALOG_FEED_HEADERS,
      "Content-Disposition": 'inline; filename="sale.csv"',
    },
  });
}
