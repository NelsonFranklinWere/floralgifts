import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const { data: admin } = await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
      .select("id, email, name")
      .eq("email", normalizedEmail)
      .eq("is_active", true)
      .single();

    // Always return success to prevent email enumeration
    if (!admin) {
      return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
      .update({ reset_token: token, reset_token_expires_at: expires })
      .eq("email", normalizedEmail);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://floralwhispersgifts.co.ke";
    const resetUrl = `${baseUrl}/staff/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: normalizedEmail,
        subject: "Reset your Floral Whispers staff password",
        html: `<p>Hello,</p><p>Click the link below to reset your staff portal password (valid for 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, ignore this email.</p>`,
      });
    }

    return NextResponse.json({ message: "If that email exists, a reset link has been sent." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
