import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RECIPIENT_EMAIL = "whispersfloral@gmail.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_Nw56zMAM_8ETmNmG34UqrD8VBkWBbpdBy";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

// Initialize Resend client
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, subject, message, html } = body;

    if (!subject || (!message && !html)) {
      return NextResponse.json(
        { message: "Subject and message are required" },
        { status: 400 }
      );
    }

    if (!resend) {
      console.log("Resend not configured. Would send:", {
        to: RECIPIENT_EMAIL,
        subject,
        message: message || html,
      });
      return NextResponse.json(
        { 
          message: "Email service not configured. Please set RESEND_API_KEY environment variable.",
          sent: false 
        },
        { status: 200 }
      );
    }

    const emailData = await resend.emails.send({
      from: FROM_EMAIL,
      to: RECIPIENT_EMAIL,
      subject: subject,
      html: html || message?.replace(/\n/g, "<br>") || `<p>${message}</p>`,
    });

    if (emailData.error) {
      throw new Error(emailData.error.message || "Failed to send email");
    }

    return NextResponse.json({ 
      message: "Email sent successfully",
      sent: true,
      id: emailData.data?.id 
    });
  } catch (error: any) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { 
        message: error.message || "Failed to send email",
        sent: false 
      },
      { status: 500 }
    );
  }
}

