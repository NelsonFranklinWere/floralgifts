import axios from "axios";

export type MpesaCheckoutParams = {
  orderId: string;
  /** Total in cents (site convention) */
  totalCents: number;
  phone: string;
};

export type MpesaCheckoutResult =
  | { ok: true; checkoutRequestId?: string; customerMessage: string }
  | { ok: false; message: string };

/**
 * Safaricom Daraja STK push — customer stays on site; PIN prompt on their phone.
 */
export async function startMpesaStkCheckout(
  params: MpesaCheckoutParams
): Promise<MpesaCheckoutResult> {
  try {
    const response = await axios.post("/api/mpesa/stkpush", {
      phone: params.phone,
      amount: params.totalCents,
      accountRef: params.orderId.replace(/-/g, "").slice(0, 12),
      orderId: params.orderId,
    });

    const data = response.data;

    if (data.ResponseCode === "0") {
      return {
        ok: true,
        checkoutRequestId: data.CheckoutRequestID,
        customerMessage:
          data.CustomerMessage ||
          "Check your phone for the M-Pesa prompt and enter your PIN to complete payment.",
      };
    }

    return {
      ok: false,
      message:
        data.CustomerMessage ||
        data.errorMessage ||
        "Could not send M-Pesa prompt. Try again or pay by card.",
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      ok: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "M-Pesa payment failed. Try again or pay by card.",
    };
  }
}
