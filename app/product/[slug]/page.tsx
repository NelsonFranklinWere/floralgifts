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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://whispersfloralgifts.co.ke";
  const productUrl = `${baseUrl}/product/${slug}`;
  const categoryKeywords: Record<string, string[]> = {
    flowers: ["flower delivery Nairobi", "roses Nairobi", "bouquet Nairobi", "flower delivery Nairobi CBD", "flower delivery Westlands", "flower delivery Karen", "flower delivery Lavington", "flower delivery Kilimani"],
    teddy: ["teddy bears Kenya", "teddy bear gift", "teddy bears Nairobi"],
    hampers: ["gift hampers Kenya", "luxury gift hampers Nairobi", "gift hampers Nairobi CBD", "gift hampers Westlands"],
    wines: ["wines Nairobi", "wine gift hampers Kenya", "wines Nairobi CBD", "wines Westlands"],
    chocolates: ["chocolates Kenya", "chocolate gift hampers Nairobi", "chocolates Nairobi CBD", "chocolates Westlands"],
  };

  return {
    title: `${product.title} | Whispers Floral Gifts - ${product.category === "flowers" ? "Flower Delivery Nairobi" : product.category === "teddy" ? "Teddy Bears Kenya" : product.category === "hampers" ? "Gift Hampers Kenya" : product.category === "wines" ? "Wines Nairobi" : "Chocolates Kenya"}`,
    description: `${product.short_description || product.description} - ${product.category === "flowers" ? "Premium flower delivery Nairobi" : product.category === "teddy" ? "Cuddly teddy bears Kenya" : product.category === "hampers" ? "Luxury gift hampers Kenya" : product.category === "wines" ? "Premium wines Nairobi" : "Premium chocolates Kenya"}. Same-day delivery available.`,
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
        alt: product.title,
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
      availability: product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
              <ImageGallery images={product.images} productName={product.title} />
            </div>

            <div>
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-4">
                {product.title}
              </h1>

              <div className="mb-6">
                <p className="font-mono font-semibold text-brand-green text-3xl mb-2">
                  {formatCurrency(product.price)}
                </p>
                {product.stock !== null && product.stock !== undefined && (
                  <p className="text-sm text-brand-gray-600">
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                  </p>
                )}
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

