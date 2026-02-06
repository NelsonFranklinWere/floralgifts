import { NextRequest, NextResponse } from "next/server";
import { initiateSTKPush } from "@/lib/mpesa";
import { updateOrder } from "@/lib/db";

// Simple rate limiting: track requests per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { phone, amount, accountRef, orderId } = body;

    if (!phone || !amount || !accountRef) {
      return NextResponse.json(
        { message: "Missing required fields: phone, amount, accountRef" },
        { status: 400 }
      );
    }

    const callbackUrl = process.env.MPESA_CALLBACK_URL || "";
    if (!callbackUrl) {
      return NextResponse.json(
        { message: "MPESA_CALLBACK_URL not configured" },
        { status: 500 }
      );
    }

    const result = await initiateSTKPush({
      phone,
      amount,
      accountRef,
      callbackUrl,
    });

    if (result.ResponseCode === "0" && orderId && result.CheckoutRequestID) {
      await updateOrder(orderId, {
        mpesa_checkout_request_id: result.CheckoutRequestID,
        status: "pending",
      } as any);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("STK Push error:", error);
    return NextResponse.json(
      { message: error.message || "STK Push failed" },
      { status: 500 }
    );
  }
}
