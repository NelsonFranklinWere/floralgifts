import { NextRequest, NextResponse } from "next/server";
import { getOrders, updateOrder } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const resultCode = body.Body?.stkCallback?.ResultCode;
    const resultDesc = body.Body?.stkCallback?.ResultDesc;
    const checkoutRequestID = body.Body?.stkCallback?.CheckoutRequestID;
    const callbackMetadata = body.Body?.stkCallback?.CallbackMetadata;

    if (!checkoutRequestID) {
      console.error("No CheckoutRequestID in callback:", body);
      return NextResponse.json({ message: "No CheckoutRequestID" }, { status: 400 });
    }

    const orders = await getOrders({});
    const order = orders.find((o) => o.mpesa_checkout_request_id === checkoutRequestID);

    if (!order) {
      console.error("Order not found for CheckoutRequestID:", checkoutRequestID);
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (resultCode === "0") {
      const receiptNumber =
        callbackMetadata?.Item?.find((item: any) => item.Name === "MpesaReceiptNumber")
          ?.Value || null;

      await updateOrder(order.id, {
        status: "paid",
        mpesa_result_code: resultCode,
        mpesa_receipt_number: receiptNumber,
      } as any);
    } else {
      await updateOrder(order.id, {
        status: "failed",
        mpesa_result_code: resultCode,
      } as any);
    }

    return NextResponse.json({ message: "Received" });
  } catch (error: any) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { message: error.message || "Callback processing failed" },
      { status: 500 }
    );
  }
}

