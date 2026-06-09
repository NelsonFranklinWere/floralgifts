import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log(`[Login] Attempt: email="${email}", password length=${password?.length || 0}`);

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("[Login] Missing JWT_SECRET, ADMIN_EMAIL, or ADMIN_PASSWORD in env");
      return NextResponse.json(
        { message: "Server authentication is not configured" },
        { status: 503 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== ADMIN_EMAIL) {
      return NextResponse.json(
        { message: "Access denied. Only authorized administrators can access this dashboard." },
        { status: 403 }
      );
    }

    // Check against admins table in Supabase first, then env password
    try {
      const { data: admin, error } = await (supabaseAdmin
        .from("admins") as any)
        .select("*")
        .eq("email", ADMIN_EMAIL)
        .single();

      if (!error && admin) {
        if (admin.password_hash === password || password === ADMIN_PASSWORD) {
          const token = jwt.sign(
            {
              email: admin.email,
              role: admin.role || "admin",
              id: admin.id,
            },
            JWT_SECRET,
            { expiresIn: "7d" }
          );

          return NextResponse.json({
            message: "Login successful",
            token,
          });
        }
      }
    } catch (dbError) {
      console.error("Database auth error:", dbError);
    }

    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email: ADMIN_EMAIL, role: "admin" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return NextResponse.json({
        message: "Login successful",
        token,
      });
    }

    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: error.message || "Login failed" },
      { status: 500 }
    );
  }
}

