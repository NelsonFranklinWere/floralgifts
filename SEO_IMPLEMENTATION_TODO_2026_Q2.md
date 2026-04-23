# SEO Implementation Todo (Q2 2026)

Source: Cres Dynamics audit (Jan 22 - Apr 21, 2026)  
Goal: move from low CTR/position to consistent page-1 rankings and qualified conversions.

## P0 - Critical (Do immediately)

- [x] **Canonical domain consistency**
  - [x] Keep 301 redirect from non-www to www in `next.config.js`
  - [x] Set `NEXT_PUBLIC_BASE_URL` to `https://www.floralwhispersgifts.co.ke` in `.env` and `.env.local`
  - [x] Update key hardcoded canonical URL in `app/case-studies/page.tsx`
  - [ ] Sweep legacy docs/deploy scripts for non-www defaults (optional but recommended)

- [x] **Homepage CTR rewrite**
  - [x] Updated homepage title and meta description in `app/page.tsx`
  - [ ] A/B test alternative meta description after 14 days in GSC

- [x] **Create dedicated keyword landing page**
  - [x] Added `/flower-hamper-wine-nairobi` with intent-focused copy and CTAs
  - [x] Added to sitemap in `app/sitemap.ts`
  - [ ] Add internal links from homepage and collections pages to this landing page

- [x] **Product structured data coverage**
  - [x] Verified Product JSON-LD exists in `app/product/[slug]/page.tsx`
  - [ ] Add `shippingDetails` and `hasMerchantReturnPolicy` fields to product schema
  - [ ] Add `aggregateRating`/`review` when review data source is available

- [ ] **Submit sitemap in Search Console**
  - [ ] Submit `https://www.floralwhispersgifts.co.ke/sitemap.xml`
  - [ ] Request reindex for homepage + new landing page

## P1 - High (Week 1-2)

- [x] **Blog conversion CTAs**
  - [x] Added strong WhatsApp + collections CTA block to `app/blog/[slug]/page.tsx`
  - [ ] Ensure CTA appears above fold on mobile for top 10 blog posts (UX tuning)

- [ ] **Meta title/snippet optimization for zero-click queries**
  - [ ] Rewrite titles/descriptions for pages targeting:
    - `period care package kenya`
    - `eid corporate gift hampers`
    - `flower hamper wine same day delivery nairobi`
  - [ ] Add explicit "same-day Nairobi" and "Order on WhatsApp" phrasing

- [ ] **Blog index ranking support**
  - [ ] Add internal "Related Guides" links at bottom of every post pointing to `/blog`
  - [ ] Add "Featured Guides" section on `/blog` with links to top CTR posts
  - [ ] Add keyword-rich intro content to `/blog` (Nairobi gifting hub intent)

- [ ] **Brand CTR improvement**
  - [ ] Add visible "Google Reviews" proof block near homepage hero
  - [ ] Ensure Organization schema sameAs/social profiles are complete and accurate

## P2 - Medium (Week 2-4)

- [ ] **Corporate/Eid landing page**
  - [ ] Create `/corporate-gift-hampers-nairobi` page
  - [ ] Include bulk ordering CTA + WhatsApp prefilled message

- [ ] **Period care package SEO page**
  - [ ] Build dedicated page or optimize existing relevant collection/blog entry
  - [ ] Align title with exact-match query intent

- [ ] **Diaspora landing page**
  - [ ] Create `/send-gifts-to-kenya` targeting diaspora intent
  - [ ] Include ordering flow for overseas buyers paying for Nairobi delivery

- [ ] **Seasonal SEO pipeline (8 weeks early)**
  - [ ] Mother's Day
  - [ ] Eid
  - [ ] Christmas/New Year
  - [ ] Valentine's 2027

## P3 - UX and technical hardening (Ongoing)

- [ ] **Tablet UX pass**
  - [ ] Test homepage, product page, checkout on iPad widths
  - [ ] Fix CTA position and card overflow where needed

- [ ] **Desktop snippet CTR tuning**
  - [ ] Improve page title lengths and emotional hooks
  - [ ] Add more specific benefit-led meta descriptions

- [ ] **Performance/quality controls**
  - [ ] Monthly `npm update` + regression checks
  - [ ] Weekly Search Console monitoring: clicks/CTR/position by query and page

## Measurement Plan (what success looks like)

- CTR from ~2.76% to **4%+**
- Avg position from ~7.97 to **5.5 or better**
- Query `flower hamper wine same day delivery nairobi` to top-7
- Product rich results visible for core product pages
- Organic clicks from 62/quarter to **200+/month** over 60-90 days
