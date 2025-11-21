import { NextRequest, NextResponse } from "next/server";

// Analytics endpoint - stores user data
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Log analytics data (in production, store in database or analytics service)
    console.log("[Analytics]", JSON.stringify(data, null, 2));

    // You can store this in Supabase, send to Google Analytics, etc.
    // For now, just acknowledge receipt
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Silently fail - analytics should not break the app
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

