import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SHOP_INFO } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";

export const metadata: Metadata = {
  title: "About Floral Whispers Gifts | Nairobi's Top Valentine's Florist | 5+ Years Experience, 25K+ Orders Delivered",
  description:
    "Nairobi's trusted Valentine's florist: premium romantic flowers, luxury hampers, teddy bears for wife, husband, girlfriend. 5+ years experience, 25K+ Valentine's orders delivered. Same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani.",
  keywords: [
    // Valentine's Florist Reputation
    "valentine's florist Nairobi",
    "best valentine's florist Nairobi",
    "nairobi valentine's flower shop",
    "premium valentine's florist Kenya",
    "trusted valentine's florist Nairobi",

    // Valentine's Experience & Reputation
    "experienced valentine's florist Nairobi",
    "nairobi florist valentine's day",
    "valentine's flower delivery expert Nairobi",
    "professional valentine's florist Kenya",
    "reliable valentine's gifts Nairobi",

    // Valentine's Customer Base
    "valentine's florist for wives Nairobi",
    "valentine's florist for husbands Nairobi",
    "valentine's florist for girlfriends Nairobi",
    "romantic florist Nairobi Kenya",
    "valentine's surprise florist Nairobi",

    // Valentine's Service Areas
    "valentine's florist CBD Nairobi",
    "valentine's florist Westlands",
    "valentine's florist Karen Nairobi",
    "valentine's florist Lavington",
    "valentine's florist Kilimani",

    // Valentine's Reputation Keywords
    "top rated valentine's florist Nairobi",
    "best valentine's flower delivery Nairobi",
    "trusted valentine's gift shop Kenya",
    "experienced valentine's florist Nairobi",

    // Valentine's Long-tail
    "nairobi's most trusted valentine's florist",
    "professional valentine's flower arrangements Nairobi",
    "experienced romantic gifts florist Kenya",
    "nairobi valentine's day flower experts",

    // Valentine's Seasonal
    "february valentine's florist Nairobi",
    "2025 valentine's florist Nairobi",
    "love month florist Nairobi Kenya",

    // Keeping some traditional keywords
    "florist Nairobi",
    "flower shop Nairobi",
    "about Whispers Floral Gifts",
    "premium flowers Nairobi",
  ],
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: "About Floral Whispers Gifts | Nairobi's Top Valentine's Florist | 5+ Years Experience, 25K+ Orders Delivered",
    description: "Nairobi's trusted Valentine's florist: premium romantic flowers, luxury hampers, teddy bears for wife, husband, girlfriend. 5+ years experience, 25K+ Valentine's orders delivered.",
    url: `${baseUrl}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Floral Whispers Gifts | Nairobi's Top Valentine's Florist",
    description: "Nairobi's trusted Valentine's florist: premium romantic flowers, luxury hampers, teddy bears for wife, husband, girlfriend. 5+ years experience, 25K+ Valentine's orders delivered.",
  },
};

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
      name: "About Us",
      item: `${baseUrl}/about`,
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <div className="py-12 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-brand-gray-900 mb-4">
            About Floral Whispers Gifts
          </h1>
          <p className="text-brand-gray-600 text-lg max-w-2xl mx-auto">
            Spreading beauty, joy, and heartfelt moments across Nairobi and beyond
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          {/* Statistics Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-12">
            <div className="text-center card p-3 md:p-6">
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-brand-green mb-1 md:mb-2">10K+</div>
              <div className="text-brand-gray-600 font-medium text-xs md:text-base">Happy Customers</div>
            </div>
            <div className="text-center card p-3 md:p-6">
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-brand-green mb-1 md:mb-2">25K+</div>
              <div className="text-brand-gray-600 font-medium text-xs md:text-base">Orders Delivered</div>
            </div>
            <div className="text-center card p-3 md:p-6">
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-brand-green mb-1 md:mb-2">5+</div>
              <div className="text-brand-gray-600 font-medium text-xs md:text-base">Years Experience</div>
            </div>
            <div className="text-center card p-3 md:p-6">
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-brand-green mb-1 md:mb-2">98%</div>
              <div className="text-brand-gray-600 font-medium text-xs md:text-base">Satisfaction Rate</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center mb-12">
            <div className="order-2 md:order-1">
              <Image
                src="/images/products/flowers/BouquetFlowers1.jpg"
                alt="Floral Whispers Gifts - Premium flower arrangements Nairobi"
                width={600}
                height={400}
                className="rounded-lg shadow-card w-full h-auto"
                loading="lazy"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900 mb-3 md:mb-4">
                Our Story
              </h2>
              <p className="text-brand-gray-700 mb-3 md:mb-4 text-sm md:text-base">
                Floral Whispers Gifts was born from a passion for bringing beauty and joy into
                people&apos;s lives. We believe that every occasion deserves a special touch, whether
                it&apos;s a birthday, anniversary, graduation, or simply a gesture of love.
              </p>
              <p className="text-brand-gray-700 text-sm md:text-base">
                Based in Nairobi, Kenya, we specialize in premium flower arrangements, luxury gift
                hampers, wines, chocolates, and cuddly teddy bears that make every moment memorable.
              </p>
            </div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-3 gap-2 md:gap-6 mb-12">
            <div className="card p-2 md:p-6 text-center">
              <div className="text-2xl md:text-4xl mb-2 md:mb-4">🎯</div>
              <h3 className="font-heading font-bold text-xs md:text-xl text-brand-gray-900 mb-1 md:mb-3">Our Mission</h3>
              <p className="text-brand-gray-700 text-[10px] md:text-sm leading-tight md:leading-normal">
                To spread joy and create unforgettable moments through beautiful, thoughtfully curated gifts that express your emotions perfectly.
              </p>
            </div>
            <div className="card p-2 md:p-6 text-center">
              <div className="text-2xl md:text-4xl mb-2 md:mb-4">✨</div>
              <h3 className="font-heading font-bold text-xs md:text-xl text-brand-gray-900 mb-1 md:mb-3">Our Vision</h3>
              <p className="text-brand-gray-700 text-[10px] md:text-sm leading-tight md:leading-normal">
                To become Kenya&apos;s most trusted and beloved gift delivery service, known for excellence, reliability, and heartfelt service.
              </p>
            </div>
            <div className="card p-2 md:p-6 text-center">
              <div className="text-2xl md:text-4xl mb-2 md:mb-4">💚</div>
              <h3 className="font-heading font-bold text-xs md:text-xl text-brand-gray-900 mb-1 md:mb-3">Our Values</h3>
              <p className="text-brand-gray-700 text-[10px] md:text-sm leading-tight md:leading-normal">
                Quality, reliability, customer care, and attention to detail guide everything we do. Your happiness is our success.
              </p>
            </div>
          </div>

          <div className="bg-brand-gray-50 rounded-lg p-4 md:p-8 mb-12">
            <h2 className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-brand-gray-700 text-base md:text-lg mb-6 text-center max-w-3xl mx-auto">
              Same-day delivery in Nairobi means your perfect gift is just one click away. Don&apos;t wait—make someone&apos;s day extraordinary today!
            </p>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h3 className="font-heading font-semibold text-base md:text-xl text-brand-green mb-2">
                  Same-Day Delivery
                </h3>
                <p className="text-brand-gray-700 text-sm md:text-base">
                  Free same-day delivery within Nairobi CBD. Outside CBD, we deliver within 24 hours at a nominal fee. Fast, reliable service you can count on.
                </p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base md:text-xl text-brand-green mb-2">
                  Premium Quality
                </h3>
                <p className="text-brand-gray-700 text-sm md:text-base">
                  We source only the finest flowers and curate gift hampers with care, ensuring
                  every product meets our high standards.
                </p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base md:text-xl text-brand-green mb-2">
                  Nationwide Delivery
                </h3>
                <p className="text-brand-gray-700 text-sm md:text-base">
                  Beyond Nairobi, we deliver across Kenya within 24 hours. Your gifts reach loved
                  ones anywhere in the country.
                </p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base md:text-xl text-brand-green mb-2">
                  Trusted Service
                </h3>
                <p className="text-brand-gray-700 text-sm md:text-base">
                  Thousands of satisfied customers trust us for their special occasions. We&apos;re
                  committed to excellence in every delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <h2 className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900 mb-4 md:mb-6 text-center">
              What Our Customers Say
            </h2>
            <div className="overflow-hidden">
              <div className="marquee flex gap-4 md:gap-6">
                {/* First set of testimonials */}
                <div className="card p-4 md:p-6 flex-shrink-0 w-[280px] md:w-[320px]">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex text-yellow-400 text-sm md:text-base">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-brand-gray-700 mb-3 md:mb-4 text-xs md:text-sm italic">
                    &quot;Absolutely stunning flowers! They arrived fresh and exactly as pictured. Made my mom&apos;s birthday extra special. Highly recommend!&quot;
                  </p>
                  <p className="font-semibold text-brand-gray-900 text-xs md:text-sm">- Sarah M.</p>
                </div>
                <div className="card p-4 md:p-6 flex-shrink-0 w-[280px] md:w-[320px]">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex text-yellow-400 text-sm md:text-base">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-brand-gray-700 mb-3 md:mb-4 text-xs md:text-sm italic">
                    &quot;The gift hamper was beautifully curated and delivered on time. Customer service was excellent throughout. Will definitely order again!&quot;
                  </p>
                  <p className="font-semibold text-brand-gray-900 text-xs md:text-sm">- James K.</p>
                </div>
                <div className="card p-4 md:p-6 flex-shrink-0 w-[280px] md:w-[320px]">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex text-yellow-400 text-sm md:text-base">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-brand-gray-700 mb-3 md:mb-4 text-xs md:text-sm italic">
                    &quot;Same-day delivery worked perfectly! The teddy bear was so soft and the flowers were fresh. Thank you for making our anniversary special!&quot;
                  </p>
                  <p className="font-semibold text-brand-gray-900 text-xs md:text-sm">- Mary W.</p>
                </div>
                {/* Duplicate set for seamless loop */}
                <div className="card p-4 md:p-6 flex-shrink-0 w-[280px] md:w-[320px]">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex text-yellow-400 text-sm md:text-base">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-brand-gray-700 mb-3 md:mb-4 text-xs md:text-sm italic">
                    &quot;Absolutely stunning flowers! They arrived fresh and exactly as pictured. Made my mom&apos;s birthday extra special. Highly recommend!&quot;
                  </p>
                  <p className="font-semibold text-brand-gray-900 text-xs md:text-sm">- Sarah M.</p>
                </div>
                <div className="card p-4 md:p-6 flex-shrink-0 w-[280px] md:w-[320px]">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex text-yellow-400 text-sm md:text-base">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-brand-gray-700 mb-3 md:mb-4 text-xs md:text-sm italic">
                    &quot;The gift hamper was beautifully curated and delivered on time. Customer service was excellent throughout. Will definitely order again!&quot;
                  </p>
                  <p className="font-semibold text-brand-gray-900 text-xs md:text-sm">- James K.</p>
                </div>
                <div className="card p-4 md:p-6 flex-shrink-0 w-[280px] md:w-[320px]">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex text-yellow-400 text-sm md:text-base">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-brand-gray-700 mb-3 md:mb-4 text-xs md:text-sm italic">
                    &quot;Same-day delivery worked perfectly! The teddy bear was so soft and the flowers were fresh. Thank you for making our anniversary special!&quot;
                  </p>
                  <p className="font-semibold text-brand-gray-900 text-xs md:text-sm">- Mary W.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900 mb-3 md:mb-4">
              Our Promise
            </h2>
            <p className="text-brand-gray-700 mb-3 md:mb-4 text-sm md:text-base">
              At Floral Whispers Gifts, we don&apos;t just sell flowers and gifts—we create
              experiences. Every bouquet is carefully arranged, every hamper thoughtfully curated,
              and every teddy bear chosen to bring a smile.
            </p>
            <p className="text-brand-gray-700 mb-4 md:mb-6 text-sm md:text-base">
              We understand that your gifts carry your emotions, so we ensure they arrive fresh,
              beautiful, and on time. Whether you&apos;re celebrating a milestone, expressing
              gratitude, or simply showing someone you care, we&apos;re here to help you make it
              special.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
              <div className="flex items-start gap-2 md:gap-3">
                <div className="text-xl md:text-2xl flex-shrink-0">🌹</div>
                <div>
                  <h4 className="font-semibold text-brand-gray-900 mb-1 text-sm md:text-base">Fresh & Premium</h4>
                  <p className="text-brand-gray-600 text-xs md:text-sm">Only the freshest flowers and highest quality products</p>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <div className="text-xl md:text-2xl flex-shrink-0">🚚</div>
                <div>
                  <h4 className="font-semibold text-brand-gray-900 mb-1 text-sm md:text-base">Fast Delivery</h4>
                  <p className="text-brand-gray-600 text-xs md:text-sm">Free same-day delivery in Nairobi CBD. Outside CBD: 24-hour delivery at a fee. Nationwide delivery also available.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <div className="text-xl md:text-2xl flex-shrink-0">💳</div>
                <div>
                  <h4 className="font-semibold text-brand-gray-900 mb-1 text-sm md:text-base">Easy Payment</h4>
                  <p className="text-brand-gray-600 text-xs md:text-sm">MPESA and WhatsApp payment options available</p>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <div className="text-xl md:text-2xl flex-shrink-0">🎁</div>
                <div>
                  <h4 className="font-semibold text-brand-gray-900 mb-1 text-sm md:text-base">Gift Wrapping</h4>
                  <p className="text-brand-gray-600 text-xs md:text-sm">Beautiful gift wrapping and personalized messages included</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-gray-200 pt-6 md:pt-8">
            <h2 className="font-heading font-bold text-xl md:text-2xl text-brand-gray-900 mb-3 md:mb-4">
              Visit Us
            </h2>
            <div className="space-y-2 text-brand-gray-700 text-sm md:text-base mb-6">
              <p>
                <span className="font-semibold">Location:</span> {SHOP_INFO.address}
              </p>
              <p>
                <span className="font-semibold">Hours:</span> {SHOP_INFO.hours}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <a href={`tel:+${SHOP_INFO.phone}`} className="text-brand-green hover:underline">
                  +{SHOP_INFO.phone}
                </a>
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href={`mailto:${SHOP_INFO.email}`}
                  className="text-brand-green hover:underline break-all"
                >
                  {SHOP_INFO.email}
                </a>
              </p>
            </div>
            <a
              href={`tel:+${SHOP_INFO.phone}`}
              className="btn-primary inline-block"
            >
              Call Us
            </a>
          </div>

          <div className="mt-12 text-center">
            <Link href="/collections" className="btn-primary inline-block">
              Browse Our Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

