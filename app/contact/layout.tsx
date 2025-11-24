import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://whispersfloralgifts.co.ke";

export const metadata: Metadata = {
  title: "Contact Us | Whispers Floral Gifts - Flower Delivery Nairobi",
  description:
    "Contact Whispers Floral Gifts for premium flower delivery Nairobi. Phone: +254721554393 / 0721554393, Email: whispersfloral@gmail.com. Same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Located in Nairobi.",
  keywords: [
    "contact Whispers Floral Gifts",
    "flower shop contact Nairobi",
    "florist phone number Nairobi",
    "flower delivery contact",
    "contact florist Nairobi CBD",
    "contact florist Westlands",
    "contact florist Karen",
  ],
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us | Whispers Floral Gifts - Flower Delivery Nairobi",
    description: "Contact Whispers Floral Gifts for premium flower delivery Nairobi. Same-day delivery available.",
    url: `${baseUrl}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Whispers Floral Gifts",
    description: "Contact Whispers Floral Gifts for premium flower delivery Nairobi. Same-day delivery available.",
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

