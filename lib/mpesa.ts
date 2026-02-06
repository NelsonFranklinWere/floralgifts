let cachedToken: { access_token: string; expires_at: number } | null = null;

export async function getMpesaToken(): Promise<string> {
  if (cachedToken && cachedToken.expires_at > Date.now()) {
    return cachedToken.access_token;
  }

  const base =
    process.env.MPESA_ENV === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

  const consumerKey = process.env.MPESA_CONSUMER_KEY || "";
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || "";

  const creds = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${creds}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch MPESA token");
  }

  const data = await response.json();
  const expiresAt = Date.now() + (data.expires_in - 60) * 1000; // 60s buffer

  cachedToken = {
    access_token: data.access_token,
    expires_at: expiresAt,
  };

  return data.access_token;
}

export function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function generatePassword(timestamp: string): string {
  const shortcode = process.env.MPESA_SHORTCODE || "";
  const passkey = process.env.MPESA_PASSKEY || "";
  const passwordString = `${shortcode}${passkey}${timestamp}`;
  return Buffer.from(passwordString).toString("base64");
}

export interface STKPushParams {
  phone: string;
  amount: number;
  accountRef: string;
  callbackUrl: string;
}

export async function initiateSTKPush(params: STKPushParams): Promise<{
  ResponseCode: string;
  CustomerMessage: string;
  CheckoutRequestID?: string;
  MerchantRequestID?: string;
}> {
  const shortcode = process.env.MPESA_SHORTCODE || "";
  const passkey = process.env.MPESA_PASSKEY || "";
  
  if (!shortcode) {
    throw new Error("MPESA_SHORTCODE is not configured. Please set it in your environment variables.");
  }
  
  if (!passkey) {
    throw new Error("MPESA_PASSKEY is not configured. Please get your Passkey from the Safaricom Developer Portal and set it in your environment variables.");
  }

  const token = await getMpesaToken();
  const timestamp = generateTimestamp();
  const password = generatePassword(timestamp);

  const base =
    process.env.MPESA_ENV === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

  const phone = params.phone.replace(/\D/g, "");
  const phoneFormatted = phone.startsWith("254") ? phone : `254${phone.substring(1)}`;

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.floor(params.amount),
    PartyA: phoneFormatted,
    PartyB: shortcode,
    PhoneNumber: phoneFormatted,
    CallBackURL: params.callbackUrl,
    AccountReference: params.accountRef,
    TransactionDesc: "FloralWhispers purchase",
  };

  const response = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`STK Push failed: ${errorText}`);
  }

  return await response.json();
}

