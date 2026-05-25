import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logStaffAction } from "@/lib/staff-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, token, password } = await request.json();
    if (!email || !token || !password || password.length < 6) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const { data: admin } = await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .eq("email", normalizedEmail)
      .eq("reset_token", token)
      .single();

    if (!admin) {
      return NextResponse.json({ message: "Invalid or expired reset link" }, { status: 400 });
    }

    const row = admin as Record<string, unknown>;
    if (row.reset_token_expires_at && new Date(row.reset_token_expires_at as string) < new Date()) {
      return NextResponse.json({ message: "Reset link has expired" }, { status: 400 });
    }

    await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
      .update({
        password_hash: password,
        reset_token: null,
        reset_token_expires_at: null,
      })
      .eq("email", normalizedEmail);

    await logStaffAction({
      staffEmail: normalizedEmail,
      action: "password_reset",
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Reset failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
