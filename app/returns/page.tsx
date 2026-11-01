import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { SHOP_INFO } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Returns & Refund Policy",
  description:
    "Refunds and returns at Floral Whispers Gifts for flowers, hampers and gifts, including wrong items, damaged orders and how to contact us.",
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Returns & Refund Policy"
      intro="Our products are fresh, made to order and often perishable, so we handle returns carefully. If something goes wrong, we will do our best to make it right."
      sections={[
        {
          heading: "1. General policy",
          body: (
            <p>
              All purchases are final. We do not offer cash refunds or returns for change of mind, late changes
              to orders, or items delivered in good condition to the address and contact details you gave us.
            </p>
          ),
        },
        {
          heading: "2. Wrong item",
          body: (
            <p>
              If you receive a significantly wrong item, contact us within <strong>1 hour</strong> of delivery
              with clear photos and your order reference. Where we agree there has been a mistake on our side, we
              will arrange a replacement or correction where practical, or offer store credit or a partial refund.
            </p>
          ),
        },
        {
          heading: "3. Damage or freshness",
          body: (
            <p>
              If your order arrives damaged or not fresh, contact us within <strong>1 hour</strong> of delivery
              with clear photos, including the packaging if possible. If we agree it was faulty on arrival, we
              will arrange a replacement or store credit.
            </p>
          ),
        },
        {
          heading: "4. Items we cannot refund",
          body: (
            <ul>
              <li>Fresh flowers, bouquets and other perishable arrangements delivered in good condition</li>
              <li>Chocolates, wines and food items delivered in good condition</li>
              <li>Custom or personalised gifts</li>
              <li>Orders delivered correctly where the recipient is unavailable or refuses delivery</li>
              <li>Sale items, discounted promotions and gift cards</li>
            </ul>
          ),
        },
        {
          heading: "5. Delivery problems",
          body: (
            <p>
              We cannot be responsible for failed or delayed deliveries caused by incorrect addresses, unreachable
              phone numbers, an unavailable recipient, or events beyond our control. We will try to help, for
              example by arranging re-delivery at an extra fee.
            </p>
          ),
        },
        {
          heading: "6. Contact us",
          body: (
            <p>
              Call or WhatsApp <a href={`tel:+${SHOP_INFO.phone}`}>+{SHOP_INFO.phone}</a> or email{" "}
              <a href={`mailto:${SHOP_INFO.email}`}>{SHOP_INFO.email}</a> with your order reference.
            </p>
          ),
        },
      ]}
    />
  );
}
