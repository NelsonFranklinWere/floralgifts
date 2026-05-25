import { NextRequest, NextResponse } from "next/server";
import {
  authenticateStaff,
  setStaffCookie,
  getClientIp,
  logStaffLogin,
  logStaffAction,
} from "@/lib/staff-auth";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    const result = await authenticateStaff(email, password);

    if (!result) {
      await logStaffLogin({ email, ip, success: false });
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const adminRow = result.admin as Record<string, unknown>;
    const role = adminRow.role === "staff" ? "staff" : "super_admin";

    // Legacy admin UI tokens last 7 days; staff portal uses 30m via /api/staff/login
    const token = jwt.sign(
      {
        email: adminRow.email,
        role,
        id: adminRow.id,
        name: adminRow.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    await logStaffLogin({
      email: adminRow.email as string,
      ip,
      success: true,
    });
    await logStaffAction({
      staffEmail: adminRow.email as string,
      staffId: adminRow.id as string | undefined,
      action: "login",
      ipAddress: ip,
    });

    const response = NextResponse.json({
      message: "Login successful",
      token,
    });
    setStaffCookie(response, result.token);
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
