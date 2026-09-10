import { NextRequest, NextResponse } from "next/server";
import { checkPesapalPaymentStatus } from "@/lib/pesapal";
import { processPesapalPaymentConfirmation } from "@/lib/pesapal-confirm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderTrackingId =
      body.orderTrackingId || body.OrderTrackingId || body.order_tracking_id;
    const orderId =
      body.orderId || body.OrderMerchantReference || body.merchant_reference;

    if (!orderTrackingId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required field: orderTrackingId",
        },
        { status: 400 }
      );
    }

    // If order id is provided, verify with Pesapal and mark order paid/failed
    if (orderId) {
      const result = await processPesapalPaymentConfirmation({
        orderId,
        orderTrackingId,
        sendEmail: true,
      });

      return NextResponse.json({
        success: true,
        orderStatus: result.status,
        data: { orderId, orderTrackingId, confirmation: result },
      });
    }

    const status = await checkPesapalPaymentStatus({
      order_tracking_id: orderTrackingId,
    });

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    console.error("Pesapal status check error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Status check failed",
      },
      { status: 500 }
    );
  }
}
