import type { Metadata } from "next";
import { Montserrat, Lato, Roboto_Mono, Dancing_Script, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SHOP_INFO } from "@/lib/constants";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "December Gifts Nairobi | Christmas Flowers, Hampers & Teddy Bears | Floral Whispers Gifts",
    template: "%s | Floral Whispers Gifts Nairobi",
  },
  description:
    "December and Christmas gifts Nairobi: same-day flower delivery, gift hampers, and teddy bears across Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Order Christmas flowers, birthday bouquets, anniversary flowers, graduation roses, and corporate gift hampers with M-Pesa. Fast December delivery across Nairobi County.",
  keywords: [
    // Core location + brand
    "Floral Whispers Gifts",
    "December gifts Nairobi",
    "Christmas gifts Nairobi",
    "Christmas gifts Westlands",
    "Christmas gifts Karen",
    "Christmas gifts Lavington",
    "Christmas gifts Kilimani",
    "holiday gifts Nairobi",
    "festive gifts Nairobi",
    "best gifts on Christmas Nairobi",
    "best Christmas gifts Nairobi",
    "Christmas gift ideas Nairobi",

    // Flowers - Christmas specific
    "flower delivery Nairobi",
    "flower delivery Westlands",
    "flower delivery Karen",
    "flower delivery Lavington",
    "flower delivery Kilimani",
    "roses Nairobi",
    "Christmas flowers Nairobi",
    "Christmas roses Nairobi",
    "December flower delivery Nairobi",
    "New Year flowers Nairobi",
    "flowers for my fiance on Christmas Nairobi",
    "flowers on Christmas Nairobi",
    "Christmas flowers for fiance Nairobi",
    "flowers for husband on Christmas Nairobi",
    "gift for mom on Christmas Nairobi",
    "Christmas flowers for mom Nairobi",
    "Christmas flowers for husband Nairobi",
    "best flowers for Christmas Nairobi",

    // Hampers & gifts
    "gift hampers Kenya",
    "gift hampers Nairobi",
    "Christmas hampers Nairobi",
    "corporate gift hampers Nairobi",
    "chocolate gift hampers Kenya",
    "wine gift hampers Nairobi",
    "romantic gift hampers Nairobi",

    // Occasions
    "birthday flowers Nairobi",
    "anniversary flowers Kenya",
    "graduation flowers Nairobi",
    "funeral wreaths Nairobi",
    "sympathy flowers Nairobi",

    // Teddies & surprises
    "teddy bears Nairobi",
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
    "florist Nairobi",
    "online flower shop Nairobi",
    "M-Pesa flower delivery Nairobi",
    "fast flower delivery Nairobi",
    // Delivery & payment
    "same-day delivery Nairobi",
    "Nairobi CBD flower delivery",
    "M-Pesa flower delivery Nairobi",
    "online flower shop Nairobi",
    "Nairobi gift delivery",
    "Westlands gift delivery",
    "Karen gift delivery",
    "Lavington gift delivery",
    "Kilimani gift delivery",
  ],
  authors: [{ name: "Floral Whispers Gifts" }],
  creator: "Floral Whispers Gifts",
  publisher: "Floral Whispers Gifts",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke"),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke",
    siteName: "Floral Whispers Gifts Nairobi",
    title:
      "December Gifts Nairobi | Christmas Flowers, Hampers & Teddy Bears | Floral Whispers Gifts",
    description:
      "Shop December and Christmas gifts in Nairobi: flowers, gift hampers and teddy bears with same-day delivery to Nairobi CBD, Westlands, Karen, Lavington and Kilimani.",
    images: [
      {
        url: "/images/logo/FloralLogo.jpg",
        width: 1200,
        height: 630,
        alt: "Floral Whispers Gifts - Premium Flowers & Gifts in Nairobi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "December & Christmas Gifts Nairobi | Flowers, Hampers & Teddies | Floral Whispers Gifts",
    description:
      "Order December and Christmas gifts in Nairobi: flowers, gift hampers and teddy bears with fast same-day delivery across Nairobi County.",
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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SHOP_INFO.name,
  url: baseUrl,
  logo: `${baseUrl}/images/logo/FloralLogo.jpg`,
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
  image: `${baseUrl}/images/logo/FloralLogo.jpg`,
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
        name: "Christmas Flowers",
        url: `${baseUrl}/collections/flowers`,
      },
      {
        "@type": "OfferCatalog",
        name: "Gift Hampers",
        url: `${baseUrl}/collections/gift-hampers`,
      },
      {
        "@type": "OfferCatalog",
        name: "Christmas Gift Hampers",
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

const christmasItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Christmas Gifts Nairobi",
  description: "Premium Christmas gifts including flowers for fiance, husband, and mom. Same-day delivery across Nairobi.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Best Gifts on Christmas Nairobi",
      url: `${baseUrl}/blog/best-gifts-on-christmas-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Flowers for My Fiance on Christmas Nairobi",
      url: `${baseUrl}/blog/flowers-for-my-fiance-on-christmas-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Flowers on Christmas Nairobi",
      url: `${baseUrl}/blog/flowers-on-christmas-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Gifts for My Husband on Christmas Nairobi",
      url: `${baseUrl}/blog/gifts-for-my-husband-on-christmas-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Gift for Mom on Christmas Nairobi",
      url: `${baseUrl}/blog/gift-for-mom-on-christmas-nairobi`,
    },
  ],
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
    <html lang="en" className={`${montserrat.variable} ${lato.variable} ${robotoMono.variable} ${dancingScript.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="icon" href="/images/logo/FloralLogo.jpg" type="image/jpeg" />
        {/* Preconnect to Supabase CDN for faster image loading */}
        <link rel="preconnect" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://supabase.co" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(christmasItemListJsonLd) }}
        />
      </head>
      <body className={`${lato.className} flex flex-col min-h-screen`}>
        <GoogleAnalytics />
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
