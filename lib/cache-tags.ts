import { revalidateTag } from "next/cache";

/** Next.js cache tags for on-demand revalidation from admin APIs. */
export const CACHE_TAG_PRODUCTS = "products-catalog";
export const CACHE_TAG_HERO_SLIDES = "hero-slides";
export const CACHE_TAG_BLOG = "blog-posts";
export const CACHE_TAG_CASE_STUDIES = "case-studies";

/**
 * Next.js 16 requires a second argument on revalidateTag.
 * Admin mutations use immediate expiry so catalog/hero updates show on the next request.
 */
export function revalidateContentTag(tag: string) {
  revalidateTag(tag, { expire: 0 });
}
