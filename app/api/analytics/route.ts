import { NextRequest, NextResponse } from "next/server";

/** Lightweight analytics sink — batched client events; must stay fast. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const events = Array.isArray(body?.events) ? body.events : [body];

    if (process.env.ANALYTICS_DEBUG === "1") {
      for (const event of events) {
        console.log("[Analytics]", event?.event ?? "unknown", event);
      }
    }

    // Store in Supabase / GA when wired; acknowledge immediately
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}

