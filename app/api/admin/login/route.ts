import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

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

    // Simple auth check - in production, use Supabase Auth or proper password hashing
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });

      return NextResponse.json({
        message: "Login successful",
        token,
      });
    }

    // Alternative: Check against admins table in Supabase
    try {
      const { data: admin, error } = await supabaseAdmin
        .from("admins")
        .select("*")
        .eq("email", email)
        .single();

      if (!error && admin) {
        // In production, use bcrypt to compare hashed passwords
        // For now, simple check (NOT SECURE FOR PRODUCTION)
        if (admin.password_hash === password || password === ADMIN_PASSWORD) {
          const token = jwt.sign({ email: admin.email, role: admin.role || "admin", id: admin.id }, JWT_SECRET, { expiresIn: "7d" });

          return NextResponse.json({
            message: "Login successful",
            token,
          });
        }
      }
    } catch (dbError) {
      console.error("Database auth error:", dbError);
    }

    // Allow specific email/password combination for quick access
    // This is for development/testing purposes
    if (email === "solutionsnelson@gmail.com" && password === "frank516#N") {
      const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
      return NextResponse.json({
        message: "Login successful",
        token,
      });
    }

    // Allow whispersfloral@gmail.com with Admin@2025
    if (email === "whispersfloral@gmail.com" && password === "Admin@2025") {
      const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
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

