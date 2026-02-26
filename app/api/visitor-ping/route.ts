import { NextRequest, NextResponse } from "next/server";
import { addVisitorPing } from "@/lib/visitor-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path : request.headers.get("referer") || "";
    const referrer = typeof body.referrer === "string" ? body.referrer : (request.headers.get("referer") || "");
    const userAgent = request.headers.get("user-agent") || "";

    // Normalize path: use pathname from URL if path looks like a full URL
    let pathname = path;
    if (pathname.startsWith("http")) {
      try {
        pathname = new URL(pathname).pathname;
      } catch {
        pathname = "/";
      }
    }
    if (!pathname || pathname === "") {
      pathname = "/";
    }

    addVisitorPing({
      path: pathname,
      referrer: referrer.slice(0, 500),
      userAgent: userAgent.slice(0, 500),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
