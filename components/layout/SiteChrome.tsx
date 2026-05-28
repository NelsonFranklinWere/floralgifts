import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

/** Storefront chrome — server layout so Footer HTML is stable (no client hydration drift). */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
