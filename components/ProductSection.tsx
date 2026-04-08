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
    <section className={`py-10 md:py-14 lg:py-16 ${bgColor} relative overflow-hidden`}>
      {/* Magazine-style background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)`,
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-brand-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm md:text-base text-brand-gray-600 mt-1 md:mt-2">
                {subtitle}
              </p>
            )}
          </div>
          {linkHref && (
            <Link
              href={linkHref}
              className="text-brand-red hover:text-brand-red/80 font-medium text-base md:text-lg transition-colors"
            >
              View all
            </Link>
          )}
        </div>

        {products.length > 0 ? (
          <div className="flex overflow-x-auto gap-3 md:gap-5 lg:gap-6 pb-4 scrollbar-thin scrollbar-thumb-brand-gray-300 scrollbar-track-transparent -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {products.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0 w-[calc(100vw-2rem)] min-w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] xs:min-w-[140px] xs:max-w-[140px] sm:min-w-[280px] sm:max-w-[300px] md:w-[320px]"
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
          <p className="text-brand-gray-600 text-center py-8">
            No products available at the moment.
          </p>
        )}
      </div>
    </section>
  );
}

