# Floral Whispers: Category SEO To-Do

Goal: each category gets one strong page built for one type of buyer.
Status: `[x]` done, `[ ]` to do, `[owner]` needs facts or action from the owner.

## 1. Foundations
- [x] Remove the `/_next/` block from `robots.txt`
- [x] Put the homepage H1 in the HTML
- [x] Remove repeated brand from titles and keep them within 60 characters
- [x] Redirect `www` pages to non-`www`, leaving `/api` alone for payment callbacks
- [x] Add `/privacy`, `/terms` and `/returns`
- [x] Clean up the sitemap
- [x] Fix order creation and add `upsert` to the database wrapper
- [owner] Place a test order to confirm checkout works
- [owner] Confirm the policy text and have the privacy policy checked
- [owner] Create a separate Google Analytics property; both sites use `G-DTDMCDNB9F`
- [owner] Change the password hardcoded in `deploy-to-server.sh`, then remove it from the script
- [ ] Add a per-site nginx access log

## 2. Category pages
- [x] `/gift-hampers-nairobi`
- [x] `/corporate-gift-hampers-nairobi`
- [x] `/money-bouquet-nairobi`
- [x] `/funeral-wreaths-nairobi`
- [x] `/get-well-soon-gifts-nairobi`
- [x] `/period-care-package-kenya`
- [x] `/giant-teddy-bears-nairobi`
- [x] `/graduation-gifts-nairobi`
- [x] `/red-roses-nairobi`
- [x] `/send-gifts-to-kenya`
- [ ] `/chocolate-gifts-nairobi`
- [ ] `/wine-gifts-nairobi`
- [ ] `/birthday-cakes-nairobi`
- [ ] `/flower-boxes-nairobi`
- [ ] `/new-baby-gifts-nairobi`
- [ ] `/gifts-for-her-nairobi` and `/gifts-for-him-nairobi`, curated to 20–30 products
- [ ] Permanent Valentine's, Mother's Day and Christmas pages with no year in the URL
- [ ] Update seasonal pages 6–8 weeks before each date

## 3. Facts to add to the pages
- [owner] Daily same-day cut-off time
- [owner] Money bouquet service charge at each cash amount
- [owner] How cash bouquets are handed over
- [owner] Corporate minimum order, bulk pricing, and whether you issue invoices
- [owner] Delivery photo policy for customers abroad
- [owner] Contents of Care Package, Aroma & Delight, Signature Celebration and Spoil Me Sweet Box
- [owner] Price check: `100-reasons` is KSh 7,500, but `200-amor-bouquet` says 100 red roses cost KSh 10,000
- [owner] Real photos and permission to name past corporate and funeral work

## 4. Products
- [x] Add delivery and return details to product structured data
- [ ] Rewrite the 126 descriptions under 8 words, starting with funeral, hampers and money bouquets
- [ ] Fix spelling in titles and descriptions ("Cuddburry", "mumbs", "hsmper")
- [ ] Merge duplicates after owner review: Endless Romance, Pure Affection, Sweet Whisper, Luxury Rose
- [ ] Give the three Ferrero products distinct titles
- [ ] Add a product and rating to structured data only when genuine reviews exist
- [owner] Review and approve database copy changes before they are applied

## 5. Blogs
- [x] Fix double H1s on 19 posts
- [x] Link every post to its matching category page
- [x] Redirect 2 money bouquet posts, 2 period care posts and 1 duplicate wife post to one page each
- [ ] Merge 15 birthday posts into about 3 guides
- [ ] Merge 12 delivery posts into about 3 guides
- [ ] Merge 5 florist and flower shop posts into 1
- [ ] Merge 7 Valentine's and 4 Mother's Day posts into the permanent seasonal pages
- [ ] Shorten the 79 meta descriptions over 160 characters
- [ ] Add product links to each guide

## 6. Local and authority
- [owner] Connect Search Console so page targets use real queries
- [owner] Add a Google Business Profile product for each category, linked to its page
- [owner] Ask each customer for a review that names what they bought; target 200+
- [owner] Post real work on the Business Profile weekly
- [owner] Earn links from wedding directories, corporate suppliers and Kenyan lifestyle and parenting sites
- [owner] Link TikTok and Instagram posts to the matching category page
- [owner] Confirm which case studies and About page stats are real; remove the rest
- [owner] Keep Floral Whispers focused on gifting and The Stems on events and weddings

## 7. Review monthly
- [ ] Clicks, impressions and rank per category page in Search Console
- [ ] Revenue per category in Analytics
- [ ] Merge or rewrite pages with impressions but few clicks
