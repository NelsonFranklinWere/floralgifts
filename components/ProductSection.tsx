"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function ProductSection({
  title,
  subtitle,
  products,
  bgColor = "bg-green-100",
  linkHref,
}: {
  title: string;
  subtitle?: string;
  products: any[];
  bgColor?: string;
  linkHref?: string;
}) {
  return (
    <section className={`py-8 md:py-12 lg:py-14 ${bgColor} relative overflow-hidden`}>
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)`,
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 md:mb-7 flex items-end justify-between gap-4">
          <div className="min-w-0 max-w-3xl">
            <h2 className="font-playfair font-semibold text-sm sm:text-base md:text-lg lg:text-xl text-brand-gray-900 tracking-tight leading-snug">
              {title}
            </h2>
            {subtitle && (
              <p className="font-body font-light text-[11px] sm:text-xs md:text-[13px] text-brand-gray-600 mt-1.5 md:mt-2 leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          {linkHref && (
            <Link
              href={linkHref}
              className="shrink-0 font-body text-[11px] sm:text-xs uppercase tracking-[0.14em] text-brand-gray-800 hover:text-brand-red border-b border-brand-gray-400 hover:border-brand-red pb-0.5 transition-colors"
            >
              View all
            </Link>
          )}
        </div>

        {products.length > 0 ? (
          <div className="flex overflow-x-auto gap-2 sm:gap-4 md:gap-5 pb-4 scrollbar-thin scrollbar-thumb-brand-gray-300 scrollbar-track-transparent -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {products.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0 w-[calc(50vw-1.25rem)] min-w-[calc(50vw-1.25rem)] max-w-[calc(50vw-1.25rem)] sm:min-w-[calc(50vw-1.75rem)] sm:max-w-[calc(50vw-1.75rem)] sm:w-[calc(50vw-1.75rem)] md:min-w-[260px] md:max-w-[280px] md:w-[280px] lg:min-w-[300px] lg:max-w-[320px] lg:w-[320px]"
              >
                <ProductCard
                  id={product.id}
                  name={product.title}
                  price={product.price}
                  image={product.images[0] || "/images/products/hampers/giftamper.jpg"}
                  slug={product.slug}
                  shortDescription={product.short_description}
                  category={product.category}
                  homePage={true}
                  priority={index < 3}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-gray-600 text-center py-8 text-sm">
            No products available at the moment.
          </p>
        )}
      </div>
    </section>
  );
}
