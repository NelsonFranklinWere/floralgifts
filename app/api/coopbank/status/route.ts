import { NextRequest, NextResponse } from "next/server";
import { checkCoopBankSTKStatus, CoopBankStatusParams } from "@/lib/coopbank";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { MessageReference, UserID } = body;

    if (!MessageReference) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required field: MessageReference",
        },
        { status: 400 }
      );
    }

    const params: CoopBankStatusParams = {
      MessageReference,
      UserID: UserID || process.env.COOP_BANK_USER_ID || "FLORALWHISPERS",
    };

    const result = await checkCoopBankSTKStatus(params);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Co-op Bank Status check error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Status check failed",
      },
      { status: 500 }
    );
  }
}

