"use client";

import Script from "next/script";

const TAWK_EMBED_ID = "69a8288364380e1c36b31457";

/**
 * Tawk.to live chat — only mount when layout enables via NEXT_PUBLIC_TAWK_ENABLED=true.
 * Off by default so local dev avoids third-party console.error noise from embed.tawk.to.
 */
export default function TawkToChat() {
  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
Tawk_API.customStyle={visibility:{desktop:{position:'bl',xOffset:24,yOffset:24},mobile:{position:'bl',xOffset:16,yOffset:16}}};
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/${TAWK_EMBED_ID}/default';
s1.charset='UTF-8';
s1.onerror=function(){};
s0.parentNode.insertBefore(s1,s0);
})();`}
    </Script>
  );
}
