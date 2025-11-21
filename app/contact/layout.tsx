import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke";

export const metadata: Metadata = {
  title: "Contact Us | Floral Whispers Gifts - Flower Delivery Nairobi",
  description:
    "Contact Floral Whispers Gifts for premium flower delivery Nairobi. Phone: +2547221554393, Email: whispersfloral@gmail.com. Same-day delivery available. Located in Nairobi CBD.",
  keywords: [
    "contact Floral Whispers Gifts",
    "flower shop contact Nairobi",
    "florist phone number Nairobi",
    "flower delivery contact",
  ],
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us | Floral Whispers Gifts - Flower Delivery Nairobi",
    description: "Contact Floral Whispers Gifts for premium flower delivery Nairobi. Same-day delivery available.",
    url: `${baseUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Floral Whispers Gifts",
    description: "Contact Floral Whispers Gifts for premium flower delivery Nairobi.",
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

