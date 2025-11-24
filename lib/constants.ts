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
  { name: "Nairobi CBD", fee: 0 },
  { name: "Kitengela", fee: 1200 },
  { name: "Syokimau", fee: 600 },
  { name: "Mlolongo", fee: 1000 },
  { name: "Parklands", fee: 300 },
  { name: "Westlands", fee: 300 },
  { name: "Donholm", fee: 400 },
  { name: "Kilimani", fee: 300 },
  { name: "Kileleshwa", fee: 300 },
  { name: "Umoja", fee: 500 },
  { name: "Rongai", fee: 600 },
  { name: "Ngong", fee: 800 },
  { name: "Embakasi", fee: 500 },
  { name: "Pipeline", fee: 500 },
  { name: "Utawala", fee: 700 },
  { name: "Kiambu", fee: 1000 },
  { name: "Nyayo", fee: 500 },
  { name: "Fedha", fee: 500 },
  { name: "Ruiru", fee: 800 },
  { name: "Kasarani", fee: 500 },
  { name: "Mwiki", fee: 600 },
  { name: "Thindigua", fee: 500 },
  { name: "Karen", fee: 600 },
  { name: "Upcountry", fee: 500 },
  { name: "Uthiru", fee: 400 },
  { name: "Kawangware", fee: 500 },
  { name: "Satellite", fee: 500 },
  { name: "Dagoreti", fee: 500 },
  { name: "Corner", fee: 400 },
  { name: "Hurlingham", fee: 350 },
  { name: "Bomas", fee: 500 },
  { name: "Langata", fee: 400 },
  { name: "Zambezi", fee: 600 },
  { name: "Kinoo", fee: 700 },
  { name: "Kikuyu", fee: 700 },
] as const;

