# How to Find Google Place ID - Step by Step

## **Method 1: Google Search (Easiest)**

### **Step 1: Open Google**
Go to [google.com](https://google.com)

### **Step 2: Search for the Business**
Type: `Floral Whispers Gifts Nairobi`

### **Step 3: Look for the Business Listing**
You should see something like:
```
Floral Whispers Gifts
Florist · Nairobi
Phone: +254 XXX XXX XXX
4.8 stars (150 reviews)
```

### **Step 4: Click on the Business Name**
**Important:** Click on the business name, NOT your website link

### **Step 5: Look at the Address Bar**
The URL will look like:
```
https://www.google.com/maps/place/Floral+Whispers+Gifts/@-1.2921,36.8219,17z/data=!4m6!3m5!1sChIJd7y6y4vLhRsR4l4gk2m8cQI!8m2!3d-1.2921!4d36.8219
```

### **Step 6: Extract the Place ID**
The Place ID is the part after `1s`:
```
ChIJd7y6y4vLhRsR4l4gk2m8cQI
```

---

## **Method 2: Google Maps**

### **Step 1: Open Google Maps**
Go to [maps.google.com](https://maps.google.com)

### **Step 2: Search**
Type: `Floral Whispers Gifts Nairobi`

### **Step 3: Click on Business**
Click on the business name in the search results

### **Step 4: Look at URL**
Same as above - find the part after `1s`

---

## **Method 3: Use Google's Place ID Finder**

### **Step 1: Go to Place ID Finder**
Visit: [https://developers.google.com/maps/documentation/places/web-service/place-id](https://developers.google.com/maps/documentation/places/web-service/place-id)

### **Step 2: Search**
Enter: `Floral Whispers Gifts Nairobi`

### **Step 3: Copy Place ID**
Google will show you the exact Place ID

---

## **What the Place ID Looks Like**

**Correct Format:** `ChIJd7y6y4vLhRsR4l4gk2m8cQI`

**Incorrect (Your Website):** `https://www.floralwhispersgifts.co.ke/?srsltid=AfmBOoofRSF4uCD2ACElEJETUbv8iaZUPGsae3evtH5oZ-7jDEi7N38b`

---

## **Quick Test**

Once you have the Place ID, test it:

```
https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID_HERE
```

Replace `YOUR_PLACE_ID_HERE` with the actual Place ID.

If it opens a review page for Floral Whispers Gifts, you have the correct one!

---

## **Common Mistakes**

1. **Using website URL** - Not the Place ID
2. **Using Google Search URL** - Not the Place ID  
3. **Using tracking parameters** - Not the Place ID
4. **Not clicking the business listing** - Click the business, not your website

---

## **If You Still Can't Find It**

Try these alternative searches:
- "Floral Whispers Gifts"
- "Floral Whispers Gifts Kenya"
- "Floral Whispers Florist Nairobi"

Or use the business phone number/address to search.

The Place ID is always in the Google Maps URL when you click on a business listing.
