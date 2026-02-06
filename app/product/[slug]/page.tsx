import { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import ProductDetailClient from "./ProductDetailClient";
import { getProductBySlug } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispersgifts.co.ke";
  const productUrl = `${baseUrl}/product/${slug}`;
  const categoryKeywords: Record<string, string[]> = {
    flowers: [
      // Valentine's Flowers Keywords
      "valentine's flowers Nairobi", "valentine's roses Nairobi", "romantic valentine's flowers Nairobi", "valentine's bouquet Nairobi", "valentine's money bouquet Nairobi",
      "valentine's flowers for wife Nairobi", "valentine's flowers for girlfriend Nairobi", "valentine's flowers for mom Nairobi",
      "pre valentine's flowers Nairobi", "valentine's flower delivery Nairobi", "same day valentine's flowers Nairobi",
      // Traditional Keywords
      "flower delivery Nairobi", "roses Nairobi", "bouquet Nairobi", "money bouquet Nairobi", "romantic flowers Nairobi", "surprise flowers Nairobi",
      "flower delivery Nairobi CBD", "flower delivery Westlands", "flower delivery Karen", "flower delivery Lavington", "flower delivery Kilimani"
    ],
    teddy: [
      // Valentine's Teddy Bears Keywords
      "valentine's teddy bears Nairobi", "valentine's cuddly teddy bears Nairobi", "romantic valentine's teddy bears Nairobi",
      "valentine's teddy bear for wife Nairobi", "valentine's teddy bear for girlfriend Nairobi", "valentine's teddy bear for mom Nairobi",
      "large valentine's teddy bears Nairobi", "big valentine's teddy bears Nairobi", "25cm valentine's teddy bear Nairobi",
      "pre valentine's teddy bears Nairobi", "valentine's teddy bear delivery Nairobi", "same day valentine's teddy bears Nairobi",
      // Traditional Keywords
      "teddy bears Kenya", "teddy bear gift", "teddy bears Nairobi", "best gifts for children Nairobi", "gifts for kids Nairobi"
    ],
    hampers: [
      // Valentine's Gift Hampers Keywords
      "valentine's gift hampers Nairobi", "valentine's luxury hampers Nairobi", "romantic valentine's hampers Nairobi",
      "valentine's hamper for wife Nairobi", "valentine's hamper for husband Nairobi", "valentine's hamper for girlfriend Nairobi",
      "valentine's chocolate hamper Nairobi", "valentine's wine hamper Nairobi", "valentine's flower hamper Nairobi",
      "pre valentine's hampers Nairobi", "valentine's hamper delivery Nairobi", "same day valentine's hampers Nairobi",
      // Traditional Keywords
      "gift hampers Kenya", "luxury gift hampers Nairobi", "corporate gift hampers Nairobi", "best gifts for men Nairobi", "best gifts for women Nairobi", "best gifts for colleagues Nairobi", "gift hampers Nairobi CBD", "gift hampers Westlands"
    ],
    wines: [
      // Valentine's Wine Keywords
      "valentine's wine gifts Nairobi", "valentine's wine hampers Nairobi", "romantic valentine's wines Nairobi",
      "valentine's wine for wife Nairobi", "valentine's wine for husband Nairobi", "valentine's wine for girlfriend Nairobi",
      "valentine's belaire brut Nairobi", "valentine's robertson red wine Nairobi", "valentine's rosso nobile red wine Nairobi",
      "pre valentine's wine gifts Nairobi", "valentine's wine delivery Nairobi", "same day valentine's wine Nairobi",
      // Traditional Keywords
      "wines Nairobi", "wine gift hampers Kenya", "corporate gifts Nairobi", "wines Nairobi CBD", "wines Westlands"
    ],
    chocolates: [
      // Valentine's Chocolates Keywords
      "valentine's chocolates Nairobi", "valentine's chocolate hampers Nairobi", "romantic valentine's chocolates Nairobi",
      "valentine's chocolates for wife Nairobi", "valentine's chocolates for girlfriend Nairobi", "valentine's chocolates for mom Nairobi",
      "valentine's ferrero rocher Nairobi", "premium valentine's chocolates Nairobi", "luxury valentine's chocolates Nairobi",
      "pre valentine's chocolates Nairobi", "valentine's chocolate delivery Nairobi", "same day valentine's chocolates Nairobi",
      // Traditional Keywords
      "chocolates Kenya", "chocolate gift hampers Nairobi", "corporate gifts Nairobi", "chocolates Nairobi CBD", "chocolates Westlands"
    ],
  };

  const categoryAltDescriptions: Record<string, string> = {
    flowers: "Premium flower delivery Nairobi CBD, Westlands, Karen",
    teddy: "Teddy bears Kenya, Nairobi gift delivery",
    hampers: "Gift hampers Kenya, Nairobi CBD delivery",
    wines: "Premium wines Nairobi, Westlands delivery",
    chocolates: "Chocolates Kenya, Nairobi gift delivery",
  };

  const imageAlt = `${product.title} - ${categoryAltDescriptions[product.category] || "Floral Whispers Gifts Nairobi"}`;

  return {
    title: `${product.title} | Valentine's ${product.category === "flowers" ? "Flowers" : product.category === "teddy" ? "Teddy Bears" : product.category === "hampers" ? "Gift Hampers" : product.category === "wines" ? "Wine Gifts" : "Chocolates"} Nairobi | Floral Whispers Gifts`,
    description: `${product.short_description || product.description} - Perfect Valentine's gift for your wife, husband, or girlfriend. Pre-Valentine's orders, same-day delivery Nairobi CBD, Westlands, Karen, Lavington, Kilimani. Order online with M-Pesa.`,
    keywords: categoryKeywords[product.category] || [],
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: product.title,
      description: product.short_description || product.description,
      url: productUrl,
      images: product.images.length > 0 ? product.images.map(img => ({
        url: img.startsWith("http") ? img : `${baseUrl}${img}`,
        width: 1200,
        height: 630,
        alt: imageAlt,
      })) : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.short_description || product.description,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://floralwhispers.co.ke";
  const productUrl = `${baseUrl}/product/${product.slug}`;
  const categoryMap: Record<string, string> = {
    flowers: "Florist",
    teddy: "Toy",
    hampers: "Gift",
    wines: "Wine",
    chocolates: "Food",
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
        name: "Collections",
        item: `${baseUrl}/collections`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category === "flowers" ? "Flowers" : product.category === "teddy" ? "Teddy Bears" : product.category === "hampers" ? "Gift Hampers" : product.category === "wines" ? "Wines" : "Chocolates",
        item: `${baseUrl}/collections/${product.category === "flowers" ? "flowers" : product.category === "teddy" ? "teddy-bears" : product.category === "hampers" ? "gift-hampers" : product.category === "wines" ? "wines" : "chocolates"}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.title,
        item: productUrl,
      },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    name: product.title,
    description: product.description || product.short_description,
    image: product.images.map(img => img.startsWith("http") ? img : `${baseUrl}${img}`),
    category: categoryMap[product.category] || "Product",
    brand: {
      "@type": "Brand",
      name: "Floral Whispers Gifts",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "KES",
      price: product.price / 100,
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      seller: {
        "@type": "Organization",
        name: "Floral Whispers Gifts",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "0",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <ImageGallery images={product.images} productName={product.title} category={product.category} />
            </div>

            <div>
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-4">
                {product.title}
              </h1>

              <div className="mb-6">
                <p className="font-mono font-semibold text-brand-green text-3xl mb-2">
                  {formatCurrency(product.price)}
                </p>
              </div>

              {product.short_description && (
                <p className="text-brand-gray-700 mb-6 text-lg">{product.short_description}</p>
              )}

              {product.description && (
                <div className="mb-6">
                  <h2 className="font-heading font-semibold text-xl mb-3">Description</h2>
                  <div
                    className="text-brand-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, "<br />") }}
                  />
                </div>
              )}

              {product.category === "teddy" && (
                <div className="mb-6 space-y-2">
                  {product.teddy_size && (
                    <p className="text-brand-gray-700">
                      <span className="font-semibold">Size:</span> {product.teddy_size} cm
                    </p>
                  )}
                  {product.teddy_color && (
                    <p className="text-brand-gray-700">
                      <span className="font-semibold">Color:</span>{" "}
                      {product.teddy_color.charAt(0).toUpperCase() + product.teddy_color.slice(1)}
                    </p>
                  )}
                </div>
              )}

              {product.category === "hampers" && product.included_items && product.included_items.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-heading font-semibold text-xl mb-3">Included Items</h2>
                  <ul className="space-y-2">
                    {product.included_items.map((item, index) => (
                      <li key={index} className="text-brand-gray-700">
                        {item.qty}x {item.name}
                        {item.note && <span className="text-brand-gray-500"> ({item.note})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ProductDetailClient product={product} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

