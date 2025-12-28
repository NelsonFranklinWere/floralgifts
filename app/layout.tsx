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
      "Best Gifts Nairobi | Flowers, Money Bouquet & Gift Hampers | Floral Whispers Gifts",
    template: "%s | Floral Whispers Gifts Nairobi",
  },
  description:
    "Best gifts Nairobi: flowers, money bouquet, gift hampers for men, wives, couples, children, and colleagues. Same-day flower delivery, surprise gifts for your wife, romantic flowers, corporate gifts, and money bouquets across Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Order online with M-Pesa.",
  keywords: [
    // Core services - how people actually search
    "best gifts for men Nairobi",
    "best gifts for wives Nairobi",
    "best gifts for couples Nairobi",
    "best gifts for children Nairobi",
    "best gifts for colleagues Nairobi",
    "surprise gifts for wife Nairobi",
    "what to surprise wife with Nairobi",
    "gifts to surprise wife Nairobi",
    "new year gifts for men Nairobi",
    "new year gifts for women Nairobi",
    "new year gift for my wife Nairobi",
    "new year gift for my love Nairobi",
    "gifts for colleagues at work Nairobi",
    "corporate gifts for colleagues Nairobi",
    "gifts for work colleagues Nairobi",

    // Products - service-based searches
    "money bouquet Nairobi",
    "money bouquet Kenya",
    "money flower bouquet Nairobi",
    "flowers Nairobi",
    "flower delivery Nairobi",
    "flower delivery Westlands",
    "flower delivery Karen",
    "flower delivery Lavington",
    "flower delivery Kilimani",
    "roses Nairobi",
    "romantic flowers Nairobi",
    "surprise flowers Nairobi",
    "bouquet delivery Nairobi",
    "same-day flower delivery Nairobi",
    "online flower shop Nairobi",
    "M-Pesa flower delivery Nairobi",
    "fast flower delivery Nairobi",
    "Nairobi CBD flower delivery",

    // Gift hampers
    "gift hampers Kenya",
    "gift hampers Nairobi",
    "corporate gift hampers Nairobi",
    "chocolate gift hampers Kenya",
    "wine gift hampers Nairobi",
    "romantic gift hampers Nairobi",
    "gift hampers for men Nairobi",
    "gift hampers for women Nairobi",
    "gift hampers for couples Nairobi",

    // Occasions & services
    "birthday flowers Nairobi",
    "anniversary flowers Kenya",
    "graduation flowers Nairobi",
    "funeral wreaths Nairobi",
    "sympathy flowers Nairobi",
    "wedding flowers Nairobi",
    "corporate gifts Kenya",
    "get well soon flowers",
    "congratulatory flowers Kenya",

    // Teddy bears & surprises
    "teddy bears Nairobi",
    "teddy bears Kenya",
    "surprise deliveries Nairobi",
    "surprise gifts Nairobi",
    "romantic gifts Nairobi",
    "gifts for her Nairobi",
    "gifts for him Nairobi",

    // Location-based
    "flower shop Nairobi",
    "florist Nairobi",
    "Nairobi gift delivery",
    "Westlands gift delivery",
    "Karen gift delivery",
    "Lavington gift delivery",
    "Kilimani gift delivery",
    "same-day delivery Nairobi",
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
      "Best Gifts Nairobi | Flowers, Money Bouquet & Gift Hampers | Floral Whispers Gifts",
    description:
      "Best gifts Nairobi: flowers, money bouquet, gift hampers for men, wives, couples, children, and colleagues. Same-day delivery across Nairobi CBD, Westlands, Karen, Lavington, Kilimani.",
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
      "Best Gifts Nairobi | Flowers, Money Bouquet & Gift Hampers | Floral Whispers Gifts",
    description:
      "Best gifts Nairobi: flowers, money bouquet, gift hampers for men, wives, couples, children, and colleagues. Same-day delivery across Nairobi.",
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
        name: "Money Bouquet",
        url: `${baseUrl}/collections/flowers`,
      },
      {
        "@type": "OfferCatalog",
        name: "Gift Hampers",
        url: `${baseUrl}/collections/gift-hampers`,
      },
      {
        "@type": "OfferCatalog",
        name: "Corporate Gift Hampers",
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

const modernGiftsItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Gifts Nairobi - Flowers, Money Bouquet & Gift Hampers",
  description: "Premium gifts including flowers, money bouquet, and gift hampers for men, wives, couples, children, and colleagues. Same-day delivery across Nairobi.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Best Gifts for Men Nairobi",
      url: `${baseUrl}/blog/best-gifts-for-men-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Best Gifts for Wives Nairobi",
      url: `${baseUrl}/blog/best-gifts-for-wives-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Money Bouquet Nairobi",
      url: `${baseUrl}/blog/money-bouquet-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Surprise Gifts for Wife Nairobi",
      url: `${baseUrl}/blog/surprise-gifts-for-wife-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Best Gifts for Colleagues Nairobi",
      url: `${baseUrl}/blog/best-gifts-for-colleagues-nairobi`,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(modernGiftsItemListJsonLd) }}
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
