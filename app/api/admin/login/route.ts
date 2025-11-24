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

    // RESTRICTED ACCESS: Only whispersfloral@gmail.com is allowed
    const ALLOWED_EMAIL = "whispersfloral@gmail.com";
    const ALLOWED_PASSWORD = "Admin@2025";

    // Check if email is the allowed email
    if (email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { message: "Access denied. Only authorized administrators can access this dashboard." },
        { status: 403 }
      );
    }

    // Check against admins table in Supabase first
    try {
      const { data: admin, error } = await supabaseAdmin
        .from("admins")
        .select("*")
        .eq("email", ALLOWED_EMAIL)
        .single();

      if (!error && admin) {
        // Check password from database or fallback to allowed password
        if (admin.password_hash === password || password === ALLOWED_PASSWORD) {
          const token = jwt.sign({ 
            email: admin.email, 
            role: admin.role || "admin", 
            id: admin.id 
          }, JWT_SECRET, { expiresIn: "7d" });

          return NextResponse.json({
            message: "Login successful",
            token,
          });
        }
      }
    } catch (dbError) {
      console.error("Database auth error:", dbError);
    }

    // Fallback: Direct check for whispersfloral@gmail.com with Admin@2025
    if (email.toLowerCase() === ALLOWED_EMAIL.toLowerCase() && password === ALLOWED_PASSWORD) {
      const token = jwt.sign({ 
        email: ALLOWED_EMAIL, 
        role: "admin" 
      }, JWT_SECRET, { expiresIn: "7d" });
      
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

