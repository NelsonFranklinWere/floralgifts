import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyStaffToken } from "@/lib/staff-jwt";

const PUBLIC_STAFF_PATHS = ["/staff/login", "/staff/forgot-password", "/staff/reset-password"];

function forwardPathname(request: NextRequest, response: NextResponse) {
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

function nextWithPathname(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

function staffLoginRedirect(request: NextRequest, pathname: string) {
  const loginUrl = new URL("/staff/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  const res = NextResponse.redirect(loginUrl);
  res.cookies.set("staff_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set("admin_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  return forwardPathname(request, res);
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Staff portal: valid JWT required (not just a stale cookie string)
  if (
    pathname.startsWith("/staff") &&
    !PUBLIC_STAFF_PATHS.some((p) => pathname.startsWith(p))
  ) {
    if (!verifyStaffToken(request)) {
      return staffLoginRedirect(request, pathname);
    }
  }

  // Skip heavy header work for high-frequency background pings
  if (pathname === "/api/analytics" || pathname === "/api/visitor-ping") {
    return nextWithPathname(request);
  }

  const response = nextWithPathname(request);

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
