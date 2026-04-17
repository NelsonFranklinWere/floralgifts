# Google API Setup Guide for Live Reviews

## **YES - You Need Both Keys!**

The GoogleReviews component I built requires **both** credentials to work:

```javascript
// config.js - CURRENT STATE (not working)
const config = {
  GOOGLE_API_KEY: "PASTE_API_KEY_HERE",     // <- NEEDS REAL KEY
  GOOGLE_PLACE_ID: "PASTE_PLACE_ID_HERE"   // <- NEEDS REAL PLACE ID
};
```

## **How to Get Google API Key**

### **Step 1: Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Go to "APIs & Services" > "Library"
4. Search and enable: **"Places API"**
5. Go to "APIs & Services" > "Credentials"
6. Click "Create Credentials" > "API Key"
7. Copy the API key

### **Step 2: Set Up Billing**
- Google Places API requires billing (but has generous free tier)
- Add payment method to Google Cloud account
- **Cost**: Usually $0-20/month for small websites

## **How to Get Place ID**

### **Method 1: Google Search**
1. Search Google: "Floral Whispers Gifts Nairobi"
2. Click on the business listing
3. Look at URL: `https://www.google.com/maps/place/Floral+Whispers+Gifts/@.../data=!4m2!3m1!1sChIJd7y6y4vLhRsR4l4gk2m8cQI`
4. The Place ID is: `ChIJd7y6y4vLhRsR4l4gk2m8cQI`

### **Method 2: Google Maps**
1. Open [Google Maps](https://maps.google.com)
2. Search: "Floral Whispers Gifts Nairobi"
3. Click on business name
4. Click "Share" > "Copy link"
5. Extract Place ID from URL

## **Update Your Config File**

```javascript
// config.js - WORKING STATE
const config = {
  GOOGLE_API_KEY: "AIzaSyC_YourActualAPIKeyHere1234567890",
  GOOGLE_PLACE_ID: "ChIJd7y6y4vLhRsR4l4gk2m8cQI"
};

export default config;
```

## **Test the API**

You can test the API directly in your browser:

```
https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJd7y6y4vLhRsR4l4gk2m8cQI&fields=reviews&key=YOUR_API_KEY_HERE
```

## **What Happens Without Keys**

### **Current Behavior:**
- GoogleReviews component shows "Reviews Coming Soon"
- No error messages (graceful fallback)
- Site continues working normally

### **With Keys:**
- GoogleReviews component shows live Google reviews
- Real-time updates from Google
- Authentic customer reviews displayed

## **Security Notes**

### **API Key Protection:**
- The API key is client-side (visible to users)
- **Restrict the key** in Google Cloud Console:
  - HTTP referrers: `floralwhispersgifts.co.ke/*`
  - IP restrictions (if needed)
  - API restrictions: Only Places API

### **Alternative: Server-Side API**
For better security, you could:
1. Move API calls to server-side Next.js API routes
2. Hide API key from client-side
3. Proxy requests through your server

## **Quick Setup Checklist**

- [ ] **Google Cloud Project** created
- [ ] **Places API** enabled
- [ ] **Billing** set up (if needed)
- [ ] **API Key** generated and copied
- [ ] **Place ID** found for Floral Whispers Gifts
- [ ] **config.js** updated with real values
- [ ] **API restrictions** set on the key
- [ ] **Test** the GoogleReviews component

## **Expected Results**

Once you add the real keys:

```javascript
// This will show live reviews instead of "Reviews Coming Soon"
<GoogleReviews /> 
```

The component will:
- Fetch real Google reviews
- Display star ratings
- Show reviewer names and photos
- Update automatically when new reviews are posted

## **Troubleshooting**

### **If reviews don't appear:**
1. Check browser console for API errors
2. Verify API key has Places API enabled
3. Confirm Place ID is correct
4. Check billing status in Google Cloud

### **Common API Errors:**
- `REQUEST_DENIED`: API key invalid or restricted
- `NOT_FOUND`: Place ID incorrect
- `ZERO_RESULTS`: No reviews found for this place

---

**Bottom Line:** Yes, you need both the Google API key and Place ID for the GoogleReviews component to work. Without them, it shows the fallback "Reviews Coming Soon" message.
