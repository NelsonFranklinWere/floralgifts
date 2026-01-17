import { NextRequest, NextResponse } from "next/server";
import { checkPesapalPaymentStatus } from "@/lib/pesapal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderTrackingId } = body;

    if (!orderTrackingId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required field: orderTrackingId",
        },
        { status: 400 }
      );
    }

    const status = await checkPesapalPaymentStatus({ order_tracking_id: orderTrackingId });

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
