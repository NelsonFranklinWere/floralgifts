"use client";

import Link from "next/link";
import Image from "next/image";
import { SHOP_INFO } from "@/lib/constants";

type StaffAuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const highlights = [
  "Orders & fulfilment",
  "Products & inventory",
  "Delivery & enquiries",
];

export default function StaffAuthLayout({ title, subtitle, children }: StaffAuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Brand panel — desktop */}
      <aside
        className="hidden lg:flex lg:w-[42%] xl:w-1/2 flex-col justify-between p-10 xl:p-14 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #ec4899 48%, #ef4444 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('/images/patterns/diagonal-lines.svg')] bg-repeat pointer-events-none" />
        <div className="relative z-10">
          <Image
            src="/images/logo/FloralLogo.jpg"
            alt="Floral Whispers Gifts"
            width={72}
            height={72}
            className="rounded-xl ring-2 ring-white/30 shadow-lg mb-8"
            priority
          />
          <h1 className="font-heading text-3xl xl:text-4xl font-bold leading-tight">
            Floral Whispers
            <span className="block text-2xl xl:text-3xl font-semibold text-white/95 mt-1">& Gifts</span>
          </h1>
          <p className="mt-3 text-white/90 text-sm">Nairobi · Flowers, teddy bears & gift hampers</p>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div>
            <h2 className="font-heading text-xl font-semibold">Store management</h2>
            <p className="mt-2 text-white/90 text-sm leading-relaxed">
              Sign in to manage orders, products, deliveries, and customer enquiries for your Nairobi florist.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-white/95">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white shrink-0" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/75 leading-relaxed">{SHOP_INFO.address}</p>
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#FAF7F2]">
        <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <Image
                src="/images/logo/FloralLogo.jpg"
                alt=""
                width={64}
                height={64}
                className="rounded-xl mx-auto mb-4 shadow-card ring-1 ring-brand-gray-200"
              />
              <p className="font-heading text-xl font-bold text-brand-gray-900">
                <span className="text-brand-red">Floral Whispers</span> Gifts
              </p>
              <p className="text-sm text-brand-gray-800 mt-1">Staff & admin portal</p>
            </div>

            <div className="bg-white rounded-xl border border-brand-gray-200 shadow-card p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="font-heading text-xl font-semibold text-brand-gray-900">{title}</h2>
                {subtitle ? (
                  <p className="text-sm text-brand-gray-800 mt-1">{subtitle}</p>
                ) : null}
              </div>
              {children}
            </div>

            <p className="text-center mt-6 text-sm">
              <Link
                href="/"
                className="text-brand-green font-medium hover:text-brand-red transition-colors"
              >
                ← Back to website
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
