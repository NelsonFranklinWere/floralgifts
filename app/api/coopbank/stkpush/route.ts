import { NextRequest, NextResponse } from "next/server";
import { initiateCoopBankSTKPush, CoopBankSTKPushParams } from "@/lib/coopbank";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    if (!MobileNumber || !Amount) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: MobileNumber, Amount",
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
      Narration: Narration || "Floral Whispers Gifts Purchase",
      Amount: Math.floor(Amount),
      MessageDateTime: messageDateTime,
      OtherDetails: OtherDetails || [],
    };

    const result = await initiateCoopBankSTKPush(params);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Co-op Bank STK Push error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "STK Push failed",
      },
      { status: 500 }
    );
  }
}

