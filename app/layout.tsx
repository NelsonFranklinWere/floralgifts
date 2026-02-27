import type { Metadata } from "next";
import { Montserrat, Lato, Roboto_Mono, Dancing_Script, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import VisitorPing from "@/components/VisitorPing";
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
      "Flower Delivery Nairobi | Fresh Pink Roses, Red Roses & White Flowers | Same-Day Delivery | Floral Whispers Gifts",
    template: "%s | Floral Whispers Gifts Nairobi",
  },
  description:
    "Flower delivery Nairobi: fresh pink roses, red roses, white flowers & blooming roses. Same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Valentine's gifts, money bouquet, romantic flowers. Order online with M-Pesa.",
  keywords: [
    "flower delivery Nairobi",
    "fresh flowers Nairobi",
    "pink roses Nairobi",
    "red roses Nairobi",
    "white flowers Nairobi",
    "same day flower delivery Nairobi",
    "florist Nairobi",
    "roses Nairobi",
    "valentine's gifts Nairobi",
    "valentine's flowers Nairobi",
    "money bouquet Nairobi",
    "gift hampers Nairobi",
    "teddy bears Nairobi",
    "romantic flowers Nairobi",
    "bouquet delivery Nairobi",
    "flower delivery Westlands",
    "flower delivery Karen",
    "Nairobi CBD flower delivery",
    "birthday flowers Nairobi",
    "anniversary flowers Nairobi",
    "wedding flowers Nairobi",
    "M-Pesa flower delivery Nairobi",
    "online flower shop Nairobi",
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
      "Flower Delivery Nairobi | Fresh Pink Roses, Red Roses & White Flowers | Same-Day Delivery",
    description:
      "Flower delivery Nairobi: fresh pink roses, red roses, white flowers & blooming roses. Same-day delivery CBD, Westlands, Karen. Valentine's gifts, money bouquet, romantic flowers. Order with M-Pesa.",
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
      "Flower Delivery Nairobi | Fresh Pink Roses, Red Roses & White Flowers | Same-Day Delivery",
    description:
      "Flower delivery Nairobi: fresh pink roses, red roses, white flowers. Same-day delivery Nairobi. Valentine's gifts, money bouquet. Order with M-Pesa.",
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
    name: "Flower Delivery Nairobi, Roses, Gift Hampers, and Teddy Bears",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Flower Delivery Nairobi",
        url: `${baseUrl}/collections/flowers`,
      },
      {
        "@type": "OfferCatalog",
        name: "Fresh Flowers & Roses",
        url: `${baseUrl}/collections/flowers`,
      },
      {
        "@type": "OfferCatalog",
        name: "Pink Roses Nairobi",
        url: `${baseUrl}/collections/flowers`,
      },
      {
        "@type": "OfferCatalog",
        name: "Red Roses Nairobi",
        url: `${baseUrl}/collections/flowers`,
      },
      {
        "@type": "OfferCatalog",
        name: "White Flowers Nairobi",
        url: `${baseUrl}/collections/flowers`,
      },
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

const flowerDeliveryItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Flower Delivery Nairobi - Fresh Pink Roses, Red Roses, White Flowers",
  description: "Same-day flower delivery Nairobi: fresh pink roses, red roses, white flowers, blooming roses. CBD, Westlands, Karen, Lavington, Kilimani. Florist Nairobi.",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Flower Delivery Nairobi", url: `${baseUrl}/collections/flowers` },
    { "@type": "ListItem", position: 2, name: "Pink Roses Nairobi", url: `${baseUrl}/collections/flowers` },
    { "@type": "ListItem", position: 3, name: "Red Roses Nairobi", url: `${baseUrl}/collections/flowers` },
    { "@type": "ListItem", position: 4, name: "White Flowers Nairobi", url: `${baseUrl}/collections/flowers` },
    { "@type": "ListItem", position: 5, name: "Fresh White Flowers", url: `${baseUrl}/collections/flowers` },
    { "@type": "ListItem", position: 6, name: "Blooming Pink Roses", url: `${baseUrl}/collections/flowers` },
    { "@type": "ListItem", position: 7, name: "Fresh Flowers Nairobi", url: `${baseUrl}/collections/flowers` },
  ],
};

const modernGiftsItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Valentine's Gifts Nairobi - Romantic Flowers, Chocolates & Gift Hampers",
  description: "Premium Valentine's gifts including romantic flowers, premium chocolates, wine, teddy bears and surprise hampers for wives, husbands, girlfriends. Pre-Valentine's Day orders, same-day delivery across Nairobi.",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Valentine's Gifts for Wife Nairobi",
      url: `${baseUrl}/blog/best-gifts-for-wives-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Valentine's Gifts for Husband Nairobi",
      url: `${baseUrl}/blog/best-gifts-for-men-nairobi`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Romantic Valentine's Flowers Nairobi",
      url: `${baseUrl}/collections/flowers`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Valentine's Chocolates Nairobi",
      url: `${baseUrl}/collections/chocolates`,
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Valentine's Wine Gifts Nairobi",
      url: `${baseUrl}/collections/wines`,
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "Valentine's Gift Hampers Nairobi",
      url: `${baseUrl}/collections/gift-hampers`,
    },
    {
      "@type": "ListItem",
      position: 7,
      name: "Valentine's Teddy Bears Nairobi",
      url: `${baseUrl}/collections/teddy-bears`,
    },
    {
      "@type": "ListItem",
      position: 8,
      name: "Pre-Valentine's Orders Nairobi",
      url: `${baseUrl}/contact`,
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

const valentinesFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best Valentine's gifts for my wife in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best Valentine's gifts for your wife in Nairobi include romantic roses, premium chocolate hampers, luxury wine, personalized teddy bears, and surprise gift baskets. We offer same-day delivery across Nairobi with beautiful arrangements starting from KES 3,500."
      }
    },
    {
      "@type": "Question",
      name: "Can I order Valentine's flowers for delivery in Nairobi same day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We offer same-day Valentine's flower delivery in Nairobi CBD. For areas outside CBD (Westlands, Karen, Lavington, Kilimani), we provide next-day delivery. Place your order before 2 PM for guaranteed Valentine's Day delivery."
      }
    },
    {
      "@type": "Question",
      name: "What should I gift my girlfriend for Valentine's Day in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For Valentine's Day in Nairobi, consider romantic red roses, premium Ferrero Rocher chocolates, cuddly teddy bears, personalized gift hampers, or luxury wine. We help you choose the perfect romantic gift with beautiful packaging and same-day delivery."
      }
    },
    {
      "@type": "Question",
      name: "Do you offer pre-Valentine's Day orders in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We accept pre-Valentine's Day orders in Nairobi. Early booking ensures you get the best selection and avoids Valentine's Day rush. Order now for guaranteed delivery on February 14th across all Nairobi areas."
      }
    },
    {
      "@type": "Question",
      name: "What are Valentine's chocolate hamper options in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our Valentine's chocolate hampers in Nairobi include premium Ferrero Rocher collections (8, 16, 24 pieces), gourmet chocolate baskets, and chocolate gift boxes. Perfect for romantic Valentine's surprises with same-day delivery available."
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${lato.variable} ${robotoMono.variable} ${dancingScript.variable} ${playfairDisplay.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(valentinesFaqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(flowerDeliveryItemListJsonLd) }}
        />
      </head>
      <body className={`${lato.className} flex flex-col min-h-screen`}>
        <GoogleAnalytics />
        <VisitorPing />
        <ErrorBoundary>
          <AnalyticsProvider>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Header />
            <main id="main-content" className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden">{children}</main>
            <Footer />
            <WhatsAppButton />
          </AnalyticsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
