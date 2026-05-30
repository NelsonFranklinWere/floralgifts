import type { Viewport } from "next";
import Script from "next/script";
import { Montserrat, Lato, Roboto_Mono, Dancing_Script, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import VisitorPing from "@/components/VisitorPing";
import { GA_MEASUREMENT_ID } from "@/lib/constants";
import { getSupabaseOrigin } from "@/lib/supabase-origin";
import { buildRootMetadata } from "@/lib/seo/metadata";
import { buildHomepageSchemas } from "@/lib/seo/schema";
import JsonLdScript from "@/components/seo/JsonLdScript";

const supabaseOrigin = getSupabaseOrigin();

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = buildRootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#ffffff",
};

const homepageSchemas = buildHomepageSchemas();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${lato.variable} ${robotoMono.variable} ${dancingScript.variable} ${playfairDisplay.variable}`}
    >
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/images/logo/FloralLogo.jpg" type="image/jpeg" />
        {supabaseOrigin ? (
          <>
            <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        ) : null}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://embed.tawk.to" />
        {homepageSchemas.map((schema, i) => (
          <JsonLdScript key={i} data={schema} />
        ))}
      </head>
      <body className={`${lato.className} flex flex-col min-h-screen bg-green-100`}>
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            var path = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '/';
            gtag('config', '${GA_MEASUREMENT_ID}', { page_path: path });
          `,
          }}
        />
        <VisitorPing />
        {process.env.NODE_ENV === "production" && (
          <Script id="tawk-to" strategy="lazyOnload">
            {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
Tawk_API.customStyle={visibility:{desktop:{position:'bl',xOffset:24,yOffset:24},mobile:{position:'bl',xOffset:16,yOffset:16}}};
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/69a8288364380e1c36b31457/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`}
          </Script>
        )}
        <ErrorBoundary>
          <AnalyticsProvider>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Header />
            <main id="main-content" className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </AnalyticsProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
