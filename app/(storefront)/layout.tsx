import SiteChrome from "@/components/layout/SiteChrome";
import DeferredClientWidgets from "@/components/layout/DeferredClientWidgets";

/** Public shop layout — header, footer, and widgets. Staff/admin use their own layouts. */
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteChrome>{children}</SiteChrome>
      <DeferredClientWidgets />
    </>
  );
}
