import { NextRequest, NextResponse } from "next/server";
import { processPesapalPaymentConfirmation } from "@/lib/pesapal-confirm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Pesapal IPN callback received:", JSON.stringify(body, null, 2));

    const OrderTrackingId =
      body.OrderTrackingId || body.orderTrackingId || body.order_tracking_id;
    const OrderMerchantReference =
      body.OrderMerchantReference ||
      body.orderMerchantReference ||
      body.merchant_reference ||
      body.MerchantReference;

    if (!OrderTrackingId || !OrderMerchantReference) {
      console.error("Missing required fields in Pesapal callback");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await processPesapalPaymentConfirmation({
      orderId: OrderMerchantReference,
      orderTrackingId: OrderTrackingId,
      sendEmail: true,
    });

    if (result.status === "not_found") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (result.status === "error") {
      return NextResponse.json(
        { error: result.message || "Failed to update order" },
        { status: 500 }
      );
    }

    console.log(`💰 Pesapal IPN result for ${OrderMerchantReference}: ${result.status}`);

    return NextResponse.json({
      status: "success",
      message: "Callback processed successfully",
      orderStatus: result.status,
    });
  } catch (error: any) {
    console.error("Pesapal callback error:", error);
    return NextResponse.json(
      {
        error: "Callback processing failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Browser redirect after Pesapal checkout.
 * Confirms payment status, marks order paid when completed, then redirects to success page.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderTrackingId =
    searchParams.get("OrderTrackingId") ||
    searchParams.get("orderTrackingId") ||
    searchParams.get("pesapal_tracking_id");
  const orderMerchantReference =
    searchParams.get("OrderMerchantReference") ||
    searchParams.get("orderMerchantReference") ||
    searchParams.get("id");

  if (!orderTrackingId || !orderMerchantReference) {
    return NextResponse.json(
      { error: "Invalid redirect parameters" },
      { status: 400 }
    );
  }

  try {
    const result = await processPesapalPaymentConfirmation({
      orderId: orderMerchantReference,
      orderTrackingId,
      sendEmail: true,
    });
    console.log(
      `💰 Pesapal GET redirect confirmation for ${orderMerchantReference}: ${result.status}`
    );
  } catch (err: any) {
    console.error("Pesapal GET redirect processing error:", err?.message || err);
  }

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const redirectUrl = new URL(
    `/order/success?id=${encodeURIComponent(orderMerchantReference)}&pesapal_tracking_id=${encodeURIComponent(orderTrackingId)}`,
    base
  );

  return NextResponse.redirect(redirectUrl);
}
