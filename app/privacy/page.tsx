import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { SHOP_INFO } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How Floral Whispers Gifts collects, uses and protects your personal data when you order flowers and gifts, chat with us or browse our website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro={`This policy explains how ${SHOP_INFO.name} handles personal data when you use our website, place an order or contact us.`}
      sections={[
        {
          heading: "1. What we collect",
          body: (
            <ul>
              <li>Your name, phone number and email address when you order, subscribe or contact us</li>
              <li>Recipient details you give us for delivery: name, phone number, address and gift message</li>
              <li>Order details: items, amounts, delivery date and payment status</li>
              <li>Messages you send through our chat, WhatsApp, email or contact form</li>
              <li>Browsing data such as pages viewed, device type, approximate location and referring website</li>
            </ul>
          ),
        },
        {
          heading: "2. How we use it",
          body: (
            <ul>
              <li>To prepare and deliver your order and to contact you or the recipient about it</li>
              <li>To confirm payments and send order updates</li>
              <li>To answer your questions and handle complaints or refund requests</li>
              <li>To send offers, only if you subscribed; you can unsubscribe at any time</li>
              <li>To understand how our website is used, improve it and measure our advertising</li>
            </ul>
          ),
        },
        {
          heading: "3. Who we share it with",
          body: (
            <>
              <p>We do not sell your personal data. We share it only as needed with:</p>
              <ul>
                <li>Our delivery riders, who receive what they need to complete the delivery</li>
                <li>Payment providers, including Pesapal and M-Pesa, who process your payment</li>
                <li>Email and chat providers, including Tawk.to, and WhatsApp when you message us there</li>
                <li>Google Analytics and Meta (Facebook Pixel), who help us measure site use and advertising</li>
                <li>Authorities, where the law requires it</li>
              </ul>
            </>
          ),
        },
        {
          heading: "4. Cookies and similar tools",
          body: (
            <p>
              We use cookies and browser storage to keep your cart and to run analytics and advertising
              measurement. You can block or delete cookies in your browser settings, though parts of the site
              such as the cart may stop working properly.
            </p>
          ),
        },
        {
          heading: "5. How long we keep it",
          body: (
            <p>
              We keep order records for as long as we need them to serve you and to meet tax, accounting and
              legal requirements. We keep other data only as long as it is useful for the purpose it was
              collected for.
            </p>
          ),
        },
        {
          heading: "6. Your rights",
          body: (
            <p>
              Under Kenya&apos;s Data Protection Act, 2019, you can ask to see the personal data we hold about
              you, correct it, ask us to delete it, or object to its use, including for marketing. You may also
              complain to the Office of the Data Protection Commissioner.
            </p>
          ),
        },
        {
          heading: "7. Sending a gift to someone else",
          body: (
            <p>
              When you order for another person, you give us their details so we can deliver the gift. Please
              only share details you are entitled to share.
            </p>
          ),
        },
        {
          heading: "8. Changes and contact",
          body: (
            <p>
              We may update this policy, and the latest version will always be on this page. For any privacy
              question, email <a href={`mailto:${SHOP_INFO.email}`}>{SHOP_INFO.email}</a> or call{" "}
              <a href={`tel:+${SHOP_INFO.phone}`}>+{SHOP_INFO.phone}</a>. See also our{" "}
              <Link href="/terms">terms</Link> and <Link href="/returns">returns policy</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
