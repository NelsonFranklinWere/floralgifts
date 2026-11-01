import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "floralwhispersgifts.co.ke";

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const { pathname, search } = request.nextUrl;

  // One host for SEO. Payment providers post callbacks to www, so /api stays as it is.
  if (host === `www.${CANONICAL_HOST}` && !pathname.startsWith("/api/")) {
    return NextResponse.redirect(`https://${CANONICAL_HOST}${pathname}${search}`, 301);
  }

  const response = NextResponse.next();

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  // Cache static assets aggressively
  if (
    request.nextUrl.pathname.startsWith("/_next/static") ||
    request.nextUrl.pathname.startsWith("/images/") ||
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot)$/i)
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // Cache products API responses for a short time
  if (request.nextUrl.pathname.startsWith("/api/products")) {
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
