let cachedToken: { access_token: string; expires_at: number } | null = null;

const COOP_BANK_BASE_URL = "https://openapi.co-opbank.co.ke";

export interface CoopBankTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function getCoopBankToken(): Promise<string> {
  if (cachedToken && cachedToken.expires_at > Date.now()) {
    return cachedToken.access_token;
  }

  const consumerKey = process.env.COOP_BANK_CONSUMER_KEY || "";
  const consumerSecret = process.env.COOP_BANK_CONSUMER_SECRET || "";

  if (!consumerKey || !consumerSecret) {
    throw new Error("COOP_BANK_CONSUMER_KEY and COOP_BANK_CONSUMER_SECRET must be configured");
  }

  const creds = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

  const response = await fetch(`${COOP_BANK_BASE_URL}/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "FloralWhispersGifts/1.0",
      "Accept": "application/json",
      "Origin": baseUrl,
      "Referer": `${baseUrl}/`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Co-op Bank token: ${errorText}`);
  }

  const data: CoopBankTokenResponse = await response.json();
  const expiresAt = Date.now() + (data.expires_in - 60) * 1000; // 60s buffer

  cachedToken = {
    access_token: data.access_token,
    expires_at: expiresAt,
  };

  return data.access_token;
}

export interface CoopBankSTKPushParams {
  MessageReference: string;
  CallBackUrl: string;
  OperatorCode: string;
  TransactionCurrency: string;
  MobileNumber: string;
  Narration: string;
  Amount: number;
  MessageDateTime: string;
  OtherDetails?: Array<{ Name: string; Value: string }>;
}

export interface CoopBankSTKPushResponse {
  MessageReference?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
  RequestID?: string;
  [key: string]: any;
}

export async function initiateCoopBankSTKPush(
  params: CoopBankSTKPushParams
): Promise<CoopBankSTKPushResponse> {
  const token = await getCoopBankToken();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

  const response = await fetch(`${COOP_BANK_BASE_URL}/FT/stk/1.0.0`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "FloralWhispersGifts/1.0",
      "Accept": "application/json",
      "Origin": baseUrl,
      "Referer": `${baseUrl}/`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Co-op Bank STK Push failed: ${errorText}`);
  }

  return await response.json();
}

export interface CoopBankStatusParams {
  MessageReference: string;
  UserID: string;
}

export interface CoopBankStatusResponse {
  MessageReference?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
  TransactionStatus?: string;
  [key: string]: any;
}

export async function checkCoopBankSTKStatus(
  params: CoopBankStatusParams
): Promise<CoopBankStatusResponse> {
  const token = await getCoopBankToken();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

  const response = await fetch(`${COOP_BANK_BASE_URL}/Enquiry/STK/1.0.0/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "FloralWhispersGifts/1.0",
      "Accept": "application/json",
      "Origin": baseUrl,
      "Referer": `${baseUrl}/`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Co-op Bank Status check failed: ${errorText}`);
  }

  return await response.json();
}

