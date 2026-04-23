import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, getBlogTags } from "@/lib/blogData";
import JsonLd from "@/components/JsonLd";
import { format } from "date-fns";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "Nairobi Gift Ideas, Flower Delivery Tips & Occasion Guides | Floral Whispers Blog",
  description:
    "Gift ideas and flower guides for Nairobi — discover how to choose bouquets, hampers and teddy bears for every occasion. Floral Whispers Gifts Blog sharing delivery tips, gifting advice and Nairobi florist insights.",
  keywords: [
    // Valentine's Blog Keywords
    "valentine's gift guide nairobi",
    "valentine's flowers nairobi blog",
    "valentine's chocolates nairobi",
    "romantic valentine's gifts nairobi",
    "valentine's gift ideas kenya",
    "pre valentine's planning nairobi",
    "valentine's surprise gifts nairobi",
    "valentine's hampers nairobi",

    // Valentine's Relationship Advice
    "what to gift wife valentine's nairobi",
    "valentine's gifts for husband nairobi",
    "valentine's gifts for girlfriend nairobi",
    "valentine's gifts for mom nairobi",
    "romantic valentine's ideas nairobi",

    // Valentine's Content Types
    "valentine's flower arrangements nairobi",
    "valentine's chocolate hampers nairobi",
    "valentine's wine gifts nairobi",
    "valentine's teddy bears nairobi",

    // Valentine's Delivery & Planning
    "valentine's delivery nairobi guide",
    "pre valentine's orders nairobi",
    "valentine's day planning kenya",
    "same day valentine's delivery nairobi",

    // Valentine's Long-tail
    "complete guide to valentine's gifts nairobi",
    "best valentine's flower arrangements kenya",
    "romantic valentine's gift hampers nairobi",
    "valentine's day surprise packages nairobi",

    // Valentine's Seasonal
    "february valentine's gifts nairobi",
    "2025 valentine's guide nairobi",
    "love month gift ideas kenya",

    // Traditional blog keywords
    "flower blog nairobi",
    "gift ideas kenya",
    "nairobi florist blog",
  ],
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: "Nairobi Gift Ideas, Flower Delivery Tips & Occasion Guides | Floral Whispers Blog",
    description: "Nairobi gifting hub: flower hamper + wine ideas, period care gifts, proposal setups, birthday flowers and same-day delivery guides.",
    url: `${baseUrl}/blog`,
    siteName: "Floral Whispers Gifts",
    images: [
      {
        url: "/images/products/flowers/BouquetFlowers1.jpg",
        width: 1200,
        height: 630,
        alt: "Valentine's Gift Guide Nairobi - Floral Whispers Blog",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
};

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Nairobi Gift Ideas & Flower Delivery Blog - Floral Whispers Gifts",
  description: "Nairobi-focused gifting guides: flower hampers, wine pairings, period care packages, proposal ideas and same-day delivery tips.",
  url: `${baseUrl}/blog`,
  publisher: {
    "@type": "Organization",
    name: "Floral Whispers Gifts",
    url: baseUrl,
  },
};

export default async function BlogPage() {
  const allPosts = await getBlogPosts();
  const tags = await getBlogTags();

  return (
    <>
      <JsonLd data={blogJsonLd} />
      <div className="min-h-screen bg-white">
        {/* Page Title */}
        <div className="bg-white border-b border-brand-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-brand-gray-900 mb-4">
              Blog
            </h1>
            <p className="text-lg md:text-xl text-brand-gray-600 max-w-3xl">
              Nairobi gifting guides for flower hampers, wine pairings, period care packages,
              proposal setups, birthdays and same-day delivery. Use this hub to find ideas
              and order quickly on WhatsApp.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          <div className="rounded-2xl border border-[#F0E8E8] bg-[#FAF7F2] p-5 md:p-6">
            <h2 className="font-heading text-xl md:text-2xl text-[#2C2C2C] mb-3">
              Featured high-intent guides
            </h2>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[
                { href: "/flower-hamper-wine-nairobi", label: "Flower Hamper + Wine Nairobi" },
                { href: "/corporate-gift-hampers-nairobi", label: "Corporate Gift Hampers Nairobi" },
                { href: "/period-care-package-kenya", label: "Period Care Package Kenya" },
                { href: "/send-gifts-to-kenya", label: "Send Gifts to Kenya" },
                { href: "/same-day-delivery-nairobi", label: "Same-Day Delivery Nairobi" },
                { href: "/collections/gift-hampers", label: "Gift Hampers Nairobi" },
                { href: "/collections/flowers", label: "Flower Delivery Nairobi" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 hover:shadow-md transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts List */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="space-y-8 md:space-y-12">
            {allPosts.map((post) => (
              <article key={post.slug} className="border-b border-brand-gray-200 pb-8 md:pb-12 last:border-b-0">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {/* Image - Clickable */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex-shrink-0 w-full md:w-80 lg:w-96 h-64 md:h-80 overflow-hidden rounded-lg bg-brand-gray-100 group"
                  >
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={320}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 400px"
                      loading="lazy"
                      quality={85}
                    />
                  </Link>

                  {/* Content */}
                  <div className="flex-1">
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-brand-gray-900 mb-3 md:mb-4 hover:text-brand-green transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    <div className="flex items-center gap-3 text-sm text-brand-gray-600 mb-4">
                      <time dateTime={post.publishedAt}>
                        {format(new Date(post.publishedAt), "MMM d, yyyy")}
                      </time>
                    </div>

                    <p className="text-base md:text-lg text-brand-gray-700 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-brand-green font-medium hover:gap-2 transition-all group"
                    >
                      Read more
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Explore More Tags */}
          {tags.length > 0 && (
            <div className="mt-12 md:mt-16 pt-8 border-t border-brand-gray-200">
              <h3 className="font-heading font-semibold text-xl md:text-2xl text-brand-gray-900 mb-6">
                Explore more
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 10).map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-4 py-2 bg-brand-gray-100 hover:bg-brand-green hover:text-white text-brand-gray-700 text-sm rounded-md transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
