import { NextRequest, NextResponse } from "next/server";
import {
  authenticateStaff,
  getClientIp,
  logStaffLogin,
  logStaffAction,
  setStaffCookie,
} from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const result = await authenticateStaff(email, password);

    if (!result) {
      await logStaffLogin({ email, ip, userAgent, success: false });
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const { admin, token } = result;
    const adminRow = admin as Record<string, unknown>;

    await (supabaseAdmin.from("admins") as ReturnType<typeof supabaseAdmin.from>)
      .update({ last_login_at: new Date().toISOString(), last_login_ip: ip })
      .eq("id", adminRow.id);

    await logStaffLogin({
      email: adminRow.email as string,
      ip,
      userAgent,
      success: true,
    });

    await logStaffAction({
      staffEmail: adminRow.email as string,
      staffId: adminRow.id as string,
      staffName: (adminRow.name as string) || undefined,
      action: "login",
      ipAddress: ip,
    });

    const userRole = adminRow.role === "staff" ? "staff" : "super_admin";
    const response = NextResponse.json({
      message: "Login successful",
      token,
      user: {
        email: adminRow.email,
        role: userRole,
        name: adminRow.name,
        id: adminRow.id,
      },
    });
    setStaffCookie(response, token);
    // Also set legacy cookie name for /api/admin/* compatibility
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60,
      path: "/",
    });
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
