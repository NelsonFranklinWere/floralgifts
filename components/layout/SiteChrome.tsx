"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStaff = pathname?.startsWith("/staff");

  if (isStaff) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
