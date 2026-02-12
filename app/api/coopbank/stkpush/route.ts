import { NextRequest, NextResponse } from "next/server";
import { initiateCoopBankSTKPush, CoopBankSTKPushParams } from "@/lib/coopbank";
import { getOrderById, updateOrder } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("💳 Co-op Bank STK Push request:", {
      mobileNumber: body.MobileNumber,
      amount: body.Amount,
      messageReference: body.MessageReference,
      orderId: body.OrderId ? `${body.OrderId.slice(0, 8)}...` : undefined,
      timestamp: new Date().toISOString()
    });
    
    const {
      MessageReference,
      CallBackUrl,
      OperatorCode,
      TransactionCurrency,
      MobileNumber,
      Narration,
      Amount,
      MessageDateTime,
      OtherDetails,
      OrderId,
    } = body;

    // Validate required fields
    if (!MobileNumber || Amount === undefined || Amount === null) {
      console.error("❌ STK Push validation failed:", { MobileNumber: !!MobileNumber, Amount });
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: MobileNumber, Amount",
        },
        { status: 400 }
      );
    }

    // Validate Amount: must be > 0 and positive integer
    // Amount is expected in cents from frontend, convert to KES for Co-op Bank API (divide by 100)
    const amountNum = typeof Amount === 'string' ? parseFloat(Amount) : Amount;
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be greater than 0",
        },
        { status: 400 }
      );
    }
    
    // Convert cents to KES (Co-op Bank API expects amount in KES, not cents)
    // e.g., 350000 cents = 3500 KES
    const amountInKES = Math.floor(amountNum / 100);
    
    if (amountInKES <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount is too small (must be at least 1 KES)",
        },
        { status: 400 }
      );
    }

    // Use M-Pesa callback URL (Co-op Bank STK push processes M-Pesa payments)
    const callbackUrl = CallBackUrl || process.env.MPESA_CALLBACK_URL || "";

    if (!callbackUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "CallBackUrl not provided and MPESA_CALLBACK_URL not configured",
        },
        { status: 400 }
      );
    }

    // Format phone number
    const phone = MobileNumber.replace(/\D/g, "");
    const phoneFormatted = phone.startsWith("254") ? phone : `254${phone.substring(1)}`;

    // Generate MessageReference if not provided
    // Shortened format: FL-{timestamp8} = 11 chars (Co-op Bank limit ~20)
    const messageRef = MessageReference || `FL-${Date.now().toString().slice(-8)}`;

    // Use current datetime if not provided
    const messageDateTime = MessageDateTime || new Date().toISOString();

    const params: CoopBankSTKPushParams = {
      MessageReference: messageRef,
      CallBackUrl: callbackUrl,
      OperatorCode: OperatorCode || process.env.COOP_BANK_OPERATOR_CODE || "FLORAL",
      TransactionCurrency: TransactionCurrency || "KES",
      MobileNumber: phoneFormatted,
      Narration: Narration || "Floral Whispers Gifts",
      Amount: amountInKES, // Amount in KES (converted from cents)
      MessageDateTime: messageDateTime,
      OtherDetails: OtherDetails || [],
    };

    const result = await initiateCoopBankSTKPush(params);

    console.log("✅ Co-op Bank STK Push successful:", {
      messageReference: params.MessageReference,
      responseCode: result.ResponseCode,
      responseDescription: result.ResponseDescription,
      requestId: result.RequestID
    });

    // Store MessageReference on order so M-Pesa callback can find order and record payment
    if (OrderId && (result.ResponseCode === "00" || !result.ResponseCode)) {
      try {
        const order = await getOrderById(OrderId);
        if (order) {
          await updateOrder(OrderId, {
            mpesa_checkout_request_id: params.MessageReference,
            status: "pending",
          } as any);
          console.log("✅ Order updated with MessageReference for callback:", OrderId.slice(0, 8));
        }
      } catch (updateErr) {
        console.error("Failed to update order with MessageReference:", updateErr);
        // Don't fail the request; callback can still find order by FL- prefix
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("❌ Co-op Bank STK Push error:", {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json(
      {
        success: false,
        message: error.message || "STK Push failed",
      },
      { status: 500 }
    );
  }
}

