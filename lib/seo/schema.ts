import { SHOP_INFO } from "@/lib/constants";
import { SEO_BASE_URL, canonicalUrl } from "./base";
import { getSeasonalCopy } from "./seasonal-config";

/** Precise address to avoid local SEO cannibalization with sister brand in same building. */
export const FLORIST_ADDRESS = {
  streetAddress: "Delta Hotel, 5th Floor, Room 512, University Way",
  addressLocality: "Nairobi",
  addressRegion: "Nairobi County",
  postalCode: "00100",
  addressCountry: "KE",
} as const;

const DELIVERY_AREAS = [
  "Nairobi CBD",
  "Westlands",
  "Karen",
  "Lavington",
  "Kilimani",
  "Kileleshwa",
  "Parklands",
  "Upper Hill",
  "Langata",
  "Runda",
];

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SHOP_INFO.name,
    url: SEO_BASE_URL,
    logo: `${SEO_BASE_URL}/images/logo/FloralLogo.jpg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${SHOP_INFO.phone}`,
      contactType: "Customer Service",
      areaServed: "KE",
      availableLanguage: ["English", "Swahili"],
    },
    sameAs: [
      `https://www.instagram.com/${SHOP_INFO.instagram.replace("@", "")}`,
      `https://www.facebook.com/${SHOP_INFO.facebook}`,
      `https://twitter.com/${SHOP_INFO.twitter.replace("@", "")}`,
      `https://www.tiktok.com/${SHOP_INFO.tiktok.replace("@", "")}`,
    ],
  };
}

/** Hyper-specific Florist schema — unique floor/room to differentiate from sister brand. */
export function buildFloristSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Florist",
    "@id": `${SEO_BASE_URL}#florist`,
    name: SHOP_INFO.name,
    image: `${SEO_BASE_URL}/images/logo/FloralLogo.jpg`,
    url: SEO_BASE_URL,
    telephone: `+${SHOP_INFO.phone}`,
    email: SHOP_INFO.email,
    description: getSeasonalCopy().homeDescription,
    address: {
      "@type": "PostalAddress",
      ...FLORIST_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -1.2834,
      longitude: 36.8256,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "17:00",
      },
    ],
    priceRange: "$$",
    paymentAccepted: ["M-Pesa", "Cash", "Card"],
    currenciesAccepted: "KES",
    areaServed: DELIVERY_AREAS.map((name) => ({
      "@type": "City",
      name,
      containedInPlace: { "@type": "Country", name: "Kenya" },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Flowers, Gift Hampers & Teddy Bears",
      itemListElement: [
        { "@type": "OfferCatalog", name: "Flowers", url: `${SEO_BASE_URL}/collections/flowers` },
        { "@type": "OfferCatalog", name: "Gift Hampers", url: `${SEO_BASE_URL}/collections/gift-hampers` },
        { "@type": "OfferCatalog", name: "Teddy Bears", url: `${SEO_BASE_URL}/collections/teddy-bears` },
        { "@type": "OfferCatalog", name: "Wines", url: `${SEO_BASE_URL}/collections/wines` },
        { "@type": "OfferCatalog", name: "Chocolates", url: `${SEO_BASE_URL}/collections/chocolates` },
      ],
    },
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SHOP_INFO.name,
    url: SEO_BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SEO_BASE_URL}/collections?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you deliver flowers same day in Nairobi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Same-day flower delivery is available in Nairobi CBD for orders placed before 2 PM. Westlands, Karen, Lavington and Kilimani receive next-day or same-day depending on timing.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Floral Whispers Gifts located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Floral Whispers Gifts is at Delta Hotel, 5th Floor, Room 512, University Way, Nairobi, Kenya — opposite Central Police Station.",
        },
      },
      {
        "@type": "Question",
        name: "How do I pay with M-Pesa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Select M-Pesa at checkout and complete the STK push prompt on your phone. We also accept cash and card.",
        },
      },
      {
        "@type": "Question",
        name: "What areas do you deliver to?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We deliver across Nairobi CBD, Westlands, Karen, Lavington, Kilimani, Kileleshwa, Parklands, Upper Hill, Langata, Runda and surrounding areas.",
        },
      },
    ],
  };
}

export interface ProductSchemaInput {
  slug: string;
  title: string;
  description?: string | null;
  short_description?: string | null;
  images: string[];
  price: number;
  category?: string;
  stock?: number | null;
  sku?: string | null;
  id: string;
}

const CATEGORY_SCHEMA: Record<string, string> = {
  flowers: "Florist",
  teddy: "Product",
  hampers: "Product",
  wines: "Product",
  chocolates: "Product",
  cards: "Product",
  cakes: "Product",
};

/** Product JSON-LD — clean description, exact KES price, stock status. */
export function buildProductSchema(product: ProductSchemaInput) {
  const url = `${SEO_BASE_URL}/product/${product.slug}`;
  const desc =
    product.short_description?.trim() ||
    product.description?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500) ||
    product.title;

  const images =
    product.images.length > 0
      ? product.images.map((img) => (img.startsWith("http") ? img : `${SEO_BASE_URL}${img}`))
      : [`${SEO_BASE_URL}/images/logo/FloralLogo.jpg`];

  const inStock = product.stock == null || product.stock > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url,
    name: product.title,
    description: desc,
    image: images,
    sku: product.sku || product.id,
    category: CATEGORY_SCHEMA[product.category || ""] || "Product",
    brand: { "@type": "Brand", name: SHOP_INFO.name },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "KES",
      price: (product.price / 100).toFixed(2),
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SHOP_INFO.name },
    },
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

/** All homepage JSON-LD blocks — no always-on Valentine's ItemList. */
export function buildHomepageSchemas() {
  return [
    buildOrganizationSchema(),
    buildFloristSchema(),
    buildWebsiteSchema(),
    buildFaqSchema(),
  ];
}
