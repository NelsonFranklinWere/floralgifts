let cachedToken: { access_token: string; expires_at: number } | null = null;

const PESAPAL_BASE_URL = "https://pay.pesapal.com/v3";

// Pesapal API credentials
export interface PesapalConfig {
  consumer_key: string;
  consumer_secret: string;
  env?: 'sandbox' | 'production';
}

// Get Pesapal access token
export async function getPesapalToken(): Promise<string> {
  if (cachedToken && cachedToken.expires_at > Date.now()) {
    return cachedToken.access_token;
  }

  const consumerKey = process.env.PESAPAL_CONSUMER_KEY || "";
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET || "";
  const env = (process.env.PESAPAL_ENV || "sandbox") as 'sandbox' | 'production';

  if (!consumerKey || !consumerSecret) {
    throw new Error("PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET must be configured");
  }

  // Pesapal uses different endpoints for sandbox and production
  const baseUrl = env === 'production'
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/v3";

  const creds = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  console.log(`Attempting to get Pesapal token from: ${baseUrl}/api/Auth/RequestToken`);
  console.log(`Using credentials: ${consumerKey}:${consumerSecret.substring(0, 4)}...`);

  // Pesapal v3 uses POST with Basic Auth, no body required
  const response = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    // No body needed for Pesapal token request
  });

  console.log(`Pesapal token response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Pesapal token error response:`, errorText);
    throw new Error(`Failed to fetch Pesapal token: HTTP ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(`Pesapal token response:`, data);

  if (!data.token) {
    throw new Error("Invalid token response from Pesapal - no token field");
  }

  // Pesapal tokens typically expire in 5 minutes (300 seconds)
  const expiresAt = Date.now() + (300 - 60) * 1000; // 4 minutes buffer

  cachedToken = {
    access_token: data.token,
    expires_at: expiresAt,
  };

  return data.token;
}

// Pesapal payment request parameters
export interface PesapalPaymentParams {
  id: string; // Unique order ID
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id?: string;
  billing_address?: {
    email_address: string;
    phone_number: string;
    country_code: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    line_1: string;
    line_2?: string;
    city: string;
    state: string;
    postal_code?: string;
    zip_code?: string;
  };
}

// Initiate Pesapal payment
export async function initiatePesapalPayment(params: PesapalPaymentParams): Promise<{
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  status: string;
}> {
  const token = await getPesapalToken();
  const env = (process.env.PESAPAL_ENV || "sandbox") as 'sandbox' | 'production';

  const baseUrl = env === 'production'
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/v3";

  const payload = {
    id: params.id,
    currency: params.currency,
    amount: params.amount,
    description: params.description,
    callback_url: params.callback_url,
    notification_id: params.notification_id || "",
    billing_address: params.billing_address || null,
  };

  const response = await fetch(`${baseUrl}/api/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pesapal payment initiation failed: ${errorText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`Pesapal API error: ${data.error.message || data.error}`);
  }

  return data;
}

// Check Pesapal payment status
export interface PesapalStatusParams {
  order_tracking_id: string;
}

export interface PesapalStatusResponse {
  payment_status_description: string;
  payment_status_code: number;
  amount: number;
  currency: string;
  merchant_reference: string;
  confirmation_code?: string;
  payment_method?: string;
  created_date: string;
  payment_account?: string;
}

export async function checkPesapalPaymentStatus(params: PesapalStatusParams): Promise<PesapalStatusResponse> {
  const token = await getPesapalToken();
  const env = (process.env.PESAPAL_ENV || "sandbox") as 'sandbox' | 'production';

  const baseUrl = env === 'production'
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/v3";

  const response = await fetch(`${baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${params.order_tracking_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pesapal status check failed: ${errorText}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`Pesapal API error: ${data.error.message || data.error}`);
  }

  return data;
}

// Pesapal IPN (Instant Payment Notification) verification
export async function verifyPesapalIPN(notificationData: any): Promise<boolean> {
  // Pesapal sends IPN notifications to verify payment status
  // In production, you should verify the notification signature
  // For now, we'll implement basic verification

  const requiredFields = ['OrderTrackingId', 'OrderMerchantReference', 'Status'];

  for (const field of requiredFields) {
    if (!notificationData[field]) {
      console.error(`Missing required field in Pesapal IPN: ${field}`);
      return false;
    }
  }

  // Validate that OrderTrackingId and OrderMerchantReference are non-empty strings
  if (typeof notificationData.OrderTrackingId !== 'string' || notificationData.OrderTrackingId.trim() === '') {
    console.error('Invalid OrderTrackingId in Pesapal IPN');
    return false;
  }

  if (typeof notificationData.OrderMerchantReference !== 'string' || notificationData.OrderMerchantReference.trim() === '') {
    console.error('Invalid OrderMerchantReference in Pesapal IPN');
    return false;
  }

  // Additional verification can be added here (signature verification, etc.)
  // In production, verify the IPN signature using Pesapal's public key
  return true;
}
