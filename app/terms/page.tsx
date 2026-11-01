import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { SHOP_INFO } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service",
  description:
    "The terms for using the Floral Whispers Gifts website and ordering flowers, hampers, wines, chocolates and gifts for delivery in Kenya.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro={`These terms govern your use of the ${SHOP_INFO.name} website and any order you place with us. By using the site or placing an order, you agree to them.`}
      sections={[
        {
          heading: "1. Your details",
          body: (
            <p>
              By ordering, you confirm that you are at least 18 years old and that the name, phone number,
              email, delivery address and recipient details you give us are accurate.
            </p>
          ),
        },
        {
          heading: "2. Using our website",
          body: (
            <p>
              You agree not to use our website for any unlawful purpose or to transmit malicious code. We may
              refuse or cancel orders where we reasonably suspect fraud, abuse or misuse of the site.
            </p>
          ),
        },
        {
          heading: "3. Products and availability",
          body: (
            <p>
              We make every effort to show products and prices accurately. Because flowers and gifts are
              perishable and seasonal, arrangements may vary slightly from the photos, and we may need to
              substitute flowers, packaging or accessories to protect freshness, quality or delivery time.
              Products and prices may change without notice.
            </p>
          ),
        },
        {
          heading: "4. Orders and payment",
          body: (
            <p>
              Prices are in Kenyan Shillings (KES). Delivery fees are shown at checkout based on your delivery
              location. An order is confirmed once payment is received. If we cancel an order after payment, we
              will tell you and offer an alternative or a refund.
            </p>
          ),
        },
        {
          heading: "5. Delivery",
          body: (
            <>
              <p>
                You are responsible for giving us a complete address, a reachable phone number and the delivery
                date. We deliver within the agreed window but cannot guarantee an exact time. If the recipient is
                unavailable, we may:
              </p>
              <ul>
                <li>Leave the order with a receptionist, security guard, neighbour or colleague where reasonable</li>
                <li>Contact you or the recipient to rearrange delivery</li>
                <li>Return the order to our shop for collection</li>
              </ul>
              <p className="mt-2">
                Extra delivery attempts or address changes may cost more. We are not responsible for delays caused
                by incorrect details, unreachable numbers, severe weather or other events beyond our control.
              </p>
            </>
          ),
        },
        {
          heading: "6. Alcohol",
          body: (
            <p>
              Where an order includes alcohol, you confirm that you and the recipient are of legal drinking age
              in Kenya. We may refuse to hand over alcohol where proof of age is not available.
            </p>
          ),
        },
        {
          heading: "7. Cancellations and refunds",
          body: (
            <p>
              Most of our products are made to order and perishable, so cancellations, returns and refunds follow
              our <Link href="/returns">returns policy</Link>. Our <Link href="/privacy">privacy policy</Link>{" "}
              explains how we handle your data.
            </p>
          ),
        },
        {
          heading: "8. Contact",
          body: (
            <p>
              Questions about these terms? Email <a href={`mailto:${SHOP_INFO.email}`}>{SHOP_INFO.email}</a> or
              call <a href={`tel:+${SHOP_INFO.phone}`}>+{SHOP_INFO.phone}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
