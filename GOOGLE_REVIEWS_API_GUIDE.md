# Google Reviews API Integration Guide

## **CRITICAL UNDERSTANDING: Business Ownership Requirements**

### **The Problem You're Facing**
You're correct - you **CANNOT** access Google Reviews API without proper authorization. Here's why:

1. **Business Profile Ownership Required**: Only verified business owners or authorized representatives can access the Google My Business API
2. **No Direct API Access**: Google doesn't provide a public API for anyone to fetch reviews from any business
3. **Strict Permission Model**: APIs are designed for business owners to manage THEIR OWN listings

---

## **What You Need to Proceed**

### **Option 1: Get Business Owner Authorization**
The business owner must:
1. **Grant You Access**: Add you as a "Manager" in their Google Business Profile
2. **OAuth Consent**: They must sign in once and consent to your app accessing their data
3. **Verify Your Project**: Your Google Cloud project must be approved for Business Profile APIs

### **Option 2: Alternative Solutions**
Since you're not the owner, consider these alternatives:
- **Manual Review Updates**: Business owner manually exports reviews periodically
- **Third-Party Review Services**: Use services like Trustpilot, Yelp API
- **Web Scraping (Not Recommended)**: Against Google's terms of service
- **Static Reviews**: Continue using your current Supabase-based review system

---

## **If You Get Authorization - Complete Setup**

### **Step 1: Google Cloud Console Setup**

#### **APIs to Enable:**
```
1. Google My Business API
2. My Business Account Management API  
3. My Business Business Information API
4. My Business Q&A API
```

#### **How to Enable:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create new one)
3. Go to "APIs & Services" > "Library"
4. Search and enable each API above
5. Request access for Business Profile APIs (requires approval)

### **Step 2: OAuth 2.0 Credentials**

#### **Create Credentials:**
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Select "Web application"
4. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```

#### **Environment Variables (.env):**
```env
# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your_oauth_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_oauth_client_secret

# Google Business Profile API
GOOGLE_BUSINESS_ACCOUNT_ID=accounts/1234567890
GOOGLE_LOCATION_ID=locations/1234567890

# API Configuration
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
GOOGLE_SCOPE=https://www.googleapis.com/auth/business.manage
```

### **Step 3: API Implementation**

#### **Reviews API Endpoint:**
```
GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews
```

#### **Sample Implementation (Node.js):**
```javascript
// lib/google-reviews.js
const { google } = require('googleapis');

class GoogleReviewsAPI {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  async getReviews(accessToken) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    
    const mybusiness = google.mybusiness({ version: 'v4', auth: this.oauth2Client });
    
    try {
      const response = await mybusiness.accounts.locations.reviews.list({
        name: `${process.env.GOOGLE_BUSINESS_ACCOUNT_ID}/${process.env.GOOGLE_LOCATION_ID}/reviews`
      });
      
      return response.data.reviews || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }
}

module.exports = GoogleReviewsAPI;
```

#### **API Route Implementation:**
```javascript
// pages/api/google-reviews.js
import GoogleReviewsAPI from '@/lib/google-reviews';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken } = req.query;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' });
    }

    const reviewsAPI = new GoogleReviewsAPI();
    const reviews = await reviewsAPI.getReviews(accessToken);
    
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}
```

---

## **Business Owner Authorization Process**

### **What the Business Owner Must Do:**

1. **Add You as Manager:**
   - Go to [Google Business Profile](https://business.google.com/)
   - Select their business
   - Go to "Users" > "Invite users"
   - Add your email with "Manager" role

2. **OAuth Consent:**
   - They must visit your OAuth consent URL
   - Sign in with their Google account
   - Grant permission to your application

3. **One-Time Setup:**
   ```javascript
   // OAuth consent URL generation
   const authUrl = oauth2Client.generateAuthUrl({
     access_type: 'offline',
     scope: 'https://www.googleapis.com/auth/business.manage',
     prompt: 'consent'
   });
   ```

---

## **Important Limitations**

### **API Restrictions:**
- **Rate Limits**: 60,000 queries per day per project
- **Data Storage**: Cannot cache reviews for more than 30 days
- **No Bulk Access**: Must authenticate as business owner
- **Approval Required**: Google must approve your project

### **Policy Compliance:**
- Must respond to reviews within 48 hours of changes
- Cannot automate review responses without consent
- Must provide easy way to revoke access
- Cannot store or aggregate review data long-term

---

## **Recommended Alternative: Current System Enhancement**

Since getting authorization is complex, enhance your existing system:

### **Manual Review Import:**
```javascript
// Create admin endpoint for manual review import
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { reviews } = req.body;
    
    // Import reviews to Supabase
    for (const review of reviews) {
      await supabase.from('reviews').insert({
        reviewer_name: review.reviewer.displayName,
        rating: review.starRating,
        review_text: review.comment,
        review_date: review.createTime,
        avatar_initials: review.reviewer.displayName.substring(0, 2),
        avatar_colour: '#D4617A',
        verified: true,
        sort_order: 0
      });
    }
    
    res.status(200).json({ success: true, imported: reviews.length });
  }
}
```

### **Benefits of Current Approach:**
- No API restrictions
- Full control over review data
- No business owner dependency
- Faster implementation
- Better performance

---

## **Summary: Your Options**

| Option | Difficulty | Time Required | Reliability | Recommendation |
|--------|------------|---------------|-------------|---------------|
| **Get Business Authorization** | Very Hard | 2-4 weeks | High | Only if business owner cooperates |
| **Manual Import System** | Easy | 1-2 days | High | **RECOMMENDED** |
| **Third-Party Service** | Medium | 1 week | Medium | Consider for future |
| **Current System Enhancement** | Easy | 1 day | High | **BEST OPTION** |

---

## **Next Steps**

1. **Contact Business Owner**: Ask if they'll add you as Business Profile Manager
2. **If Yes**: Follow the full API setup process above
3. **If No**: Enhance your current Supabase review system with manual import
4. **Consider**: Building a simple admin interface for review management

The reality is that Google's Business Profile APIs are designed for business owners, not third-party developers. Your current Supabase-based system is actually the better approach for most use cases.
