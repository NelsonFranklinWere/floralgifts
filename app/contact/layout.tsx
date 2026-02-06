import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Contact Floral Whispers Gifts | Valentine's Orders & Same-Day Delivery Nairobi | Phone: +254721554393",
  description:
    "Contact Floral Whispers Gifts for Valentine's orders & premium flower delivery Nairobi. Phone: +254721554393 / 0721554393, Email: whispersfloral@gmail.com. Pre-Valentine's bookings, same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani.",
  keywords: [
    // Valentine's Contact Keywords
    "contact valentine's florist Nairobi",
    "valentine's orders contact Nairobi",
    "pre valentine's booking Nairobi",
    "valentine's delivery contact Nairobi",
    "valentine's florist phone Nairobi",

    // Valentine's Ordering
    "order valentine's flowers Nairobi",
    "book valentine's gifts Nairobi",
    "valentine's delivery booking Nairobi",
    "reserve valentine's flowers Nairobi",
    "plan valentine's surprise Nairobi",

    // Valentine's Contact Information
    "valentine's florist phone number Nairobi",
    "contact floral whispers valentine's",
    "valentine's gift shop contact Nairobi",
    "valentine's delivery contact number",

    // Valentine's Delivery Areas
    "valentine's delivery CBD Nairobi",
    "valentine's flowers Westlands contact",
    "valentine's gifts Karen delivery",
    "valentine's flowers Lavington",
    "valentine's gifts Kilimani",

    // Valentine's AI Search
    "how to order valentine's flowers Nairobi",
    "where to contact valentine's florist Nairobi",
    "valentine's delivery phone number Nairobi",
    "best florist contact valentine's Nairobi",

    // Valentine's Voice Search
    "call valentine's florist near me Nairobi",
    "contact florist for valentine's Nairobi",
    "phone number valentine's delivery Nairobi",

    // Valentine's Long-tail
    "contact floral whispers for valentine's day orders",
    "nairobi florist contact for romantic gifts",
    "valentine's day flower delivery booking Nairobi",

    // Valentine's Seasonal
    "february valentine's contact Nairobi",
    "2025 valentine's florist contact",
    "love month delivery contact Nairobi Kenya",
  ],
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: "Contact Floral Whispers Gifts | Valentine's Orders & Same-Day Delivery Nairobi",
    description: "Contact Floral Whispers Gifts for Valentine's orders & premium flower delivery Nairobi. Pre-Valentine's bookings, same-day delivery across Nairobi.",
    url: `${baseUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Floral Whispers Gifts | Valentine's Orders",
    description: "Contact Floral Whispers Gifts for Valentine's orders & premium flower delivery Nairobi. Pre-Valentine's bookings, same-day delivery across Nairobi.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact Us",
        item: `${baseUrl}/contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}

