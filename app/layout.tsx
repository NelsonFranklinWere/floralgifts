import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import { SHOP_INFO } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Floral Whispers Gifts | Premium Flower Delivery Nairobi | Same-Day Delivery",
    template: "%s | Floral Whispers Gifts",
  },
  description:
    "Premium flower delivery Nairobi, gift hampers Kenya, teddy bears Kenya. Same-day delivery Nairobi CBD. Birthday flowers, anniversary flowers, funeral wreaths, roses Nairobi. Order online with M-Pesa.",
  keywords: [
    "flower delivery Nairobi",
    "roses Nairobi",
    "gift hampers Kenya",
    "birthday flowers Nairobi",
    "anniversary flowers Kenya",
    "funeral wreaths Nairobi",
    "teddy bears Kenya",
    "surprise deliveries Nairobi",
    "same-day delivery Nairobi",
    "romantic flowers Nairobi",
    "flower shop Nairobi",
    "bouquet delivery Nairobi",
    "get well soon flowers",
    "congratulatory flowers Kenya",
    "chocolate gift hampers Kenya",
    "wine gift hampers Nairobi",
    "corporate gift hampers Kenya",
    "romantic gift hampers Nairobi",
  ],
  authors: [{ name: "Floral Whispers Gifts" }],
  creator: "Floral Whispers Gifts",
  publisher: "Floral Whispers Gifts",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke"),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke",
    siteName: "Floral Whispers Gifts",
    title: "Floral Whispers Gifts | Premium Flower Delivery Nairobi | Same-Day Delivery",
    description:
      "Premium flower delivery Nairobi, gift hampers Kenya, teddy bears Kenya. Same-day delivery Nairobi CBD. Birthday flowers, anniversary flowers, funeral wreaths, roses Nairobi.",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Floral Whispers Gifts - Premium Flowers & Gifts in Nairobi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Floral Whispers Gifts | Premium Flower Delivery Nairobi",
    description: "Premium flower delivery Nairobi, gift hampers Kenya, teddy bears Kenya. Same-day delivery available.",
    images: ["/images/logo.jpg"],
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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SHOP_INFO.name,
  url: baseUrl,
  logo: `${baseUrl}/images/logo.jpg`,
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
  ],
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Florist",
  "@id": `${baseUrl}#business`,
  name: SHOP_INFO.name,
  image: `${baseUrl}/images/logo.jpg`,
  url: baseUrl,
  telephone: `+${SHOP_INFO.phone}`,
  email: SHOP_INFO.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: SHOP_INFO.address,
    addressLocality: "Nairobi",
    addressRegion: "Nairobi",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-1.2921",
    longitude: "36.8219",
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
  paymentAccepted: "M-Pesa, Cash, Card",
  currenciesAccepted: "KES",
  areaServed: [
    {
      "@type": "City",
      name: "Nairobi",
    },
    {
      "@type": "Country",
      name: "Kenya",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Flowers, Gift Hampers, and Teddy Bears",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Flowers",
        url: `${baseUrl}/collections/flowers`,
      },
      {
        "@type": "OfferCatalog",
        name: "Gift Hampers",
        url: `${baseUrl}/collections/gift-hampers`,
      },
      {
        "@type": "OfferCatalog",
        name: "Teddy Bears",
        url: `${baseUrl}/collections/teddy-bears`,
      },
      {
        "@type": "OfferCatalog",
        name: "Wines",
        url: `${baseUrl}/collections/wines`,
      },
      {
        "@type": "OfferCatalog",
        name: "Chocolates",
        url: `${baseUrl}/collections/chocolates`,
      },
    ],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SHOP_INFO.name,
  url: baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${baseUrl}/collections?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${robotoMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ErrorBoundary>
          <AnalyticsProvider>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </AnalyticsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
