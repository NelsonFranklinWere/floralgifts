import { NextRequest, NextResponse } from "next/server";
import { initiatePesapalPayment, PesapalPaymentParams } from "@/lib/pesapal";
import { updateOrder } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      amount,
      currency,
      description,
      callbackUrl,
      customerEmail,
      customerPhone,
      customerName,
      billingAddress,
    } = body;

    // Validate required fields
    if (!orderId || !amount || !currency || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: orderId, amount, currency, description",
        },
        { status: 400 }
      );
    }

    // Validate amount
    const amountNum = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be greater than 0",
        },
        { status: 400 }
      );
    }

    // Always use production site URL for callbacks in production so
    // Pesapal never points to localhost and IPN/redirect reach live.
    const baseUrl = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke"
    ).replace(/\/$/, "");
    const defaultCallbackUrl =
      process.env.PESAPAL_CALLBACK_URL || `${baseUrl}/api/pesapal/callback`;

    // Prefer server callback; ignore client localhost overwrites in production
    let resolvedCallback = callbackUrl || defaultCallbackUrl;
    if (
      process.env.NODE_ENV === "production" ||
      (process.env.PESAPAL_ENV || "").toLowerCase() === "production"
    ) {
      if (
        !resolvedCallback ||
        resolvedCallback.includes("localhost") ||
        resolvedCallback.includes("127.0.0.1")
      ) {
        resolvedCallback = defaultCallbackUrl;
      }
    }

    // Prepare billing address
    let billingAddressObj = null;
    if (billingAddress || (customerEmail && customerPhone && customerName)) {
      const [firstName, ...lastNameParts] = (
        billingAddress?.first_name ||
        customerName ||
        ""
      ).split(" ");
      const lastName = lastNameParts.join(" ") || "Customer";

      billingAddressObj = {
        email_address: billingAddress?.email_address || customerEmail || "",
        phone_number: billingAddress?.phone_number || customerPhone || "",
        country_code: billingAddress?.country_code || "KE",
        first_name: firstName,
        middle_name: billingAddress?.middle_name || "",
        last_name: lastName,
        line_1: billingAddress?.line_1 || "To be confirmed",
        line_2: billingAddress?.line_2 || "",
        city: billingAddress?.city || "Nairobi",
        state: billingAddress?.state || "Nairobi",
        postal_code: billingAddress?.postal_code || "",
        zip_code: billingAddress?.zip_code || "",
      };
    }

    // Get IPN ID from environment variables
    const ipnId = process.env.PESAPAL_IPN_ID || "";

    const params: PesapalPaymentParams = {
      id: orderId,
      currency: currency || "KES",
      amount: amountNum,
      description: description || "Floral Whispers Gifts Order",
      callback_url: resolvedCallback,
      notification_id: ipnId,
      billing_address: billingAddressObj || undefined,
    };

    const result = await initiatePesapalPayment(params);

    // Persist tracking ID immediately so we can reconcile if callback never arrives
    if (result?.order_tracking_id) {
      try {
        await updateOrder(orderId, {
          pesapal_order_tracking_id: result.order_tracking_id,
          payment_method: "card",
        } as any);
      } catch (saveErr: any) {
        console.error(
          "Failed to save Pesapal tracking id on order:",
          saveErr?.message || saveErr
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Pesapal payment initiation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Payment initiation failed",
      },
      { status: 500 }
    );
  }
}
