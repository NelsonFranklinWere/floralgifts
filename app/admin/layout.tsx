import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Legacy admin — no public storefront chrome (header/footer). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white text-brand-gray-900 antialiased">{children}</div>;
}
