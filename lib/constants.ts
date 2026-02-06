export const BRAND_COLORS = {
  green: "#10b981",
  pink: "#ec4899",
  red: "#ef4444",
  white: "#ffffff",
} as const;

export const SHOP_INFO = {
  name: "Floral Whispers Gifts",
  phone: "254721554393",
  whatsapp: "254721554393",
  email: "whispersfloral@gmail.com",
  address: "Delta House, University Way",
  instagram: "@floralwhispersgifts",
  facebook: "FloralWhispersGifts",
  twitter: "@FloralWhispers",
  tiktok: "@floralwhispers",
  hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
  mpesa: {
    paybill: "400200",
    account: "40040549",
    till: "8618626",
  },
} as const;

export const DELIVERY_ZONES = {
  nairobi: {
    name: "Nairobi",
    sameDay: true,
    nextDay: true,
  },
  outside: {
    name: "Outside Nairobi",
    sameDay: false,
    nextDay: true,
  },
} as const;

export const PRODUCT_CATEGORIES = {
  flowers: "flowers",
  hampers: "hampers",
  teddy: "teddy",
} as const;

export const FLOWER_TAGS = [
  "birthday",
  "anniversary",
  "get well soon",
  "funeral",
  "congrats",
  "wedding",
  "valentine",
] as const;

export const TEDDY_SIZES = [25, 50, 100, 120, 160, 180, 200] as const;

export const TEDDY_COLORS = [
  { name: "brown", hex: "#8B4513" },
  { name: "red", hex: "#DC2626" },
  { name: "white", hex: "#FFFFFF" },
  { name: "pink", hex: "#EC4899" },
  { name: "blue", hex: "#3B82F6" },
] as const;

export const ORDER_STATUS = {
  pending: "pending",
  paid: "paid",
  failed: "failed",
  cancelled: "cancelled",
  shipped: "shipped",
} as const;

export const DELIVERY_LOCATIONS = [
  // Free delivery
  { name: "Nairobi CBD", fee: 0 },

  // 200
  { name: "Upper Hill", fee: 200 },

  // 300
  { name: "South B", fee: 300 },
  { name: "Nairobi West", fee: 300 },
  { name: "South C", fee: 300 },
  { name: "Westlands", fee: 300 },
  { name: "Kilimani", fee: 300 },
  { name: "Kileleshwa", fee: 300 },

  // 400
  { name: "Industrial Area", fee: 400 },
  { name: "Garden City", fee: 400 },
  { name: "Buruburu", fee: 400 },
  { name: "Umoja 1", fee: 400 },
  { name: "Umoja 2", fee: 400 },
  { name: "Lavington", fee: 400 },
  { name: "Valley Arcade", fee: 400 },
  { name: "James Gicheru Road", fee: 400 },
  { name: "Uthiru", fee: 400 },
  { name: "Corner", fee: 400 },
  { name: "Donholm", fee: 500 }, // updated below in 500 section for clarity

  // 500
  { name: "Langata", fee: 500 },
  { name: "Runda", fee: 500 },
  { name: "Village Market", fee: 500 },
  { name: "GilGil", fee: 500 },
  { name: "Roysambu", fee: 500 },
  { name: "Kasarani", fee: 500 },
  { name: "Bee Centre", fee: 500 },
  { name: "Kayole", fee: 500 },
  { name: "Komarok", fee: 500 },
  { name: "Nyayo Estate", fee: 500 },
  { name: "Nyayo", fee: 500 },
  { name: "Embakasi", fee: 500 },
  { name: "Pipeline", fee: 500 },
  { name: "Fedha", fee: 500 },
  { name: "Upcountry", fee: 500 },
  { name: "Kawangware", fee: 500 },
  { name: "Satellite", fee: 500 },
  { name: "Dagoreti", fee: 500 },
  { name: "Bomas", fee: 500 },
  { name: "Gachie", fee: 500 },
  { name: "Kitsuru", fee: 500 },
  { name: "Donholm", fee: 500 },

  // 600
  { name: "Mwiki", fee: 600 },
  { name: "LuckySami", fee: 600 },
  { name: "Rongai", fee: 600 },
  { name: "Karen", fee: 600 },
  { name: "Kayole Junction", fee: 600 },
  { name: "Uthiru (Extended)", fee: 600 },
  { name: "Kinoo", fee: 600 },
  { name: "Kahawa West", fee: 600 },
  { name: "Riruta", fee: 600 },

  // 700
  { name: "Utawala", fee: 700 },
  { name: "Gateway Mall", fee: 700 },
  { name: "Syokimau", fee: 700 },
  { name: "Ruaka", fee: 700 },
  { name: "Njiru", fee: 700 },
  { name: "Kahawa Wendani", fee: 700 },
  { name: "Kahawa Sukari", fee: 700 },
  { name: "KU", fee: 700 },
  { name: "Hurlingham", fee: 350 }, // keeps original special case

  // 800
  { name: "Ruai", fee: 800 },
  { name: "Bypass", fee: 800 },
  { name: "Mebrine", fee: 800 },
  { name: "Mlolongo", fee: 800 },
  { name: "Ngong", fee: 800 },

  // 900
  { name: "Ruiru", fee: 900 },
  { name: "Banana", fee: 900 },
  { name: "Ngong Town", fee: 900 },

  // 1000
  { name: "Athi River", fee: 1000 },
  { name: "Kiserian", fee: 1000 },
  { name: "Kamulu", fee: 1000 },
  { name: "Joska", fee: 1000 },
  { name: "Kiambu", fee: 1000 },

  // 1200
  { name: "Kitengela (Inner)", fee: 1200 },

  // 1500
  { name: "Kitengela", fee: 1500 },
  { name: "Limuru", fee: 1500 },

  // Other existing zones
  { name: "Parklands", fee: 300 },
  { name: "Thindigua", fee: 500 },
  { name: "Zambezi", fee: 600 },
  { name: "Kikuyu", fee: 700 },
] as const;

