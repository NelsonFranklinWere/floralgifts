import { NextResponse } from "next/server";
import { getCoopBankToken } from "@/lib/coopbank";

export async function POST() {
  try {
    const token = await getCoopBankToken();
    return NextResponse.json({
      success: true,
      access_token: token,
      message: "Token retrieved successfully",
    });
  } catch (error: any) {
    console.error("Co-op Bank Token error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get token",
      },
      { status: 500 }
    );
  }
}

