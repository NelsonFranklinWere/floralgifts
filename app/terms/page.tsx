import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { SHOP_INFO } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description:
    "The agreement between you and Floral Whispers Gifts when you order: pricing, payment, same-day cut-off, deliveries across Kenya and buying alcohol.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro="When you use this site or place an order, you are agreeing to the points below. If anything is unclear, ask us before you pay."
      sections={[
        {
          heading: "Ordering",
          body: (
            <p>
              You must be 18 or older to order. Please check the recipient&apos;s name, phone number and address, since
              we rely on them to deliver. Your order is confirmed once we have received your payment.
            </p>
          ),
        },
        {
          heading: "Prices and payment",
          body: (
            <p>
              We charge in Kenyan Shillings, and your bank sets the exchange rate if you pay from abroad. Delivery appears
              at checkout. For some orders, such as money bouquets and deliveries outside Nairobi, we agree the final
              amount with you before you pay.
            </p>
          ),
        },
        {
          heading: "What you receive",
          body: (
            <p>
              Flowers change with the season, so your arrangement may look a little different from the photo. If a flower,
              wrap or extra is unavailable, we will use something of similar quality or get in touch with you.
            </p>
          ),
        },
        {
          heading: "Same-day and upcountry delivery",
          body: (
            <p>
              Order by 6PM East Africa Time for same-day delivery in Nairobi. Deliveries outside Nairobi usually arrive
              from the next day onwards, on a date we confirm with you. Traffic, weather and wrong details can cause
              delays that are outside our control, so delivery windows are estimates and not exact times.
            </p>
          ),
        },
        {
          heading: "If nobody is available",
          body: (
            <p>
              We will try to reach you or the recipient. With reasonable care, we may leave the order with reception,
              security, a neighbour or a colleague, or bring it back to our shop for collection. A second trip or a new
              address may cost extra.
            </p>
          ),
        },
        {
          heading: "Alcohol",
          body: (
            <p>
              Wine and sparkling wine are for adults only. By ordering them, you confirm that you and the recipient are of
              legal drinking age, and our rider may ask for proof before handing them over.
            </p>
          ),
        },
        {
          heading: "Refusing or cancelling orders",
          body: (
            <p>
              We may decline an order if something looks fraudulent, a price is clearly wrong, or we cannot source the
              items. If you have already paid, we will offer an alternative or a refund. Other cancellations and refunds
              follow our <Link href="/returns">returns policy</Link>.
            </p>
          ),
        },
        {
          heading: "Using this website",
          body: (
            <p>
              Please don&apos;t misuse the site, attack it or copy our content for resale. Our{" "}
              <Link href="/privacy">privacy policy</Link> explains how we use your data. Questions go to{" "}
              <a href={`mailto:${SHOP_INFO.email}`}>{SHOP_INFO.email}</a> or{" "}
              <a href={`tel:+${SHOP_INFO.phone}`}>+{SHOP_INFO.phone}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
