export type CategorySection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type CategoryPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** Live product slugs to show; any no longer in the catalogue are skipped. */
  productSlugs: string[];
  sections: CategorySection[];
  faqs: { q: string; a: string }[];
  whatsappMessage: string;
  shopHref: string;
  shopLabel: string;
  related: { href: string; label: string }[];
};

const CATEGORY_DELIVERY =
  "Delivery is free within Nairobi CBD. Fees elsewhere depend on the area and are shown at checkout: for example KSh 300 to Westlands or Kilimani, KSh 400 to Lavington and KSh 600 to Karen.";

export const CATEGORY_PAGES: CategoryPage[] = [
  {
    slug: "gift-hampers-nairobi",
    title: "Gift Hampers Nairobi | Same-Day Delivery",
    description:
      "Gift hampers in Nairobi with flowers, wine, chocolates and teddy bears. Choose by person and budget, then send them the same day from University Way.",
    h1: "Gift Hampers in Nairobi",
    intro:
      "A hamper says more than a single gift because it arrives as a complete surprise. Choose one with flowers, wine, chocolates or a teddy bear, and we will deliver it across Nairobi.",
    productSlugs: [
      "deluxe-gift-set", "true-romance-giftbox", "brenda-luxury-gift-set", "care-package-gift-hamper",
      "wambui-flowers-wine-nairobi", "golden-celebration-gift-hamper", "aroma-delight-hamper",
      "romantic-rose-chocolate-wine-gift-hamper-nairobi",
    ],
    sections: [
      {
        heading: "Which hamper suits who",
        list: [
          "For a wife or girlfriend: roses with chocolate and wine, or a set with a teddy bear",
          "For a birthday: a flower bouquet set with chocolate and a gift card",
          "For a couple: flowers with wine that they can enjoy together",
          "For someone unwell: a care package or fruit basket",
          "For a client or colleague: a hamper with mixed colours and no romantic touches",
        ],
      },
      {
        heading: "How to choose",
        paragraphs: [
          "Start with your budget, then ask whether the person drinks. If you are not sure, choose a set with chocolate or non-alcoholic wine.",
          "Add a short message in your own words. A specific line about the person means more than a long, generic one.",
        ],
      },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY, "Message us early in the day for same-day delivery, and we will confirm your time window."] },
    ],
    faqs: [
      { q: "Can I change what is in a hamper?", a: "Message us on WhatsApp with your budget and the items you would like, and we will tell you what is possible." },
      { q: "Can you deliver a hamper to an office?", a: "Yes. Share the building, floor and a contact at reception so that the rider can find the recipient." },
    ],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like help choosing a gift hamper in Nairobi.",
    shopHref: "/collections/gift-hampers",
    shopLabel: "Shop all hampers",
    related: [
      { href: "/corporate-gift-hampers-nairobi", label: "Corporate hampers" },
      { href: "/flower-hamper-wine-nairobi", label: "Flowers and wine" },
      { href: "/blog/gift-hampers-nairobi-prices-guide", label: "Hamper price guide" },
    ],
  },
  {
    slug: "corporate-gift-hampers-nairobi",
    title: "Corporate Gift Hampers Nairobi | Bulk Orders",
    description:
      "Corporate gift hampers in Nairobi for clients and staff. Set your budget and recipient count, add branded cards, and schedule delivery to each office.",
    h1: "Corporate Gift Hampers in Nairobi",
    intro:
      "We prepare bulk gift hampers for Nairobi companies, agencies and teams. Tell us your budget, how many people you are gifting and when they should arrive, and we will plan it with you.",
    productSlugs: [
      "deluxe-gift-set", "care-package-gift-hamper", "golden-celebration-gift-hamper", "aroma-delight-hamper",
      "signature-celebration-basket", "healthy-fruit-gift-basket",
    ],
    sections: [
      {
        heading: "What we can arrange",
        list: [
          "Bulk hampers for clients and staff",
          "Branded cards and custom messages",
          "Same-day and scheduled delivery, coordinated across locations",
        ],
      },
      {
        heading: "What to send us for a quote",
        list: [
          "The number of recipients and your budget per person",
          "The delivery date and the list of locations",
          "Whether alcohol is acceptable; if not, we can suggest other options",
          "Your logo and the message for the card",
        ],
      },
      {
        heading: "Choosing for clients and staff",
        paragraphs: [
          "For key clients, choose a larger hamper that feels like a real thank-you. For teams, give everyone the same gift so that nobody feels left out.",
          "Check your company's gift policy and your clients' policies first, since some limit what staff can accept. Book early for year-end gifting, when many companies send gifts in the same week.",
        ],
      },
    ],
    faqs: [
      { q: "Can you deliver to several offices?", a: "Yes. Send your list of names, phone numbers, buildings and floors, and we will coordinate the deliveries." },
      { q: "Can you add our branding?", a: "We can add branded cards and custom messages. Send us your logo and wording on WhatsApp." },
    ],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like a quote for corporate gift hampers.",
    shopHref: "/collections/corporate",
    shopLabel: "Shop corporate gifts",
    related: [
      { href: "/gift-hampers-nairobi", label: "All gift hampers" },
      { href: "/blog/best-gift-hampers-for-corporate-gifting-nairobi", label: "Corporate hamper guide" },
      { href: "/blog/corporate-gifts-office-flowers-nairobi", label: "Monthly office flowers" },
    ],
  },
  {
    slug: "money-bouquet-nairobi",
    title: "Money Bouquet Nairobi | Prices & Delivery",
    description:
      "Money bouquets in Nairobi: real cash arranged with flowers and chocolates. See flat and full bouquet options, how the service charge works, and how to order.",
    h1: "Money Bouquets in Nairobi",
    intro:
      "A money bouquet turns a cash gift into something worth photographing. We arrange real notes with flowers, chocolates and wrapping for birthdays, graduations and other big moments.",
    productSlugs: ["pp2-graduation", "proud-moment", "flat-bouquet", "money-bouquet-gift", "money-bouquet"],
    sections: [
      {
        heading: "How pricing works",
        paragraphs: [
          "The price has two parts: the cash that goes inside, and a service charge for making the bouquet. The service charge depends on how much cash is inside.",
          "For example, our bouquet with KSh 10,000 inside has a KSh 3,500 service charge, for KSh 13,500 in total. Tell us your amount on WhatsApp and we will confirm the exact price.",
        ],
      },
      {
        heading: "Which one to choose",
        list: [
          "Flat money bouquet: a neat, simple option with cash, fresh flowers and chocolate",
          "Kids' graduation bouquet: a smaller amount with snacks or chocolates, a gift card and graduation toppers",
          "Full money bouquet: a larger display for milestone birthdays and big celebrations",
        ],
      },
      {
        heading: "Before you order",
        paragraphs: [
          "Because this gift holds real cash, agree the handover with us and make sure the recipient will be available at the agreed time. Order ahead where you can, so that we can prepare the notes.",
        ],
      },
    ],
    faqs: [
      { q: "Is the cash real?", a: "Yes. The cash you choose goes inside the bouquet, and the recipient can take it out and use it." },
      { q: "How much is the service charge?", a: "It depends on the cash inside. Message us with your amount and we will confirm it before you pay." },
    ],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like a money bouquet. The cash amount is:",
    shopHref: "/collections/flowers",
    shopLabel: "Shop flowers",
    related: [
      { href: "/graduation-gifts-nairobi", label: "Graduation gifts" },
      { href: "/blog/birthday-money-bouquet-with-roses", label: "Birthday money bouquets" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
    ],
  },
  {
    slug: "funeral-wreaths-nairobi",
    title: "Funeral Wreaths Nairobi | Sympathy Flowers",
    description:
      "Funeral wreaths and sympathy flowers in Nairobi: heart and round wreaths and casket arrangements, delivered to a home, church or funeral venue.",
    h1: "Funeral Wreaths and Sympathy Flowers in Nairobi",
    intro:
      "When you are arranging flowers for a loss, the details should be simple. Choose a wreath or arrangement, share the time and place, and we will help you get it there with a message from you.",
    productSlugs: [
      "serenity-tribute", "eternal-peace", "heaven-gate", "deepest-sympathy", "funeral-flowers",
      "last-goodbye", "graceful-farewell", "sacred-memories", "dad-letter-tribute-funeral-wreath-nairobi",
    ],
    sections: [
      {
        heading: "Types of arrangements",
        list: [
          "Heart-shaped wreaths, often sent by close family",
          "Round wreaths, suitable for family, friends and colleagues",
          "Full funeral arrangements with casket flowers and wreaths",
          "Personal tributes for a parent or close relative",
        ],
      },
      {
        heading: "What to tell us",
        list: [
          "The venue, whether a home, church or funeral home, and when the service starts",
          "The name of the person who has died and the family's contact person",
          "Your message for the card, and how you want your name to appear",
        ],
      },
      {
        heading: "What to write on the card",
        paragraphs: [
          "Keep it short and sincere. For example: \"With deepest sympathy to you and your family\", \"Forever in our hearts\", or \"Remembering a life well lived, from your friends at work\".",
        ],
      },
    ],
    faqs: [
      { q: "Can you deliver to a church or funeral home?", a: "Share the venue, the time and a contact person, and we will confirm the delivery with you." },
      { q: "Can a group send one wreath?", a: "Yes. Tell us the name of the group or company and we will add it to the card." },
    ],
    whatsappMessage: "Hello Floral Whispers Gifts, I need funeral flowers delivered. The venue and time are:",
    shopHref: "/collections/flowers",
    shopLabel: "Shop flowers",
    related: [
      { href: "/blog/send-sympathy-gifts-nairobi", label: "Sending sympathy gifts" },
      { href: "/get-well-soon-gifts-nairobi", label: "Get well gifts" },
      { href: "/flower-delivery-nairobi", label: "Flower delivery" },
    ],
  },
  {
    slug: "get-well-soon-gifts-nairobi",
    title: "Get Well Soon Gifts Nairobi | Fruit & Flowers",
    description:
      "Get well soon gifts in Nairobi: fruit baskets, flowers and combined sets for a home or hospital. Learn what to send and what details the rider needs.",
    h1: "Get Well Soon Gifts in Nairobi",
    intro:
      "A fruit basket or a gentle bouquet tells someone that you are thinking of them while they recover. We deliver both across Nairobi, along with sets that combine the two.",
    productSlugs: [
      "get-well", "uplifting-basket", "get-well-soon-amor", "healthy-fruit-gift-basket",
      "radiant-roses-fruit-basket-combo", "fruit-basket", "get-well-soon-fruit-basket-flower-bouquet-colleague",
      "tropical-fruit-basket",
    ],
    sections: [
      {
        heading: "What to send",
        list: [
          "Fruit basket: a practical choice when someone is resting at home",
          "Flowers and fruit together: a fuller gift for a colleague or relative",
          "Soft-coloured flowers: a gentle choice that brightens a room",
        ],
      },
      {
        heading: "Sending to a hospital",
        paragraphs: [
          "Some wards limit flowers or food, so check with the family or the hospital first. If flowers are not allowed, send fruit if permitted, or deliver to the person's home for when they return.",
          "Share the patient's full name, the hospital, the ward and a contact person who can receive the gift.",
        ],
      },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [
      { q: "Can you deliver to a hospital?", a: "Share the hospital, ward and a contact person, and we will confirm the delivery with you. Check the ward's rules on flowers and food first." },
      { q: "Can I add a personal message?", a: "Yes. Send us your message when you order and we will include it with the gift." },
    ],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like to send a get well soon gift in Nairobi.",
    shopHref: "/collections/flowers",
    shopLabel: "Shop flowers",
    related: [
      { href: "/blog/get-well-soon-flower-delivery-kenya", label: "Get well flower delivery" },
      { href: "/blog/fresh-fruit-basket", label: "Fruit basket guide" },
      { href: "/same-day-delivery-nairobi", label: "Same-day delivery" },
    ],
  },
  {
    slug: "period-care-package-kenya",
    title: "Period Care Package Kenya | Care Gift Box",
    description:
      "Period care packages in Kenya with hygiene products, soothing treats and self-care items. Send one to a girlfriend, sister or friend, or treat yourself.",
    h1: "Period Care Package Kenya",
    intro:
      "Our Period Care Package brings practical essentials and small comforts together in one gift box. It suits a girlfriend, sister, friend or colleague, and it works just as well as a treat for yourself.",
    productSlugs: ["period-care-box"],
    sections: [
      {
        heading: "What can be inside",
        paragraphs: ["The package includes feminine hygiene products, soothing treats and self-care items. Depending on the box, it may include:"],
        list: ["Sanitary pads or tampons", "Chocolates", "Herbal tea", "Pain relief essentials", "Comforting self-care items"],
      },
      {
        heading: "Sending one thoughtfully",
        paragraphs: [
          "Include a short, kind note, since a simple \"thinking of you\" is enough. If you know her preferences, tell us which products or treats to include.",
          "Message us if you would like to add flowers or chocolates, or if you need the delivery handled in a particular way.",
        ],
      },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [
      { q: "Who is this package for?", a: "Anyone you want to support on difficult days, including a girlfriend, wife, sister, daughter, friend or colleague. You can also buy it for yourself." },
      { q: "Can I choose what goes in the box?", a: "Message us on WhatsApp with what she prefers, and we will tell you what we can do." },
    ],
    whatsappMessage: "Hello Floral Whispers Gifts, I want to send a period care package.",
    shopHref: "/product/period-care-box",
    shopLabel: "View the Period Care Package",
    related: [
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
      { href: "/get-well-soon-gifts-nairobi", label: "Get well gifts" },
      { href: "/collections/womens", label: "Gifts for women" },
    ],
  },
  {
    slug: "giant-teddy-bears-nairobi",
    title: "Giant Teddy Bears Nairobi | 25cm to 200cm",
    description:
      "Teddy bears in Nairobi from 25cm to 200cm giant bears, in brown, white, red, pink and blue. Compare sizes and prices, or add flowers for a bigger surprise.",
    h1: "Giant Teddy Bears in Nairobi",
    intro:
      "Size changes the whole message. A 25cm bear is a sweet extra, while a 200cm bear is an event. Our bears come in brown, white, red, pink and blue.",
    productSlugs: [
      "dream-soft-teddy", "fluffyjoy-bear", "blisshug-teddy", "tender-heart-bear", "marshmallow-bear",
      "rossyhugs-bear", "moonlight-snuggle-bear", "love-blossom-teddy-hamper",
    ],
    sections: [
      {
        heading: "Sizes and prices",
        list: [
          "25cm, KSh 3,500: a small extra with flowers, or a gift for a young child",
          "50cm, KSh 4,500: an all-rounder for birthdays and graduations",
          "100cm, KSh 8,500: a real surprise for a partner",
          "120cm with a customized Stanley mug, KSh 12,500: a more personal option",
          "160cm, KSh 15,500; 180cm, KSh 17,500; 200cm, KSh 19,500: giant bears for big gestures",
        ],
      },
      {
        heading: "Before you buy a giant bear",
        paragraphs: [
          "Think about where it will go. A 200cm bear needs real space at home and is hard to carry on public transport. For an office or a small flat, a 50cm to 100cm bear is often the better choice.",
          "For the biggest reaction, pair a bear with a bouquet or choose a hamper that already includes one.",
        ],
      },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [
      { q: "What colours are available?", a: "Our bears come in brown, white, red, pink and blue. Tell us your colour when you order." },
      { q: "Can you add flowers to a teddy order?", a: "Yes. Add a bouquet to your cart, or message us and we will suggest a pairing." },
    ],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like a teddy bear. The size and colour are:",
    shopHref: "/collections/teddy-bears",
    shopLabel: "Shop all teddy bears",
    related: [
      { href: "/blog/teddy-bear-gifts-nairobi", label: "Teddy bear gift guide" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
      { href: "/collections/kids", label: "Gifts for kids" },
    ],
  },
  {
    slug: "graduation-gifts-nairobi",
    title: "Graduation Gifts Nairobi | PP2 to Campus",
    description:
      "Graduation gifts in Nairobi from PP2 to campus: money bouquets with graduation toppers, flowers, teddy bears and hampers. Share the school and time.",
    h1: "Graduation Gifts in Nairobi",
    intro:
      "From PP2 to campus, a graduation gift should look good in photos and be easy to hold on the day. These are the gifts we recommend at each stage.",
    productSlugs: ["pp2-graduation", "proud-moment", "fluffyjoy-bear", "flat-bouquet", "deluxe-gift-set", "golden-celebration-gift-hamper"],
    sections: [
      {
        heading: "Gifts for each stage",
        list: [
          "PP2 and early primary: a small flat money bouquet with snacks or chocolates, a graduation topper and a card",
          "Grade 3 and Grade 6: a bouquet with chocolates, or a teddy bear they can hug in photos",
          "Grade 9: a bouquet or money bouquet that feels more grown up",
          "Campus: a gift hamper, flowers with a card, or a larger money bouquet",
        ],
      },
      {
        heading: "Getting it there on the day",
        paragraphs: [
          "School gates get busy and ceremonies often start early, so order ahead where you can. Share the school name, the start time and a contact phone number for whoever will receive the gift.",
          "If you are ordering for a boy or a girl, tell us, since our kids' bouquets can be wrapped in blue or pink.",
        ],
      },
    ],
    faqs: [
      { q: "What do you recommend for a PP2 graduate?", a: "Our kids' flat money bouquets are popular choices. They include cash, snacks or chocolates, graduation toppers and a customized gift card." },
      { q: "Can you deliver to a school?", a: "Share the school, the time and a contact person, and we will confirm the delivery with you." },
    ],
    whatsappMessage: "Hello Floral Whispers Gifts, I need a graduation gift. The school and date are:",
    shopHref: "/collections/graduation",
    shopLabel: "Shop graduation gifts",
    related: [
      { href: "/blog/pp2-graduation-gifts-2026-boys-girls", label: "PP2 graduation gift ideas" },
      { href: "/blog/graduation-bouquet-prices-nairobi-kenya", label: "Graduation bouquet prices" },
      { href: "/money-bouquet-nairobi", label: "Money bouquets" },
    ],
  },
  {
    slug: "red-roses-nairobi",
    title: "Red Roses Nairobi | 100, 200 and 400 Roses",
    description:
      "Red rose bouquets in Nairobi, from small romantic bunches to 100, 200 and 400 roses. See how many roses to send for each occasion and order for delivery.",
    h1: "Red Roses in Nairobi",
    intro:
      "Red roses remain the clearest way to say \"I love you\". What changes is how loudly you say it, from a simple romantic bunch to 400 roses in one bouquet.",
    productSlugs: ["crimson-love-roses", "rose-romance-gift-set", "100-reasons", "luxury-red-roses-gift-set-nairobi", "200-amor-bouquet", "200-luxury-bouquet", "400-red-roses-bouquet"],
    sections: [
      {
        heading: "How many roses to send",
        list: [
          "A small bunch: a date, a thank-you or a just-because surprise",
          "100 roses: an anniversary, a birthday, or 100 reasons you love someone",
          "200 roses: a milestone anniversary or a proposal",
          "400 roses: a statement gift for the biggest moments",
        ],
      },
      {
        heading: "Make it more personal",
        paragraphs: [
          "Add chocolate, wine or a teddy bear, and write a card that mentions something only you two would know.",
          "For very large bouquets, order ahead and tell us the delivery location, because they take time to prepare and need careful handling.",
        ],
      },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [
      { q: "Can I order roses in other colours?", a: "Yes. We also make pink and white rose bouquets. See our flowers collection or message us." },
      { q: "How early should I order 200 or 400 roses?", a: "Message us as early as you can, and we will confirm the timing for your date." },
    ],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like red roses delivered in Nairobi.",
    shopHref: "/collections/flowers",
    shopLabel: "Shop all flowers",
    related: [
      { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
      { href: "/same-day-delivery-nairobi", label: "Same-day delivery" },
      { href: "/gift-hampers-nairobi", label: "Rose and wine hampers" },
    ],
  },
  {
    slug: "send-gifts-to-kenya",
    title: "Send Gifts to Kenya from Abroad | Nairobi",
    description:
      "Send flowers and gifts to Nairobi from the UK, USA, Canada, Dubai or anywhere abroad. Order online or on WhatsApp, and we keep you updated on delivery.",
    h1: "Send Gifts to Kenya from Abroad",
    intro:
      "If you are in the UK, USA, Canada, Dubai or anywhere else and want to surprise someone in Nairobi, you can arrange it with us online or on WhatsApp.",
    productSlugs: ["100-reasons", "deluxe-gift-set", "golden-celebration-gift-hamper", "get-well-soon-fruit-basket-flower-bouquet-colleague", "blisshug-teddy", "romantic-rose-chocolate-wine-gift-hamper-nairobi"],
    sections: [
      {
        heading: "How it works",
        list: [
          "Share the recipient's name, phone number and location in Nairobi",
          "Choose flowers, a hamper, wine or a teddy bundle, and write your message",
          "We confirm the delivery time and keep you updated",
        ],
      },
      {
        heading: "Tips when ordering from another country",
        paragraphs: [
          "Kenya is on East Africa Time (UTC+3), so check what time it is in Nairobi before you choose a delivery time. Prices are in Kenyan Shillings, and your bank will convert them when you pay.",
          "Give us a working phone number for the recipient, and tell us if the delivery should be a surprise so that the rider knows what to say. If you would like a photo of the delivery, ask us when you order.",
        ],
      },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [
      { q: "Can I pay from outside Kenya?", a: "Our checkout offers card payment. If you run into any trouble, message us on WhatsApp and we will help." },
      { q: "What should I do if I do not know the exact address?", a: "Give us the recipient's phone number and the area, and let us know whether we may call them to confirm directions." },
    ],
    whatsappMessage: "Hello Floral Whispers Gifts, I am abroad and want to send a gift to someone in Nairobi.",
    shopHref: "/collections",
    shopLabel: "Explore gift collections",
    related: [
      { href: "/blog/send-flowers-nairobi", label: "Sending flowers to Nairobi" },
      { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
    ],
  },
];

export function getCategoryPage(slug: string): CategoryPage {
  const page = CATEGORY_PAGES.find((p) => p.slug === slug);
  if (!page) throw new Error(`Unknown category page: ${slug}`);
  return page;
}

/** Blog post or product → the category page that sells it. First match wins. */
const CATEGORY_LINK_RULES: { match: RegExp; slug: string }[] = [
  { match: /money/i, slug: "money-bouquet-nairobi" },
  { match: /funeral|wreath|sympathy|condolence|tribute/i, slug: "funeral-wreaths-nairobi" },
  { match: /get.?well|fruit|hospital/i, slug: "get-well-soon-gifts-nairobi" },
  { match: /period/i, slug: "period-care-package-kenya" },
  { match: /graduat|pp2/i, slug: "graduation-gifts-nairobi" },
  { match: /corporate|office|colleague|teachers/i, slug: "corporate-gift-hampers-nairobi" },
  { match: /teddy|\bbear/i, slug: "giant-teddy-bears-nairobi" },
  { match: /abroad|send-gifts|send-flowers/i, slug: "send-gifts-to-kenya" },
  { match: /roses?\b|romantic|valentine|anniversary/i, slug: "red-roses-nairobi" },
  { match: /hamper|gift|birthday|mother|wine|chocolate/i, slug: "gift-hampers-nairobi" },
];

export function resolveCategoryLink(text: string): { href: string; label: string } | null {
  const slug = CATEGORY_LINK_RULES.find((r) => r.match.test(text))?.slug;
  if (!slug) return null;
  return { href: `/${slug}`, label: getCategoryPage(slug).h1 };
}
