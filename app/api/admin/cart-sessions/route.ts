import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listCartSessions } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const limit = Math.min(
      500,
      Math.max(1, Number(request.nextUrl.searchParams.get("limit") || 100) || 100)
    );
    const sessions = await listCartSessions(limit);
    return NextResponse.json(sessions);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to fetch cart sessions" },
      { status: 500 }
    );
  }
}
