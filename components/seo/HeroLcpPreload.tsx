import { getOptimizedProductImageUrl, isSupabaseStorageUrl } from "@/lib/product-image-url";

/** Preload the hero LCP image in `<head>` for faster Largest Contentful Paint. */
export default function HeroLcpPreload({ href }: { href: string }) {
  if (!href) return null;
  const url = isSupabaseStorageUrl(href)
    ? getOptimizedProductImageUrl(href, "hero")
    : href;
  return (
    <link
      rel="preload"
      as="image"
      href={url}
      fetchPriority="high"
    />
  );
}
