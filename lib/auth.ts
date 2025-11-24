import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AdminTokenPayload {
  email: string;
  role: string;
  id?: string;
}

export function verifyAdminToken(request: NextRequest): AdminTokenPayload | null {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || request.cookies.get("admin_token")?.value;

    if (!token) {
      console.log("[Auth] No token found in request");
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    console.log("[Auth] Token verified successfully for:", decoded.email);
    return decoded;
  } catch (error: any) {
    console.error("[Auth] Token verification failed:", error.message);
    return null;
  }
}

export function requireAdmin(request: NextRequest): AdminTokenPayload {
  const payload = verifyAdminToken(request);

  if (!payload) {
    throw new Error("Unauthorized");
  }

  return payload;
}

