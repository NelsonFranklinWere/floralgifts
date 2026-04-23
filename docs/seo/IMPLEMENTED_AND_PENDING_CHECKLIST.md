# Floral Whispers SEO Audit Completion Checklist

This checklist consolidates:
- what has already been implemented in code/config,
- what is still pending,
- and how to close remaining items for full audit completion.

Reference audit: Cres Dynamics Website Performance Audit (Jan 22 - Apr 21, 2026)

---

## A. Implemented Checklist (Completed in Project)

## A1) Domain, Canonical, and Technical SEO Base

- [x] 301 non-www -> www redirect configured in `next.config.js`
- [x] Canonical base URL defaults updated to `https://www.floralwhispersgifts.co.ke` in core layout metadata
- [x] Canonical cleanup started across key app routes and API fallback URLs
- [x] Sitemap route active at `/sitemap.xml`
- [x] Middleware deprecation fixed by moving to `proxy.ts`
- [x] Missing pattern asset fixed (`public/images/patterns/diagonal-lines.svg`)

## A2) Homepage CTR / Intent Positioning

- [x] Homepage meta title rewritten for stronger high-intent phrasing
- [x] Homepage meta description rewritten with Nairobi + same-day + conversion intent
- [x] Hero trust text and Google reviews anchor added
- [x] Hero internal links to high-value conversion pages added

## A3) High-Intent Landing Pages

- [x] `app/flower-hamper-wine-nairobi/page.tsx` created
- [x] `app/corporate-gift-hampers-nairobi/page.tsx` created
- [x] `app/send-gifts-to-kenya/page.tsx` created
- [x] `app/period-care-package-kenya/page.tsx` created
- [x] New landing pages added into `app/sitemap.ts`
- [x] Internal links from blog/collections/home added to priority landing pages

## A4) Product Schema Improvements

- [x] Product JSON-LD already present for product pages
- [x] `shippingDetails` added
- [x] `hasMerchantReturnPolicy` added
- [x] Offer fields (price, currency, availability, seller) retained

## A5) Blog Funnel and Conversion

- [x] Blog post WhatsApp conversion CTA added (`app/blog/[slug]/page.tsx`)
- [x] Related guides block added at blog-post level
- [x] Blog hub intro optimized for Nairobi gift intent
- [x] Featured high-intent guide links added to blog index
- [x] Fallback commercial blog content entries added in `lib/blogData.ts`:
  - flower hamper + wine
  - period care package
  - Eid corporate gifting
  - diaspora send-gifts
  - same-day romantic gifts

## A6) Reviews / Trust Surface

- [x] Homepage reviews section switched to Elfsight widget
- [x] Reviews section anchor and script integration present
- [x] Review section title/placement keeps social proof visible

## A7) Collection and Internal Linking Enhancements

- [x] Collection pages now link to money pages and strategic intent pages
- [x] Gift hampers page links to flower-hamper-wine page
- [x] Wines page links to flower-hamper-wine page

## A8) Program and Governance Docs

- [x] `docs/seo/MASTER_TRACKER_Q2_2026.md`
- [x] `docs/seo/GSC_OPERATIONAL_CHECKLIST.md`
- [x] `docs/seo/WEEKLY_SEO_REVIEW_PLAYBOOK.md`
- [x] `docs/seo/SEO_RELEASE_LOG.md`
- [x] `docs/seo/GEO_TARGETING_NOTES.md`
- [x] `docs/seo/SEASONAL_CONTENT_CALENDAR_2026_2027.md`
- [x] `docs/seo/DEVICE_UX_QA_CHECKLIST.md`

## A9) Build/Quality Verification

- [x] Production build passes after the SEO rollout
- [x] No new lint issues detected in changed SEO files

---

## B. Pending Checklist (Still Required to Finish Audit Fully)

These items are outstanding either because they require external platform access or recurring execution.

## B1) Google Search Console / External Console Actions

- [ ] Submit sitemap in GSC:
  - `https://www.floralwhispersgifts.co.ke/sitemap.xml`
- [ ] Request indexing in GSC for:
  - `/`
  - `/flower-hamper-wine-nairobi`
  - `/corporate-gift-hampers-nairobi`
  - `/period-care-package-kenya`
  - `/send-gifts-to-kenya`
  - top 10 product pages
- [ ] Confirm canonical selection in GSC URL Inspection for home/blog/product URLs
- [ ] Validate Product enhancements status in GSC after schema changes
- [ ] Monitor coverage/indexing errors weekly from GSC

## B2) Rich Results Validation Loop

- [ ] Run Google Rich Results Test for top 20 product URLs
- [ ] Resolve any warnings flagged by Google validators
- [ ] Reinspect fixed pages in GSC
- [ ] Track product snippet CTR before/after

## B3) Query-Level Meta Optimization Remaining

- [ ] Final metadata refinement for exact zero-click queries:
  - `period care package kenya`
  - `eid corporate gift hampers`
  - `nairobi flower hamper wine same day delivery`
- [ ] Add/adjust explicit “same-day Nairobi” + “Order on WhatsApp” wording where needed

## B4) Tablet UX Execution (Not just checklist)

- [ ] Perform manual iPad portrait/landscape QA on:
  - homepage
  - product detail
  - checkout
  - blog post
- [ ] Implement any layout/CTA fixes discovered
- [ ] Capture screenshots and add evidence to release log

## B5) Seasonal Engine Execution (Calendar exists, publishing pending)

- [ ] Create and publish Mother’s Day landing + support content
- [ ] Create and publish Eid seasonal campaign pages
- [ ] Create and publish Christmas seasonal pages
- [ ] Begin Valentine’s 2027 campaign pages at 8-week lead

## B6) Ongoing Ops (Process tasks, recurring)

- [ ] Weekly KPI review (queries/pages/devices)
- [ ] Monthly CTR and ranking delta report
- [ ] Quarterly cannibalization/cleanup review
- [ ] Keep release log updated with every SEO deployment

---

## C. Final Closure Checklist (Audit Completion Definition)

Mark audit as fully complete only when all are true:

- [ ] All Pending items in section B1-B6 are complete or active on schedule
- [ ] GSC confirms valid sitemap processing and no major coverage blockers
- [ ] Product schema enhancements show as valid in Google tooling
- [ ] Homepage CTR shows upward trend over at least 2 reporting windows
- [ ] Target query cluster (`flower hamper wine`) moves into stronger page-1 territory
- [ ] Weekly SEO operations cadence is active and documented

---

## D. Evidence To Attach For Sign-Off

- [ ] Screenshot: GSC sitemap submitted successfully
- [ ] Screenshot: URL Inspection for homepage canonical (www)
- [ ] Screenshot: Product Rich Results pass for representative SKUs
- [ ] Before/after CTR snapshot for homepage and top product pages
- [ ] Device QA screenshots (mobile/tablet)
- [ ] Last 2 weekly SEO review summaries
