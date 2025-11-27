import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

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

    // RESTRICTED ACCESS: Only whispersfloral@gmail.com is allowed
    const ALLOWED_EMAIL = "whispersfloral@gmail.com";
    const ALLOWED_PASSWORD = "Admin@2025";

    // Normalize email (trim and lowercase)
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedAllowedEmail = ALLOWED_EMAIL.toLowerCase();

    console.log(`[Login] Normalized: "${normalizedEmail}" vs "${normalizedAllowedEmail}"`);

    // Check if email is the allowed email
    if (normalizedEmail !== normalizedAllowedEmail) {
      console.log(`[Login] Email mismatch: "${normalizedEmail}" !== "${normalizedAllowedEmail}"`);
      return NextResponse.json(
        { message: "Access denied. Only authorized administrators can access this dashboard." },
        { status: 403 }
      );
    }

    console.log(`[Login] Email matches, checking password...`);

    // Check against admins table in Supabase first
    try {
      const { data: admin, error } = await (supabaseAdmin
        .from("admins") as any)
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

          console.log(`[Login] Success for ${admin.email}`);
          return NextResponse.json({
            message: "Login successful",
            token,
          });
        } else {
          console.log(`[Login] Password mismatch for ${admin.email}`);
        }
      } else {
        console.log(`[Login] Admin not found in database:`, error);
      }
    } catch (dbError) {
      console.error("Database auth error:", dbError);
    }

    // Fallback: Direct check for whispersfloral@gmail.com with Admin@2025
    if (normalizedEmail === normalizedAllowedEmail && password === ALLOWED_PASSWORD) {
      const token = jwt.sign({ 
        email: ALLOWED_EMAIL, 
        role: "admin" 
      }, JWT_SECRET, { expiresIn: "7d" });
      
      console.log(`[Login] Fallback success for ${ALLOWED_EMAIL}`);
      return NextResponse.json({
        message: "Login successful",
        token,
      });
    }

    console.log(`[Login] Final check failed for email: ${normalizedEmail}`);

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

