import { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";
import ProductDetailClient from "./ProductDetailClient";
import ProductCard from "@/components/ProductCard";
import BackButton from "@/components/BackButton";
import ProductSchema from "@/components/seo/ProductSchema";
import { getProductBySlug, getProducts, type Product } from "@/lib/db";
import { getPredefinedProducts } from "@/lib/predefinedProducts";
import { formatCurrency } from "@/lib/utils";
import { supabaseAdmin } from "@/lib/supabase";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  buildProductMetaDescription,
  cleanProductTitle,
} from "@/lib/seo/product-title";
import { getCategorySeasonalKeywords } from "@/lib/seo/seasonal-config";
import { SEO_BASE_URL } from "@/lib/seo/base";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductWithFallback(slug: string): Promise<Product | null> {
  const dbProduct = await getProductBySlug(slug);
  if (dbProduct) return dbProduct;

  // Fallback to predefined products (flowers, hampers, wines, chocolates, cards)
  const fallbackLists = [
    getPredefinedProducts("flowers"),
    getPredefinedProducts("hampers"),
    getPredefinedProducts("wines"),
    getPredefinedProducts("chocolates"),
    getPredefinedProducts("cards"),
    getPredefinedProducts("cakes"),
  ];

  const allFallback = fallbackLists.flat();
  return allFallback.find((p) => p.slug === slug) || null;
}

export async function generateStaticParams() {
  try {
    const { data } = await (supabaseAdmin.from("products") as any).select("slug");
    if (!data) return [];
    return (data as Array<{ slug: string }>).map((p) => ({ slug: p.slug }));
  } catch(err) {
    console.error("Error generating params", err)//to log in the error since products are loaded in real-time only when one is online
    return [];

  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductWithFallback(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const cleanName = cleanProductTitle(product.title);
  const description = buildProductMetaDescription(product);
  const seasonal = getCategorySeasonalKeywords(product.category);

  return buildPageMetadata({
    title: cleanName,
    description,
    path: `/product/${slug}`,
    keywords: seasonal,
    ogImage:
      product.images[0]?.startsWith("http")
        ? product.images[0]
        : product.images[0]
          ? `${SEO_BASE_URL}${product.images[0]}`
          : undefined,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductWithFallback(slug);

  if (!product) {
    notFound();
  }

  const dbRelated = await getProducts({ category: product.category });
  const fallbackRelated = getPredefinedProducts(product.category);
  const relatedCandidates = [...dbRelated, ...fallbackRelated]
    .filter((p) => p.slug !== product.slug)
    .filter((p) => p.category === product.category);

  const seen = new Set<string>();
  const relatedProducts = relatedCandidates
    .filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .slice(0, 8);

  const collectionSlug =
    product.category === "flowers"
      ? "flowers"
      : product.category === "teddy"
        ? "teddy-bears"
        : product.category === "hampers"
          ? "gift-hampers"
          : product.category === "wines"
            ? "wines"
            : product.category === "chocolates"
              ? "chocolates"
              : product.category === "cards"
                ? "cards"
                : "cakes";

  const collectionName =
    product.category === "flowers"
      ? "Flowers"
      : product.category === "teddy"
        ? "Teddy Bears"
        : product.category === "hampers"
          ? "Gift Hampers"
          : product.category === "wines"
            ? "Wines"
            : product.category === "chocolates"
              ? "Chocolates"
              : product.category === "cards"
                ? "Gift Cards"
                : "Cakes";

  const displayTitle = cleanProductTitle(product.title);

  return (
    <>
      <ProductSchema
        slug={product.slug}
        title={displayTitle}
        description={product.description}
        short_description={product.short_description}
        images={product.images}
        price={product.price}
        category={product.category}
        stock={(product as { stock?: number }).stock}
        sku={(product as { sku?: string }).sku}
        id={product.id}
        collectionPath={`/collections/${collectionSlug}`}
        collectionName={collectionName}
      />
      <div className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <BackButton
              label="Back"
              fallbackHref={`/collections/${collectionSlug}`}
              className="btn-outline text-xs sm:text-sm py-1.5 px-3"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <ImageGallery images={product.images} productName={displayTitle} category={product.category} />
            </div>

            <div>
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-gray-900 mb-4">
                {displayTitle}
              </h1>

              <div className="mb-6">
                <p className="font-mono font-semibold text-brand-red text-3xl mb-2">
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

          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="font-heading font-semibold text-lg sm:text-xl text-brand-gray-900 mb-4">
                More products
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.slug}
                    id={p.id}
                    name={p.title}
                    price={p.price}
                    image={p.images?.[0] || ""}
                    slug={p.slug}
                    shortDescription={p.short_description || ""}
                    category={p.category}
                    hideDetailsButton
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

