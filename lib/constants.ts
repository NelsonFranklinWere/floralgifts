export const BRAND_COLORS = {
  green: "#10b981",
  pink: "#ec4899",
  red: "#ef4444",
  white: "#ffffff",
} as const;

export const SHOP_INFO = {
  name: "Floral Whispers Gifts",
  phone: "2547221554393",
  whatsapp: "2547221554393",
  email: "whispersfloral@gmail.com",
  address: "Delta House, University Way",
  instagram: "@floralwhispersgifts",
  facebook: "FloralWhispersGifts",
  twitter: "@FloralWhispers",
  tiktok: "@floralwhispers",
  hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
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
  { name: "Donholm", fee: 300 },
  { name: "Kilimani", fee: 300 },
  { name: "Kileleshwa", fee: 300 },
  { name: "Umoja", fee: 500 },
  { name: "Rongai", fee: 600 },
  { name: "Ngong", fee: 800 },
  { name: "Embakasi", fee: 700 },
  { name: "Pipeline", fee: 700 },
  { name: "Utawala", fee: 700 },
  { name: "Kiambu", fee: 1000 },
  { name: "Nyayo", fee: 500 },
  { name: "Fedha", fee: 500 },
] as const;

