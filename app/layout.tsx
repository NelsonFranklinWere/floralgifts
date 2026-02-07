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
      "Best Valentine's Gifts Nairobi | Romantic Flowers, Chocolates & Gift Hampers | Floral Whispers Gifts",
    template: "%s | Floral Whispers Gifts Nairobi",
  },
  description:
    "Best Valentine's gifts Nairobi: romantic flowers, premium chocolates, wine, teddy bears & surprise hampers for your wife, husband, girlfriend. Pre-Valentine's Day orders, same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Order online with M-Pesa.",
  keywords: [
    // Valentine's Day Priority Keywords
    "valentine's gifts Nairobi",
    "valentine's day gifts Kenya",
    "best valentine's gifts for wife Nairobi",
    "valentine's gifts for husband Nairobi",
    "valentine's gifts for girlfriend Nairobi",
    "romantic valentine's gifts Nairobi",
    "surprise valentine's gifts Nairobi",
    "pre valentine's day gifts Nairobi",
    "valentine's flowers Nairobi",
    "valentine's chocolates Nairobi",
    "valentine's wine gifts Nairobi",
    "valentine's teddy bears Nairobi",
    "valentine's gift hampers Nairobi",
    "valentine's cards Nairobi",

    // Valentine's Relationship Searches
    "what to gift my wife on valentine's day Nairobi",
    "valentine's gift for my husband Nairobi",
    "valentine's surprise for girlfriend Nairobi",
    "best valentine's gift for mom Nairobi",
    "valentine's gift for dad Nairobi",
    "valentine's gifts for couples Nairobi",
    "romantic gifts for wife valentine's Nairobi",
    "gifts to surprise husband valentine's Nairobi",
    "valentine's day gifts for her Nairobi",
    "valentine's day gifts for him Nairobi",

    // Valentine's Planning & Timing
    "pre valentine's orders Nairobi",
    "early valentine's gifts Nairobi",
    "plan valentine's surprise Nairobi",
    "valentine's day preparation Nairobi",
    "book valentine's gifts early Nairobi",
    "same day valentine's gifts Nairobi",
    "last minute valentine's gifts Nairobi",
    "urgent valentine's delivery Nairobi",

    // Valentine's AI Search Patterns
    "where to buy valentine's gifts Nairobi",
    "best florist for valentine's Nairobi",
    "valentine's gift ideas Nairobi",
    "how to surprise partner valentine's Nairobi",
    "valentine's romantic gestures Nairobi",
    "affordable valentine's gifts Nairobi",
    "luxury valentine's gifts Nairobi",

    // Valentine's Voice Search
    "find valentine's gifts near me Nairobi",
    "valentine's florist near me Kenya",
    "order valentine's flowers online Nairobi",
    "valentine's gift delivery near me",

    // Valentine's Long-tail Keywords
    "beautiful valentine's flower arrangements Nairobi",
    "personalized valentine's gift hampers Nairobi",
    "romantic valentine's surprise packages Nairobi",
    "valentine's day luxury gifts Nairobi",
    "thoughtful valentine's presents Nairobi",
    "memorable valentine's gifts Nairobi",
    "unique valentine's gift ideas Nairobi",

    // Valentine's Seasonal Keywords
    "2025 valentine's gifts Nairobi",
    "february valentine's gifts Nairobi",
    "love month gifts Nairobi Kenya",

    // Valentine's Corporate & Business
    "corporate valentine's gifts Nairobi",
    "valentine's team gifts Nairobi",
    "office valentine's celebrations Nairobi",

    // Existing core services
    "best gifts for men Nairobi",
    "best gifts for wives Nairobi",
    "best gifts for couples Nairobi",
    "best gifts for children Nairobi",
    "best gifts for colleagues Nairobi",
    "surprise gifts for wife Nairobi",
    "money bouquet Nairobi",
    "money bouquet Kenya",
    "flowers Nairobi",
    "flower delivery Nairobi",
    "same-day flower delivery Nairobi",
    "gift hampers Nairobi",
    "corporate gifts Nairobi",
    "birthday flowers Nairobi",
    "anniversary flowers Kenya",
    "romantic flowers Nairobi",
    "florist Nairobi",
    
    // AI Search: Conversational/Question-based keywords
    "where to buy flowers in Nairobi",
    "how to send flowers in Nairobi",
    "what are the best flower shops in Nairobi",
    "where can I get same day flower delivery",
    "how much does flower delivery cost in Nairobi",
    "what is a money bouquet",
    "where to buy money bouquet in Kenya",
    "how to surprise someone with flowers Nairobi",
    "what flowers are good for birthdays",
    "where to get corporate gifts in Nairobi",
    "how to order flowers online in Kenya",
    "what are the best romantic gifts in Nairobi",
    "where to buy teddy bears in Nairobi",
    "how to send gifts to someone in Nairobi",
    "what are good anniversary gifts",
    
    // AI Search: Natural language patterns
    "I need flowers delivered today in Nairobi",
    "looking for flower delivery near me Nairobi",
    "want to send flowers to girlfriend Nairobi",
    "need gift hampers for office colleagues",
    "searching for money bouquet services Kenya",
    "require same day gift delivery Nairobi",
    "looking for romantic surprise ideas Nairobi",
    "need corporate gifts for employees Kenya",
    "want fresh flowers delivered Westlands",
    "searching for birthday gift ideas Nairobi",
    
    // AI Search: Intent-based keywords
    "urgent flower delivery Nairobi",
    "emergency gift delivery Kenya",
    "last minute flowers Nairobi",
    "express flower delivery CBD",
    "quick gift delivery Westlands",
    "instant flower ordering Nairobi",
    "fast gift hampers delivery Karen",
    "immediate flower service Lavington",
    "rush delivery flowers Kilimani",
    "priority gift delivery Nairobi",
    
    // AI Search: Semantic search optimization
    "premium florist services Nairobi",
    "luxury flower arrangements Kenya",
    "artisan gift hampers Nairobi",
    "bespoke floral designs Kenya",
    "curated gift collections Nairobi",
    "handcrafted flower bouquets Kenya",
    "personalized gift services Nairobi",
    "custom flower arrangements Kenya",
    "exclusive gift hampers Nairobi",
    "boutique flower shop Kenya",
    
    // Voice search optimization
    "flower delivery near me Nairobi",
    "find florist near me Kenya",
    "money bouquet services near me",
    "same day flower delivery near me",
    "gift delivery near me Nairobi",
    
    // Location-specific existing keywords
    "flower delivery Westlands",
    "flower delivery Karen",
    "flower delivery Lavington",
    "flower delivery Kilimani",
    "Nairobi CBD flower delivery",
    "roses Nairobi",
    "bouquet delivery Nairobi",
    "online flower shop Nairobi",
    "M-Pesa flower delivery Nairobi",
    "teddy bears Nairobi",
    "wedding flowers Nairobi",
    "funeral wreaths Nairobi",
    "sympathy flowers Nairobi",
    "graduation flowers Nairobi",
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
      "Best Valentine's Gifts Nairobi | Romantic Flowers, Chocolates & Gift Hampers | Floral Whispers Gifts",
    description:
      "Best Valentine's gifts Nairobi: romantic flowers, premium chocolates, wine, teddy bears & surprise hampers for your wife, husband, girlfriend, mom, dad. Pre-Valentine's Day orders, same-day delivery across Nairobi.",
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
      "Best Valentine's Gifts Nairobi | Romantic Flowers, Chocolates & Gift Hampers | Floral Whispers Gifts",
    description:
      "Best Valentine's gifts Nairobi: romantic flowers, premium chocolates, wine, teddy bears & surprise hampers for your wife, husband, girlfriend, mom, dad. Pre-Valentine's Day orders, same-day delivery across Nairobi.",
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
