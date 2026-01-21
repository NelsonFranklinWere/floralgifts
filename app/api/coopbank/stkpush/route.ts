import { NextRequest, NextResponse } from "next/server";
import { initiateCoopBankSTKPush, CoopBankSTKPushParams } from "@/lib/coopbank";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("💳 Co-op Bank STK Push request:", {
      mobileNumber: body.MobileNumber,
      amount: body.Amount,
      messageReference: body.MessageReference,
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

    // Use callback URL from env if not provided
    const callbackUrl = CallBackUrl || process.env.COOP_BANK_CALLBACK_URL || "";

    if (!callbackUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "CallBackUrl not provided and COOP_BANK_CALLBACK_URL not configured",
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

