import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { initiatePesapalPayment, PesapalPaymentParams } from "@/lib/pesapal";
import { initiateCoopBankSTKPush, CoopBankSTKPushParams } from "@/lib/coopbank";
import { initiateSTKPush } from "@/lib/mpesa";
import { v4 as uuidv4 } from "uuid";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      amount,
      paymentMethod,
      description,
      orderNotes
    } = body;

    console.log(`🔗 Admin Payment Link: Creating payment link for ${customerName} - ${paymentMethod} - ${amount}`);

    // Validate required fields
    if (!customerName || !amount || !paymentMethod) {
      return NextResponse.json(
        { message: "Missing required fields: customerName, amount, paymentMethod" },
        { status: 400 }
      );
    }

    // Validate amount
    const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Generate unique order ID for payment link
    const orderId = `admin-${uuidv4()}`;
    
    let paymentLink = null;
    let paymentDetails = null;

    switch (paymentMethod) {
      case "pesapal":
        // Create Pesapal payment link
        const pesapalParams: PesapalPaymentParams = {
          id: orderId,
          currency: "KES",
          amount: amountNum,
          description: description || `Payment for ${customerName} - ${orderNotes || 'Manual order'}`,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke"}/api/pesapal/callback`,
          notification_id: process.env.PESAPAL_IPN_ID || "",
          billing_address: {
            email_address: customerEmail || "",
            phone_number: customerPhone || "",
            country_code: "KE",
            first_name: customerName.split(" ")[0] || "Customer",
            middle_name: "",
            last_name: customerName.split(" ").slice(1).join(" ") || "Customer",
            line_1: "Admin order",
            line_2: "",
            city: "Nairobi",
            state: "Nairobi",
            postal_code: "",
            zip_code: "",
          },
        };

        paymentDetails = await initiatePesapalPayment(pesapalParams);
        paymentLink = paymentDetails.redirect_url;
        break;

      case "mpesa":
      case "coopbank":
        // Create STK Push payment link (Co-op Bank)
        if (!customerPhone) {
          return NextResponse.json(
            { message: "Phone number is required for M-Pesa payments" },
            { status: 400 }
          );
        }

        // Format phone number
        const phone = customerPhone.replace(/\D/g, "");
        const phoneFormatted = phone.startsWith("254") ? phone : `254${phone.substring(1)}`;

        const stkParams: CoopBankSTKPushParams = {
          MessageReference: `AD-${Date.now().toString().slice(-8)}`,
          CallBackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke"}/api/mpesa/callback`,
          OperatorCode: process.env.COOP_BANK_OPERATOR_CODE || "FLORAL",
          TransactionCurrency: "KES",
          MobileNumber: phoneFormatted,
          Narration: description || `Payment for ${customerName}`,
          Amount: Math.floor(amountNum), // STK expects amount in KES
          MessageDateTime: new Date().toISOString(),
          OtherDetails: [],
        };

        paymentDetails = await initiateCoopBankSTKPush(stkParams);
        paymentLink = `stkpush:${paymentDetails.RequestID || stkParams.MessageReference}`;
        break;

      default:
        return NextResponse.json(
          { message: "Invalid payment method. Use 'pesapal' for cards or 'mpesa'/'coopbank' for M-Pesa" },
          { status: 400 }
        );
    }

    console.log(`✅ Admin Payment Link: Created payment link:`, {
      orderId,
      paymentMethod,
      customerName,
      amount: amountNum,
      paymentLink: paymentLink?.substring(0, 50) + "..."
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        paymentMethod,
        customerName,
        customerPhone,
        customerEmail,
        amount: amountNum,
        description,
        paymentLink,
        paymentDetails,
        createdAt: new Date().toISOString(),
        instructions: getPaymentInstructions(paymentMethod, paymentLink, customerPhone)
      }
    });

  } catch (error: any) {
    console.error(`❌ Admin Payment Link Error:`, error);
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to create payment link" },
      { status: 500 }
    );
  }
}

function getPaymentInstructions(paymentMethod: string, paymentLink: string, customerPhone?: string): string {
  switch (paymentMethod) {
    case "pesapal":
      return `Share this payment link with the customer: ${paymentLink}. They can pay via card, mobile money, or bank transfer on the Pesapal payment page.`;
    
    case "mpesa":
    case "coopbank":
      return `M-Pesa STK Push has been initiated to ${customerPhone}. The customer will receive a prompt to enter their M-Pesa PIN to complete the payment.`;
    
    default:
      return "Payment instructions will be provided based on the selected payment method.";
  }
}

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    
    // Return available payment methods and their capabilities
    return NextResponse.json({
      paymentMethods: [
        {
          id: "pesapal",
          name: "Card/Mobile Money/Bank Transfer",
          description: "Customer can pay via card, mobile money, or bank transfer through Pesapal",
          requiresPhone: false,
          requiresEmail: false
        },
        {
          id: "mpesa",
          name: "M-Pesa STK Push",
          description: "Direct M-Pesa payment via STK push to customer's phone",
          requiresPhone: true,
          requiresEmail: false
        },
        {
          id: "coopbank",
          name: "M-Pesa via Co-op Bank",
          description: "M-Pesa payment through Co-op Bank integration",
          requiresPhone: true,
          requiresEmail: false
        }
      ]
    });
  } catch (error: any) {
    console.error(`❌ Admin Payment Methods Error:`, error);
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}
