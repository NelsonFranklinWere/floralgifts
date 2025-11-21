/**
 * Test script to verify M-Pesa sandbox token generation
 * Run with: node scripts/test-mpesa-token.js
 */

require('dotenv').config({ path: '.env.local' });

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const base = process.env.MPESA_ENV === "production" 
  ? "https://api.safaricom.co.ke" 
  : "https://sandbox.safaricom.co.ke";

console.log("🔐 Testing M-Pesa Token Generation");
console.log("==================================");
console.log(`Environment: ${process.env.MPESA_ENV || 'sandbox'}`);
console.log(`Base URL: ${base}`);
console.log(`Consumer Key: ${consumerKey ? consumerKey.substring(0, 20) + '...' : 'NOT SET'}`);
console.log(`Consumer Secret: ${consumerSecret ? '***' + consumerSecret.substring(consumerSecret.length - 10) : 'NOT SET'}`);
console.log("");

if (!consumerKey || !consumerSecret) {
  console.error("❌ ERROR: Consumer Key or Secret not set in .env.local");
  console.error("Please ensure MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET are set");
  process.exit(1);
}

const creds = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

console.log(`Authorization Header: Basic ${creds.substring(0, 50)}...`);
console.log("");

const authUrl = `${base}/oauth/v1/generate?grant_type=client_credentials`;

console.log(`📡 Requesting token from: ${authUrl}`);
console.log("");

fetch(authUrl, {
  method: "GET",
  headers: {
    Authorization: `Basic ${creds}`,
  },
})
  .then(async (response) => {
    console.log(`Response Status: ${response.status} ${response.statusText}`);
    console.log("");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ERROR: Failed to get token");
      console.error(`Response: ${errorText}`);
      process.exit(1);
    }

    const data = await response.json();
    console.log("✅ SUCCESS! Token generated:");
    console.log(JSON.stringify(data, null, 2));
    console.log("");
    console.log(`Access Token: ${data.access_token}`);
    console.log(`Expires In: ${data.expires_in} seconds (${Math.floor(data.expires_in / 60)} minutes)`);
    console.log("");
    console.log("🎉 Token generation is working correctly!");
  })
  .catch((error) => {
    console.error("❌ ERROR:", error.message);
    console.error("Make sure you have internet connection and credentials are correct");
    process.exit(1);
  });

