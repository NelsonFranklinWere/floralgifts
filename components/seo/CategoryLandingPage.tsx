import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import JsonLdScript from "@/components/seo/JsonLdScript";
import { getProducts } from "@/lib/db";
import { SHOP_INFO } from "@/lib/constants";
import { getCategoryPage } from "@/lib/seo/category-pages";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

export function categoryMetadata(slug: string): Metadata {
  const page = getCategoryPage(slug);
  return buildPageMetadata({ title: page.title, description: page.description, path: `/${slug}` });
}

export default async function CategoryLandingPage({ slug }: { slug: string }) {
  const page = getCategoryPage(slug);
  const all = await getProducts({});
  const products = page.productSlugs
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const whatsapp = `https://wa.me/${SHOP_INFO.whatsapp}?text=${encodeURIComponent(page.whatsappMessage)}`;

  return (
    <section className="py-10 md:py-14 bg-[#FAF7F2]">
      <JsonLdScript
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: page.h1, path: `/${slug}` },
        ])}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl md:text-4xl text-[#2C2C2C] mb-4">{page.h1}</h1>
        <p className="text-gray-700 text-base md:text-lg max-w-3xl mb-6">{page.intro}</p>
        <div className="flex flex-wrap gap-3 mb-10">
          <Link href={page.shopHref} className="inline-flex rounded-full bg-[#D4617A] text-white px-5 py-2.5 text-sm font-semibold">
            {page.shopLabel}
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-[#25D366] text-white px-5 py-2.5 text-sm font-semibold"
          >
            Order on WhatsApp
          </a>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 mb-12">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.title}
                price={p.price}
                image={p.images?.[0] || "/images/logo/FloralLogo.jpg"}
                slug={p.slug}
                shortDescription={p.short_description}
                category={p.category}
              />
            ))}
          </div>
        ) : null}

        <div className="max-w-3xl space-y-8 text-gray-700">
          {page.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-heading text-xl md:text-2xl text-[#2C2C2C] mb-3">{section.heading}</h2>
              {section.paragraphs?.map((text) => (
                <p key={text} className="mb-3">{text}</p>
              ))}
              {section.list ? (
                <ul className="list-disc pl-6 space-y-1">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}

          <div>
            <h2 className="font-heading text-xl md:text-2xl text-[#2C2C2C] mb-3">Common questions</h2>
            {page.faqs.map((faq) => (
              <div key={faq.q} className="mb-4">
                <h3 className="font-semibold text-[#2C2C2C] mb-1">{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-heading text-xl md:text-2xl text-[#2C2C2C] mb-3">You may also need</h2>
            <ul className="flex flex-wrap gap-2">
              {page.related.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm hover:border-[#D4617A]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
