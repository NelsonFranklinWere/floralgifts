import { NextResponse } from "next/server";
import { clearStaffCookie } from "@/lib/staff-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  clearStaffCookie(response);
  return response;
}
