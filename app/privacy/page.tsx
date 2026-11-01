import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { SHOP_INFO } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "What Floral Whispers Gifts does with your details and your recipient's details when you order, chat with us or visit the site, and how to contact us.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="To deliver a gift we need some details from you and about the person receiving it. This page explains what we keep, why we keep it, and what you can ask us to do with it."
      sections={[
        {
          heading: "Details you give us",
          body: (
            <ul>
              <li>Your name, phone and email, when you buy something, sign up or write to us</li>
              <li>The recipient&apos;s name, phone and address, along with your gift message</li>
              <li>What you ordered, the delivery date and whether payment went through</li>
              <li>Anything you tell us on WhatsApp, on our chat or through the contact form</li>
            </ul>
          ),
        },
        {
          heading: "Details collected as you browse",
          body: (
            <p>
              Our site records things like the pages you open, your type of device, your rough location and the
              site that sent you here. Cookies and browser storage also remember your cart. Blocking them in your
              browser is fine, but the cart may not work as it should.
            </p>
          ),
        },
        {
          heading: "Why we need them",
          body: (
            <p>
              We use your details to make and deliver the order, confirm the payment, keep you informed and sort out
              any problem. If you sign up for offers we will email you, and you can opt out whenever you like. Browsing
              data shows us what is working on the site and in our adverts.
            </p>
          ),
        },
        {
          heading: "Who else sees them",
          body: (
            <>
              <p>Nobody buys your details from us. A few others handle parts of the job:</p>
              <ul>
                <li>Riders see what they need to find the recipient</li>
                <li>Pesapal and M-Pesa handle payments</li>
                <li>Tawk.to and WhatsApp carry our chats, and an email service sends our messages</li>
                <li>Google Analytics and the Meta Pixel measure visits and advertising</li>
                <li>Government bodies, if the law requires us to share something</li>
              </ul>
            </>
          ),
        },
        {
          heading: "If someone sent you a gift",
          body: (
            <p>
              The sender gave us your details so that we could reach you. We use them only for that delivery. Contact
              us if you would like them removed afterwards. Anyone ordering for someone else should only share details
              they are entitled to share.
            </p>
          ),
        },
        {
          heading: "How long we hold them",
          body: (
            <p>
              Order records stay for as long as tax, accounting and legal rules require. Everything else is removed once
              we no longer have a use for it.
            </p>
          ),
        },
        {
          heading: "What you can ask us",
          body: (
            <p>
              Kenya&apos;s Data Protection Act, 2019 lets you see what we hold on you, correct it, have it deleted or stop
              us using it for marketing. If we don&apos;t resolve your concern, you can complain to the Office of the Data
              Protection Commissioner.
            </p>
          ),
        },
        {
          heading: "Getting in touch",
          body: (
            <p>
              Email <a href={`mailto:${SHOP_INFO.email}`}>{SHOP_INFO.email}</a> or call{" "}
              <a href={`tel:+${SHOP_INFO.phone}`}>+{SHOP_INFO.phone}</a>. Any changes to this policy will appear on this
              page. You may also want to read our <Link href="/terms">terms</Link> and{" "}
              <Link href="/returns">returns policy</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
