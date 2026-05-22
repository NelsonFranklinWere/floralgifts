import axios from "axios";

export type PesapalCheckoutParams = {
  orderId: string;
  /** Total in cents (site convention) */
  totalCents: number;
  customerName: string;
  phone: string;
  email?: string | null;
  address?: string;
  apartment?: string;
  city?: string;
  postalCode?: string;
  description?: string;
  paymentNote?: string;
};

export type PesapalCheckoutResult =
  | { ok: true; redirectUrl: string; orderTrackingId?: string }
  | { ok: false; message: string };

/**
 * Create a Pesapal order and return the hosted payment URL (M-Pesa, card, etc.).
 */
export async function startPesapalCheckout(
  params: PesapalCheckoutParams
): Promise<PesapalCheckoutResult> {
  const callbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/pesapal/callback`
      : "https://www.floralwhispersgifts.co.ke/api/pesapal/callback";

  const [firstName, ...lastNameParts] = params.customerName.trim().split(/\s+/);
  const lastName = lastNameParts.join(" ") || "Customer";

  const billingAddress = {
    email_address: params.email || "",
    phone_number: params.phone,
    country_code: "KE",
    first_name: firstName || "Customer",
    middle_name: "",
    last_name: lastName,
    line_1: params.address || "To be confirmed",
    line_2: params.apartment || "",
    city: params.city || "Nairobi",
    state: params.city || "Nairobi",
    postal_code: params.postalCode || "",
    zip_code: params.postalCode || "",
  };

  const response = await axios.post("/api/pesapal/payment", {
    orderId: params.orderId,
    amount: params.totalCents / 100,
    currency: "KES",
    description:
      params.description ||
      `Floral Whispers Gifts Order #${params.orderId.slice(0, 8)}`,
    callbackUrl,
    customerEmail: params.email || null,
    customerPhone: params.phone,
    customerName: params.customerName,
    billingAddress,
  });

  if (response.data?.success && response.data?.data?.redirect_url) {
    return {
      ok: true,
      redirectUrl: response.data.data.redirect_url,
      orderTrackingId: response.data.data.order_tracking_id,
    };
  }

  return {
    ok: false,
    message:
      response.data?.message ||
      "Failed to start payment. Please try again or contact us on WhatsApp.",
  };
}
