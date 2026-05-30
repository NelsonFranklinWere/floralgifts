/** Preload the hero LCP image in `<head>` for faster Largest Contentful Paint. */
export default function HeroLcpPreload({ href }: { href: string }) {
  if (!href) return null;
  const url = href.startsWith("http") ? href : href;
  return (
    <link
      rel="preload"
      as="image"
      href={url}
      fetchPriority="high"
    />
  );
}
