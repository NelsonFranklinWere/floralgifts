import { NextRequest, NextResponse } from "next/server";
import { upsertCartSession } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
    if (!sessionId || sessionId.length > 80) {
      return NextResponse.json({ ok: false, message: "Invalid session" }, { status: 400 });
    }

    const session = await upsertCartSession({
      sessionId,
      event: typeof body.event === "string" ? body.event : undefined,
      items: body.items,
      cart_total: body.cart_total,
      fields: body.fields,
      path: typeof body.path === "string" ? body.path : undefined,
      referrer: typeof body.referrer === "string" ? body.referrer : undefined,
      user_agent: request.headers.get("user-agent") || undefined,
      converted_order_id:
        typeof body.converted_order_id === "string" ? body.converted_order_id : null,
    });

    if (!session) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true, sessionId: session.session_id });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
