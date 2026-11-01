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
  "Order by 6PM East Africa Time for same-day delivery in Nairobi. It's free within the CBD; elsewhere the fee depends on the area and appears at checkout, for example KSh 300 to Kilimani or KSh 600 to Karen.";

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
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY, "Tell us the time you have in mind, and we will confirm your delivery window."] },
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
          "Your total is the cash that goes inside plus a service charge for making the bouquet. We agree the service charge with you when you order, because it depends on how much cash you choose and how you want the bouquet made.",
          "Send us your amount, date and delivery area on WhatsApp, and we will give you the final price before you pay.",
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
          "We also agree with you how the bouquet will be handled and handed over, since it holds real cash. Make sure the recipient will be available at the agreed time, and order ahead where you can so that we can prepare the notes.",
        ],
      },
    ],
    faqs: [
      { q: "Is the cash real?", a: "Yes. The cash you choose goes inside the bouquet, and the recipient can take it out and use it." },
      { q: "How much is the service charge?", a: "We discuss it with you when you order, based on the cash inside. You will know the total before you pay." },
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
      { href: "/blog/fruit-basket-nairobi", label: "Fruit basket guide" },
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
      "Picture the moment the door opens. A 25cm bear sits neatly beside a bouquet, while a 200cm bear can barely fit through the door. Choose from brown, white, red, pink and blue.",
    productSlugs: [
      "dream-soft-teddy", "fluffyjoy-bear", "blisshug-teddy", "tender-heart-bear", "marshmallow-bear",
      "rossyhugs-bear", "moonlight-snuggle-bear", "love-blossom-teddy-hamper",
    ],
    sections: [
      {
        heading: "Sizes and prices",
        list: [
          "25cm at KSh 3,500: fits in a child's arms, or tucks in beside flowers",
          "50cm at KSh 4,500: our everyday birthday and graduation size",
          "100cm at KSh 8,500: big enough to get a reaction at the office",
          "120cm at KSh 12,500: comes with a customized Stanley mug",
          "160cm at KSh 15,500, 180cm at KSh 17,500 and 200cm at KSh 19,500: close to life-size",
        ],
      },
      {
        heading: "Will it fit?",
        paragraphs: [
          "A 200cm bear takes up a sofa, and nobody wants to carry it home in a matatu. If the gift is going to an office or a bedsitter, go for 50cm to 100cm.",
          "Want more than a bear? Add a bouquet to your cart, or choose a hamper that already has one inside.",
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
      "Send flowers and gifts to Kenya from the USA, UK, Canada, Dubai or anywhere abroad. We have delivered to Nairobi, Nakuru and Mombasa for customers overseas.",
    h1: "Send Gifts to Kenya from Abroad",
    intro:
      "Customers in the US have used us to deliver gifts to Kilimani, Nakuru and Mombasa. Wherever you are, you can arrange a surprise for someone in Kenya online or on WhatsApp.",
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
      { href: "/blog/how-to-send-flowers-gifts-to-kenya-from-diaspora", label: "Guide for Kenyans abroad" },
      { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" },
      { href: "/gift-hampers-nairobi", label: "Gift hampers" },
    ],
  },
  {
    slug: "chocolate-gifts-nairobi",
    title: "Chocolate Gifts Nairobi | Ferrero & Lindt",
    description: "Chocolate gifts in Nairobi: Ferrero Rocher in 3 to 24 pieces, Lindt Lindor, Raffaello and Cadbury. Send them alone or with roses, delivered the same day.",
    h1: "Chocolate Gifts in Nairobi",
    intro: "Chocolate is the easiest yes in gifting. Send a small treat from KSh 400, a large Ferrero box to share, or chocolate and roses together.",
    productSlugs: ["cuddburry-choc", "ferrero-t3", "ferrero-choc", "rafaello-choc", "lindt-lindoh-assorted", "lindt-lindoh-salted", "ferrero-24", "crimson-indulgence-chocolate-rose"],
    sections: [
      { heading: "Which chocolate to send", list: ["Small thank-you: a Cadbury bar or a 3-piece Ferrero", "A colleague or friend: Raffaello or an 8-piece Ferrero", "Someone who loves dark or unusual flavours: Lindt Lindor, including salted caramel and mint", "A family or an office: a 24-piece Ferrero to pass around"] },
      { heading: "Better together", paragraphs: ["Chocolate is usually a side note to flowers, but it can carry the gift on its own with a card. Roses and chocolate sets combine both in one wrap."] },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [{ q: "Will the chocolate melt on the way?", a: "Tell us if it is a hot day or a long trip, and we will plan the delivery so it arrives in good condition." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like to send chocolates.",
    shopHref: "/collections/chocolates",
    shopLabel: "Shop all chocolates",
    related: [{ href: "/gift-hampers-nairobi", label: "Gift hampers" }, { href: "/red-roses-nairobi", label: "Red roses" }],
  },
  {
    slug: "wine-gifts-nairobi",
    title: "Wine Gifts Nairobi | Red & Sparkling",
    description: "Wine gifts in Nairobi: Robertson, Rosso Nobile and Belaire, alone or with roses and a gift card. For celebrations, couples and clients, delivered the same day.",
    h1: "Wine Gifts in Nairobi",
    intro: "A good bottle suits a promotion, a new home or a dinner for two. Send it on its own, or choose a set with flowers and a personal card.",
    productSlugs: ["robertson-red-wine", "rosso-nobile-red-wine", "luc-belaire-rare-luxe-750ml-jays", "belaire-brut-750ml", "wine-bouquet", "wambui-flowers-wine-nairobi", "romantic-rose-chocolate-wine-gift-hamper-nairobi"],
    sections: [
      { heading: "Which bottle suits who", list: ["Sweet red: Robertson, for anyone who prefers a softer glass", "Everyday red: Rosso Nobile, with a meal", "Sparkling: Belaire, for toasts and big news"] },
      { heading: "Before you send alcohol", paragraphs: ["Make sure the person drinks, and remember that the recipient must be of legal drinking age. If you are not sure, a chocolate or flower set is a safer choice."] },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [{ q: "Can I add flowers to a bottle?", a: "Yes. Choose a flowers and wine set, or message us with the bottle and bouquet you want." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like to send a wine gift.",
    shopHref: "/collections/wines",
    shopLabel: "Shop all wines",
    related: [{ href: "/flower-hamper-wine-nairobi", label: "Flowers and wine" }, { href: "/blog/flowers-and-wine-hampers-nairobi-kenya", label: "Wine hamper guide" }],
  },
  {
    slug: "flower-boxes-nairobi",
    title: "Flower Boxes Nairobi | Heart & Gift Boxes",
    description: "Flower boxes in Nairobi: red rose heart boxes, lavender boxes and gift boxes with no vase needed. A tidy choice for offices, hospitals and surprises.",
    h1: "Flower Boxes in Nairobi",
    intro: "A flower box needs no vase and holds its shape, so it is ready for a desk, a bedside table or a photo the moment it arrives.",
    productSlugs: ["box-flowers", "red-rose-flower-box", "sophia-flower-box", "lavender-heartbox", "sweet-love-heart-shaped-box-white-roses-nairobi", "kylah-flower-box", "blush-royale", "customized-flower-box-nairobi"],
    sections: [
      { heading: "Why choose a box over a bouquet", list: ["No vase or arranging for the person receiving it", "Easy to carry and easy to place", "Heart shapes make a romantic statement before they read the card"] },
      { heading: "Care tips", paragraphs: ["Keep the box out of direct sun. Add a little water if the box holds wet foam, and trim away any petals as they fade."] },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [{ q: "Can you add a name or message?", a: "Tell us your wording when you order, and we will confirm what can be customized on that box." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like a flower box.",
    shopHref: "/collections/flowers",
    shopLabel: "Shop all flowers",
    related: [{ href: "/red-roses-nairobi", label: "Red roses" }, { href: "/get-well-soon-gifts-nairobi", label: "Get well gifts" }],
  },
  {
    slug: "new-baby-gifts-nairobi",
    title: "New Baby Gifts Nairobi | Mum & Baby",
    description: "New baby gifts in Nairobi: baby boy and girl bouquets with essentials, balloons and flat bouquets, plus gifts for the new mum. Delivered to home or hospital.",
    h1: "New Baby Gifts in Nairobi",
    intro: "Most baby gifts forget the person who just gave birth. Ours can include practical essentials for the baby and something lovely for mum.",
    productSlugs: ["welcome-world-prince-baby-boy-gift-bouquet", "little-bouquet", "gift-from-god", "luxury-esther-flat-bouquet", "phenomenal-mothers"],
    sections: [
      { heading: "What new parents appreciate", list: ["Practical essentials they will actually use", "A flat bouquet, which is easy to carry into a ward", "Something for mum, such as chocolates or a care set", "A short card that does not ask them to call or reply"] },
      { heading: "Delivering to the hospital or home", paragraphs: ["Check the ward's visiting and flower rules first. If you are delivering to a home, ask a family member for a good time, because new parents rest when they can."] },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [{ q: "Do you have options for boys and girls?", a: "Yes. Tell us the baby's gender and name, and we will match the colours and the card." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like a new baby gift.",
    shopHref: "/collections/kids",
    shopLabel: "Shop gifts for kids",
    related: [{ href: "/blog/newborn-baby-gifts", label: "Newborn gift guide" }, { href: "/blog/diaper-bouquet-nairobi", label: "Diaper bouquets" }],
  },
  {
    slug: "gifts-for-her-nairobi",
    title: "Gifts for Her Nairobi | Wife & Girlfriend",
    description: "Gifts for her in Nairobi: romance boxes, roses with teddy bears, jewellery sets and care packages for your wife, girlfriend, mum, sister or best friend.",
    h1: "Gifts for Her in Nairobi",
    intro: "The best gift shows you were paying attention. Start with who she is to you, then choose something that matches what she enjoys.",
    productSlugs: ["true-romance-giftbox", "brenda-luxury-gift-set", "sweetheart-snuggler", "pure-romance", "sweet-love-heart-shaped-box-white-roses-nairobi", "love-blossom-teddy-hamper", "period-care-box", "phenomenal-mothers"],
    sections: [
      { heading: "Ideas by relationship", list: ["Wife: a romance box or rose set, with a note about something she did this week", "Girlfriend: roses with a teddy bear, delivered to her office", "Mum: a soft-coloured bouquet with chocolates", "Sister or best friend: a care package, or chocolates with a funny card"] },
      { heading: "Plan the surprise", paragraphs: ["Choose a place where she will actually be, and quietly check her schedule. Give the rider a contact who can help without spoiling the surprise."] },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [{ q: "Can you keep it a surprise?", a: "Yes. Tell us it is a surprise, and share a contact who can help the rider reach her." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I need help choosing a gift for her.",
    shopHref: "/collections/womens",
    shopLabel: "Shop gifts for women",
    related: [{ href: "/blog/best-gifts-for-wives-nairobi", label: "Gifts for wives" }, { href: "/blog/birthday-gifts-for-her-kenya", label: "Birthday gifts for her" }],
  },
  {
    slug: "gifts-for-him-nairobi",
    title: "Gifts for Him Nairobi | Husband & Dad",
    description: "Gifts for him in Nairobi: watch and belt sets, custom fleeces, wine and hampers for your husband, boyfriend, dad or boss. Same-day delivery when you order by 6PM.",
    h1: "Gifts for Him in Nairobi",
    intro: "Men do like receiving gifts, but they usually prefer something they can wear, drink or share. Here is what works for the men in your life.",
    productSlugs: ["mens-yazole-watch-leather-belt-gift-set", "charming-fleece", "belaire-brut-750ml", "robertson-red-wine", "deluxe-gift-set", "ferrero-24"],
    sections: [
      { heading: "Ideas by relationship", list: ["Husband or boyfriend: a watch and leather belt set, or a personalized fleece", "Dad: a fleece or a large box of chocolates to share", "Boss or client: a bottle of sparkling wine and a card", "Friend: wine or chocolates with an inside joke on the card"] },
      { heading: "Should you send him flowers?", paragraphs: ["Plenty of men enjoy flowers, even if few admit it. If you want to try it, choose a clean, simple bouquet and pair it with something he will use."] },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [{ q: "Can I personalize the fleece?", a: "Yes. Our fleeces can be customized in all colours. Send us your wording and colour on WhatsApp." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I need help choosing a gift for him.",
    shopHref: "/collections/mens",
    shopLabel: "Shop gifts for men",
    related: [{ href: "/blog/mens-gift-ideas", label: "Gift ideas for men" }, { href: "/blog/fathers-day-gifts-nairobi", label: "Father's Day gifts" }],
  },
  {
    slug: "valentines-gifts-nairobi",
    title: "Valentine's Gifts Nairobi | Book Early",
    description: "Valentine's gifts in Nairobi: red roses by the hundred, giant teddy bears and romance boxes. Book early for 14 February, since delivery slots fill quickly.",
    h1: "Valentine's Gifts in Nairobi",
    intro: "14 February is the busiest day of the florist's year. Choose early, tell us where and when, and let us worry about the traffic.",
    productSlugs: ["luxury-red-roses-valentine-bouquet", "true-romance-giftbox", "endless-love-rose-bouquet-nairobi", "forever-love-proposal-nairobi", "pure-romance", "cupid-special", "love-bug", "eternal-love"],
    sections: [
      { heading: "Plan ahead", list: ["Choose and pay early so that your gift is reserved", "Give the office or home address, plus a backup contact", "Have your card message ready when you order"] },
      { heading: "Ideas by budget", paragraphs: ["A rose bouquet with a personal card is a classic. Add chocolate for more, a teddy bear for a bigger reaction, or go all out with 100 roses or more."] },
      { heading: "Delivery", paragraphs: ["Roads and riders are at their busiest around Valentine's Day, so message us early to agree your delivery window. Fees depend on the area and appear at checkout."] },
    ],
    faqs: [{ q: "Can you deliver at an exact time on 14 February?", a: "Tell us the time you want, and we will agree the best window with you when you book." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like to book a Valentine's gift.",
    shopHref: "/collections/valentines",
    shopLabel: "Shop Valentine's gifts",
    related: [{ href: "/red-roses-nairobi", label: "Red roses" }, { href: "/blog/valentines-day-gifts-ideas-nairobi", label: "Valentine's gift ideas" }],
  },
  {
    slug: "mothers-day-gifts-nairobi",
    title: "Mother's Day Gifts Nairobi | Flowers & More",
    description: "Mother's Day gifts in Nairobi: soft bouquets, chocolates, fruit baskets and gift sets for mum, delivered to her home. Book ahead for the busy weekend.",
    h1: "Mother's Day Gifts in Nairobi",
    intro: "Mum probably does not need another mug. Flowers she can show off, treats she can share, and a note in your own words will go much further.",
    productSlugs: ["phenomenal-mothers", "brenda-luxury-gift-set", "blooming-comfort", "deluxe-gift-set", "healthy-fruit-gift-basket", "lindt-lindoh-assorted"],
    sections: [
      { heading: "What mums enjoy", list: ["A soft-coloured bouquet for the living room", "A fruit basket for the whole family", "A gift set with chocolates and a card", "Your own words, even just two lines"] },
      { heading: "Sending from abroad or upcountry", paragraphs: ["Give us a phone number for her or a sibling, and tell us whether she usually goes to church that morning, so that the delivery does not miss her."] },
      { heading: "Delivery", paragraphs: [CATEGORY_DELIVERY] },
    ],
    faqs: [{ q: "How early should I order?", a: "Order a few days ahead for Mother's Day weekend, because it is one of our busiest times." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like a Mother's Day gift.",
    shopHref: "/collections/womens",
    shopLabel: "Shop gifts for women",
    related: [{ href: "/blog/mothers-day-gifts-nairobi-kenya", label: "Mother's Day guide" }, { href: "/send-gifts-to-kenya", label: "Send from abroad" }],
  },
  {
    slug: "flower-delivery-kilimani-nairobi",
    title: "Flower Delivery Kilimani | KSh 300 Same Day",
    description: "Flower delivery to Kilimani for KSh 300. Order by 6PM for same-day delivery to apartments and offices. Even customers in the US have sent gifts here with us.",
    h1: "Flower Delivery in Kilimani",
    intro: "Kilimani is one of our regular delivery areas, including for customers overseas. Delivery is KSh 300, and orders placed by 6PM can arrive the same day.",
    productSlugs: ["crimson-love-roses", "100-reasons", "deluxe-gift-set", "red-rose-flower-box", "blisshug-teddy", "get-well-soon-fruit-basket-flower-bouquet-colleague"],
    sections: [
      { heading: "Help the rider find them", list: ["The apartment or office name, and the road it is on", "The block, floor and door number", "Whether the gate needs a call or a name left with security", "A phone number for someone who will be there"] },
      { heading: "Popular in Kilimani", paragraphs: ["Flower boxes suit apartments and desks because they need no vase. Chocolates and flowers make a quick after-work surprise, and a teddy bear can be left with reception."] },
    ],
    faqs: [{ q: "Can security or reception receive the gift?", a: "Yes, if you are happy with that. Tell us who to leave it with, and whether the recipient should be told." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like flowers delivered in Kilimani.",
    shopHref: "/collections/flowers",
    shopLabel: "Shop flowers",
    related: [{ href: "/same-day-delivery-nairobi", label: "Same-day delivery" }, { href: "/flower-delivery-nairobi", label: "Flower delivery Nairobi" }],
  },
  {
    slug: "flower-delivery-nakuru",
    title: "Flower & Gift Delivery to Nakuru",
    description: "Send flowers and gifts to Nakuru from Nairobi or abroad. We have delivered to Nakuru for customers in the US. Message us to confirm the fee and delivery day.",
    h1: "Flower and Gift Delivery to Nakuru",
    intro: "You don't need a local shop to surprise someone in Nakuru. We have delivered there for customers as far away as the US, and we confirm the details with you on WhatsApp.",
    productSlugs: ["deluxe-gift-set", "golden-celebration-gift-hamper", "blisshug-teddy", "ferrero-24", "100-reasons", "phenomenal-mothers"],
    sections: [
      { heading: "How delivery outside Nairobi works", list: ["Send us the gift you want and the address in Nakuru", "We confirm the fee and delivery day before you pay", "Orders outside Nairobi usually arrive from the next day onwards, not the same day"] },
      { heading: "Choosing a gift that travels well", paragraphs: ["Teddy bears, chocolates, wine and gift sets handle the trip easily. If you want fresh flowers, order ahead and tell us the date, so that we can plan for them to arrive looking their best."] },
    ],
    faqs: [{ q: "Can you deliver to Nakuru the same day?", a: "Plan for next-day delivery or later. Message us with your date and we will confirm what is possible." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like to send a gift to Nakuru.",
    shopHref: "/collections",
    shopLabel: "Browse all gifts",
    related: [{ href: "/flower-delivery-mombasa", label: "Delivery to Mombasa" }, { href: "/send-gifts-to-kenya", label: "Send from abroad" }],
  },
  {
    slug: "flower-delivery-mombasa",
    title: "Flower & Gift Delivery to Mombasa",
    description: "Send flowers and gifts to Mombasa from Nairobi or abroad. We have delivered to Mombasa for customers in the US. Message us to confirm the fee and delivery day.",
    h1: "Flower and Gift Delivery to Mombasa",
    intro: "Mombasa is a long way from University Way, but not out of reach. We have delivered there for overseas customers, and we plan each order with you first.",
    productSlugs: ["deluxe-gift-set", "golden-celebration-gift-hamper", "fluffyjoy-bear", "lindt-lindoh-assorted", "belaire-brut-750ml", "true-romance-giftbox"],
    sections: [
      { heading: "How delivery outside Nairobi works", list: ["Tell us the gift, the address in Mombasa and the date you need", "We confirm the fee and delivery day before you pay", "Allow extra time, and contact us early for birthdays and anniversaries"] },
      { heading: "Planning for the coast", paragraphs: ["Mombasa's heat is hard on flowers and chocolate, so tell us if the gift includes either, and we will advise you on the best way to send it. Teddy bears and gift sets are the simplest options."] },
    ],
    faqs: [{ q: "How long does delivery to Mombasa take?", a: "Message us with the address and date, and we will confirm it before you pay." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I would like to send a gift to Mombasa.",
    shopHref: "/collections",
    shopLabel: "Browse all gifts",
    related: [{ href: "/flower-delivery-nakuru", label: "Delivery to Nakuru" }, { href: "/send-gifts-to-kenya", label: "Send from abroad" }],
  },
  {
    slug: "send-flowers-to-kenya-from-usa",
    title: "Send Flowers to Kenya from the USA",
    description: "Send flowers to Kenya from the USA. Customers in the US have delivered to Kilimani, Nakuru and Mombasa with us. Plan around the time difference and pay by card.",
    h1: "Send Flowers to Kenya from the USA",
    intro: "This is not theory. Customers in the US have sent gifts through us to Kilimani, Nakuru and Mombasa. Here is how to do it from your side of the world.",
    productSlugs: ["100-reasons", "true-romance-giftbox", "phenomenal-mothers", "get-well-soon-fruit-basket-flower-bouquet-colleague", "blisshug-teddy", "golden-celebration-gift-hamper"],
    sections: [
      { heading: "Mind the time difference", paragraphs: ["Kenya is 7 to 8 hours ahead of New York and 10 to 11 hours ahead of Los Angeles, depending on daylight saving. Our 6PM same-day cut-off is 10AM or 11AM in New York, so if you are ordering in the US afternoon, plan for the next day in Kenya."] },
      { heading: "How to order", list: ["Choose your gift and pay by card at checkout, or message us on WhatsApp", "Give the recipient's name, Kenyan phone number and location", "Tell us whether it should be a surprise", "We confirm delivery and keep you updated. Ask us if you would like a delivery photo"] },
      { heading: "What it costs", paragraphs: ["Prices are in Kenyan Shillings, and your bank converts them when you pay. Delivery in Nairobi depends on the area, and we confirm the fee for places such as Nakuru or Mombasa before you pay."] },
    ],
    faqs: [{ q: "Can you deliver outside Nairobi?", a: "Yes. We have delivered to Nakuru and Mombasa for US customers. Message us with the address and we will confirm the fee and date." }, { q: "Can I pay with a US card?", a: "Our checkout accepts card payment. If your bank has any trouble with it, message us on WhatsApp and we will help." }],
    whatsappMessage: "Hello Floral Whispers Gifts, I am in the USA and want to send a gift to Kenya.",
    shopHref: "/collections",
    shopLabel: "Browse all gifts",
    related: [{ href: "/send-gifts-to-kenya", label: "Send from any country" }, { href: "/flower-delivery-nakuru", label: "Delivery to Nakuru" }, { href: "/flower-delivery-mombasa", label: "Delivery to Mombasa" }],
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
  { match: /valentine/i, slug: "valentines-gifts-nairobi" },
  { match: /mother/i, slug: "mothers-day-gifts-nairobi" },
  { match: /baby|newborn|diaper/i, slug: "new-baby-gifts-nairobi" },
  { match: /nakuru/i, slug: "flower-delivery-nakuru" },
  { match: /mombasa/i, slug: "flower-delivery-mombasa" },
  { match: /kilimani/i, slug: "flower-delivery-kilimani-nairobi" },
  { match: /roses?\b|romantic|anniversary/i, slug: "red-roses-nairobi" },
  { match: /\bmens?\b|father|dad|husband|boyfriend/i, slug: "gifts-for-him-nairobi" },
  { match: /wife|wives|women|girlfriend|her\b/i, slug: "gifts-for-her-nairobi" },
  { match: /wine|belaire|rosso|robertson/i, slug: "wine-gifts-nairobi" },
  { match: /choc|ferrero|lindt|raffaello/i, slug: "chocolate-gifts-nairobi" },
  { match: /box/i, slug: "flower-boxes-nairobi" },
  { match: /hamper|gift|birthday/i, slug: "gift-hampers-nairobi" },
];

export function resolveCategoryLink(text: string): { href: string; label: string } | null {
  const slug = CATEGORY_LINK_RULES.find((r) => r.match.test(text))?.slug;
  if (!slug) return null;
  return { href: `/${slug}`, label: getCategoryPage(slug).h1 };
}
