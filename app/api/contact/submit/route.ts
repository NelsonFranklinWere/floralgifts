import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    await (supabaseAdmin.from("contact_messages") as ReturnType<typeof supabaseAdmin.from>).insert({
      name,
      email,
      phone: phone || null,
      subject: subject || "General enquiry",
      message,
      status: "unread",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
