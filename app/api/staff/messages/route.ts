import { NextRequest, NextResponse } from "next/server";
import { requireStaff, staffRouteErrorResponse } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireStaff(request);

    const { data, error } = await (supabaseAdmin.from("contact_messages") as ReturnType<typeof supabaseAdmin.from>)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[staff/messages] contact_messages:", error.message);
      return NextResponse.json({ messages: [], whatsappLogs: [] });
    }

    const { data: waLogs, error: waError } = await (supabaseAdmin.from("whatsapp_logs") as ReturnType<
      typeof supabaseAdmin.from
    >)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (waError) {
      console.error("[staff/messages] whatsapp_logs:", waError.message);
    }

    return NextResponse.json({ messages: data || [], whatsappLogs: waLogs || [] });
  } catch (error) {
    return staffRouteErrorResponse(error, "staff/messages");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const staff = requireStaff(request);
    const { id, status, reply, toEmail } = await request.json();

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (reply) {
      updates.staff_reply = reply;
      updates.replied_at = new Date().toISOString();
      updates.replied_by = staff.email;
      updates.status = "resolved";

      if (toEmail && process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: toEmail,
          subject: "Re: Your enquiry — Floral Whispers Gifts",
          html: `<p>${reply.replace(/\n/g, "<br>")}</p><p>— Floral Whispers Gifts Team</p>`,
        });
      }
    }

    const { data, error } = await (supabaseAdmin.from("contact_messages") as ReturnType<typeof supabaseAdmin.from>)
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: unknown) {
    return staffRouteErrorResponse(error, "staff/messages");
  }
}
