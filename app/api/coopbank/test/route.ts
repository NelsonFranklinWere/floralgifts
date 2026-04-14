import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Co-op Bank Test Request:", body);

    // Mock successful response for testing
    const mockResponse = {
      success: true,
      data: {
        MessageReference: body.MessageReference || `FL-TEST-${Date.now().toString().slice(-8)}`,
        ResponseCode: "00",
        ResponseDescription: "Success - Test Mode",
        RequestID: `REQ-${Date.now()}`,
        TransactionStatus: "Success"
      }
    };

    // If this is a callback test, simulate callback processing
    if (body.testCallback && body.MessageReference) {
      console.log("Simulating callback processing for:", body.MessageReference);
      // In real scenario, this would trigger the callback handler
    }

    return NextResponse.json(mockResponse);
  } catch (error: any) {
    console.error("Co-op Bank Test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Test failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Co-op Bank Test Endpoint",
    status: "Ready for testing",
    endpoints: {
      stkpush: "/api/coopbank/stkpush",
      callback: "/api/coopbank/callback", 
      status: "/api/coopbank/status",
      test: "/api/coopbank/test"
    },
    note: "Use POST to test STK push flow with mock data"
  });
}
