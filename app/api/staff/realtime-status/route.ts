import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Checks if orders table is on supabase_realtime publication (via test channel). */
export async function GET(request: NextRequest) {
  try {
    requireStaff(request);

    let publicationReady = false;
    await new Promise<void>((resolve) => {
      const channel = supabaseAdmin
        .channel(`realtime-check-${Date.now()}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders" },
          () => {
            publicationReady = true;
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setTimeout(() => {
              supabaseAdmin.removeChannel(channel);
              resolve();
            }, 800);
          }
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            supabaseAdmin.removeChannel(channel);
            resolve();
          }
        });
      setTimeout(() => {
        supabaseAdmin.removeChannel(channel);
        resolve();
      }, 2000);
    });

    return NextResponse.json({
      publicationReady,
      projectRef: process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1] ?? null,
      setupHint: publicationReady
        ? "Realtime is active"
        : "Run supabase/setup-admin-realtime.sql in Supabase SQL Editor",
    });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
