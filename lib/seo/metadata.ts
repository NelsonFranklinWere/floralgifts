import type { Metadata } from "next";
import { canonicalUrl, formatSeoTitle, SEO_BASE_URL, SEO_BRAND, SEO_TITLE_TEMPLATE } from "./base";
import { getSeasonalCopy } from "./seasonal-config";
import { DEEP_FLOWER_ROSE_KEYWORDS } from "@/lib/seo-keywords";

export interface PageMetadataInput {
  /** Page or product name (without brand suffix). */
  title: string;
  description: string;
  /** Path for self-referencing canonical, e.g. `/blog/my-post`. Omit for homepage. */
  path?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
}

/** Build Next.js Metadata with enforced title format + self-referencing canonical. */
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const url = canonicalUrl(input.path ?? "/");
  const title = formatSeoTitle(input.title);
  const ogImage = input.ogImage ?? "/images/logo/FloralLogo.jpg";

  return {
    title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: input.description,
      url,
      siteName: SEO_BRAND,
      locale: "en_KE",
      type: input.ogType ?? "website",
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${SEO_BASE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: SEO_BRAND,
        },
      ],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      images: [ogImage.startsWith("http") ? ogImage : `${SEO_BASE_URL}${ogImage}`],
    },
    ...(input.noIndex
      ? { robots: { index: false, follow: false } }
      : {
          robots: {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              "max-image-preview": "large",
              "max-snippet": -1,
            },
          },
        }),
  };
}

/** Root layout metadata — evergreen by default, seasonal when in-window. */
export function buildRootMetadata(): Metadata {
  const seasonal = getSeasonalCopy();
  const defaultTitle = formatSeoTitle(`${seasonal.tagline} — ${seasonal.homeTitle}`);

  return {
    title: {
      default: defaultTitle,
      template: SEO_TITLE_TEMPLATE,
    },
    description: seasonal.homeDescription,
    keywords: [...DEEP_FLOWER_ROSE_KEYWORDS.slice(0, 20), ...seasonal.extraKeywords],
    metadataBase: new URL(SEO_BASE_URL),
    alternates: { canonical: SEO_BASE_URL },
    openGraph: {
      type: "website",
      locale: "en_KE",
      url: SEO_BASE_URL,
      siteName: SEO_BRAND,
      title: defaultTitle,
      description: seasonal.homeDescription,
      images: [
        {
          url: "/images/logo/FloralLogo.jpg",
          width: 676,
          height: 677,
          alt: `${SEO_BRAND} — ${seasonal.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: seasonal.homeDescription,
      images: ["/images/logo/FloralLogo.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
    },
  };
}
