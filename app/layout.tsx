import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Montserrat, Lato, Roboto_Mono, Dancing_Script, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import VisitorPing from "@/components/VisitorPing";
import { GA_MEASUREMENT_ID, SHOP_INFO } from "@/lib/constants";

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
      "Urgent Flower Delivery Nairobi | Same-Day Roses & Gifts | M-Pesa Accepted | Floral Whispers Gifts",
    template: "%s | Floral Whispers Gifts - Urgent Nairobi Delivery",
  },
  description:
    "Order flowers online Nairobi with urgent same-day delivery. Fresh roses, gift hampers & more. M-Pesa payment ✓ CBD, Westlands, Kilimani delivery. Best prices guaranteed. Trusted by 1,000+ Nairobi customers.",
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
    "where to buy flowers in Nairobi",
    "how to send flowers Nairobi",
    "urgent flower delivery Nairobi",
    "last minute flowers Nairobi",
    "best florist Nairobi reviews",
    "flower delivery price Nairobi",
    "same day delivery cost Nairobi",
    "reliable flower delivery Nairobi",
    "flower delivery near me Nairobi",
    "order flowers online Nairobi",
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
        width: 676,
        height: 677,
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#ffffff",
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "150",
    bestRating: "5",
    worstRating: "1",
  },
  slogan: "Nairobi's Fastest Flower Delivery - Order Now, Deliver Today",
  description: "Urgent flower delivery service in Nairobi with fresh roses, gift hampers, and same-day delivery. M-Pesa payment accepted. Trusted by 1,000+ Nairobi customers for birthdays, anniversaries, and special occasions.",
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
  areaServed: [
    {
      "@type": "City",
      "name": "Nairobi",
      "description": "Same-day flower delivery available for orders placed before 2 PM"
    },
    {
      "@type": "Place",
      "name": "Nairobi CBD",
      "description": "Urgent flower delivery within 2 hours"
    },
    {
      "@type": "Place",
      "name": "Westlands",
      "description": "Same-day flower delivery service"
    },
    {
      "@type": "Place",
      "name": "Karen",
      "description": "Same-day flower delivery service"
    },
    {
      "@type": "Place",
      "name": "Kilimani",
      "description": "Same-day flower delivery service"
    },
    {
      "@type": "Place",
      "name": "Lavington",
      "description": "Same-day flower delivery service"
    },
    {
      "@type": "Country",
      "name": "Kenya",
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

const evergreenFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you deliver flowers same day in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We offer same-day flower delivery in Nairobi CBD for orders placed before 2 PM. For areas outside CBD including Westlands, Karen, Lavington, and Kilimani, we provide next-day delivery. All orders include beautiful packaging and reliable delivery service."
      }
    },
    {
      "@type": "Question",
      name: "How do I pay for flower delivery with M-Pesa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Payment is simple with M-Pesa! After selecting your flowers and gift items, proceed to checkout and select M-Pesa as your payment method. You'll receive a payment prompt to complete the transaction securely. We also accept cash and card payments for your convenience."
      }
    },
    {
      "@type": "Question",
      name: "What areas do you deliver to in Nairobi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We deliver across all major Nairobi areas including Nairobi CBD, Westlands, Karen, Lavington, Kilimani, Kileleshwa, Riverside, and surrounding neighborhoods. Same-day delivery available for CBD orders, next-day for other areas. Contact us for delivery to specific locations."
      }
    },
    {
      "@type": "Question",
      name: "What types of flowers and gifts do you offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer fresh flowers including red roses, pink roses, white flowers, and mixed bouquets. Our gift collection includes chocolate hampers, teddy bears, wines, gift baskets, and money bouquets. All items are carefully curated for quality and presentation."
      }
    },
    {
      "@type": "Question",
      name: "Can I customize flower arrangements for special occasions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! We specialize in custom flower arrangements for birthdays, anniversaries, corporate events, and special celebrations. Contact us with your preferences and we'll create a personalized arrangement with your choice of flowers, colors, and gift items."
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(evergreenFaqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(flowerDeliveryItemListJsonLd) }}
        />
      </head>
      <body className={`${lato.className} flex flex-col min-h-screen bg-green-100`}>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            var path = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '/';
            gtag('config', '${GA_MEASUREMENT_ID}', { page_path: path });
          `,
          }}
        />
        <VisitorPing />
        {/* Tawk.to live chat - left side so it doesn't block WhatsApp */}
        <Script id="tawk-to" strategy="afterInteractive">
          {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
Tawk_API.customStyle={visibility:{desktop:{position:'bl',xOffset:24,yOffset:24},mobile:{position:'bl',xOffset:16,yOffset:16}}};
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/69a8288364380e1c36b31457/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`}
        </Script>
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
