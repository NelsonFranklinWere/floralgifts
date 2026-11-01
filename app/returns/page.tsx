import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import { SHOP_INFO } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Returns & Refund Policy",
  description:
    "What to do if a Floral Whispers Gifts order arrives wrong or damaged: tell us within one hour with photos, and we'll look at a replacement or credit.",
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Returns & Refund Policy"
      intro="Flowers and food can't go back on the shelf, so we can't take returns for a change of mind. If we get something wrong, though, tell us and we will work it out with you."
      sections={[
        {
          heading: "If something is wrong",
          body: (
            <>
              <p>
                Contact us <strong>within 1 hour of delivery</strong> if the item is wrong, damaged or not fresh. Send us:
              </p>
              <ul>
                <li>Your order reference</li>
                <li>Clear photos of the gift, with the packaging if you still have it</li>
                <li>A short description of the problem</li>
              </ul>
            </>
          ),
        },
        {
          heading: "How we put it right",
          body: (
            <p>
              Once we have looked into it and agreed that the mistake is ours, we will replace or fix the item where we can.
              Otherwise, we may offer store credit or a partial refund, depending on what happened.
            </p>
          ),
        },
        {
          heading: "When we can't refund",
          body: (
            <ul>
              <li>Orders that arrived in good condition, including flowers, chocolates, wine and food</li>
              <li>Personalized or custom-made gifts</li>
              <li>Gift cards, sale items and discounted promotions</li>
              <li>Deliveries refused by the recipient, or made correctly when nobody was available</li>
              <li>Changing your mind, or changing an order after we have started on it</li>
            </ul>
          ),
        },
        {
          heading: "Problems with delivery details",
          body: (
            <p>
              A wrong address, an unreachable phone number or an unavailable recipient can stop a delivery. Bad weather and
              major traffic can delay one too. We will still help, for example by delivering again for an extra fee.
            </p>
          ),
        },
        {
          heading: "Reach us",
          body: (
            <p>
              The quickest way is WhatsApp or a call to <a href={`tel:+${SHOP_INFO.phone}`}>+{SHOP_INFO.phone}</a>. You can
              also email <a href={`mailto:${SHOP_INFO.email}`}>{SHOP_INFO.email}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
