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
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    return decoded;
  } catch (error) {
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

