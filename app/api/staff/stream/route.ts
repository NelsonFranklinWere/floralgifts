import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const POLL_MS = 4000;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifyStreamToken(request: NextRequest): boolean {
  const token =
    request.nextUrl.searchParams.get("token") ||
    request.cookies.get("staff_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!verifyStreamToken(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();
  const since = new Date().toISOString();
  let lastOrderAt = since;
  let lastMessageAt = since;
  const seenOrderIds = new Set<string>();
  const seenMessageIds = new Set<string>();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          /* stream closed */
        }
      };

      send("connected", { at: Date.now(), mode: "live" });

      const channel = supabaseAdmin
        .channel(`staff-live-${Date.now()}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders" },
          (payload) => send("order_new", payload.new)
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders" },
          (payload) => send("order_updated", payload.new)
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "contact_messages" },
          (payload) => send("message_new", payload.new)
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") send("subscribed", { ok: true, source: "realtime" });
        });

      const poll = async () => {
        try {
          const { data: newOrders } = await (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
            .select("id, customer_name, status, order_status, total_amount, created_at")
            .gt("created_at", lastOrderAt)
            .order("created_at", { ascending: true })
            .limit(20);

          for (const row of newOrders || []) {
            const o = row as { id: string; created_at: string };
            if (seenOrderIds.has(o.id)) continue;
            seenOrderIds.add(o.id);
            lastOrderAt = o.created_at;
            send("order_new", row);
          }

          const { data: newMessages } = await (
            supabaseAdmin.from("contact_messages") as ReturnType<typeof supabaseAdmin.from>
          )
            .select("id, name, email, subject, status, created_at")
            .gt("created_at", lastMessageAt)
            .order("created_at", { ascending: true })
            .limit(20);

          for (const row of newMessages || []) {
            const m = row as { id: string; created_at: string };
            if (seenMessageIds.has(m.id)) continue;
            seenMessageIds.add(m.id);
            lastMessageAt = m.created_at;
            send("message_new", row);
          }

          send("sync", { at: Date.now() });
        } catch (err) {
          console.warn("[staff/stream] poll error:", err);
        }
      };

      poll();
      const heartbeat = setInterval(() => send("ping", { t: Date.now() }), 25000);
      const poller = setInterval(poll, POLL_MS);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        clearInterval(poller);
        supabaseAdmin.removeChannel(channel);
        try {
          controller.close();
        } catch {
          /* closed */
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
