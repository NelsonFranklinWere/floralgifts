/**
 * Date-aware seasonal SEO config.
 * Injects Valentine's, Mother's Day, etc. keywords ONLY during their windows.
 * Defaults to evergreen copy the rest of the year (May 2026 = evergreen).
 */

export type SeasonalTheme =
  | "evergreen"
  | "valentines"
  | "womens-day"
  | "mothers-day"
  | "fathers-day"
  | "christmas";

export interface SeasonalCopy {
  theme: SeasonalTheme;
  tagline: string;
  homeTitle: string;
  homeDescription: string;
  extraKeywords: string[];
}

const EVERGREEN: SeasonalCopy = {
  theme: "evergreen",
  tagline: "Nairobi's Premium Florist",
  homeTitle: "Same-Day Flower & Gift Delivery Nairobi",
  homeDescription:
    "Nairobi's premium florist for fresh roses, gift hampers, teddy bears and wine. Same-day delivery to CBD, Westlands, Karen and Lavington. Order online with M-Pesa or WhatsApp.",
  extraKeywords: [
    "florist Nairobi",
    "flower delivery Nairobi",
    "gift hampers Nairobi",
    "same day delivery Nairobi",
    "premium florist Kenya",
  ],
};

const SEASONAL: Record<Exclude<SeasonalTheme, "evergreen">, SeasonalCopy> = {
  valentines: {
    theme: "valentines",
    tagline: "Valentine's Day Flowers & Gifts Nairobi",
    homeTitle: "Valentine's Flowers & Romantic Gifts Nairobi",
    homeDescription:
      "Romantic Valentine's roses, teddy bears and gift hampers with same-day delivery across Nairobi. Pre-order or order today — M-Pesa & WhatsApp accepted.",
    extraKeywords: [
      "valentine's flowers Nairobi",
      "valentine's roses Nairobi",
      "valentine's gift hampers Nairobi",
      "romantic gifts Nairobi",
    ],
  },
  "womens-day": {
    theme: "womens-day",
    tagline: "International Women's Day Gifts Nairobi",
    homeTitle: "Women's Day Flowers & Gift Hampers Nairobi",
    homeDescription:
      "Celebrate the women in your life with fresh flowers, luxury hampers and thoughtful gifts. Same-day delivery across Nairobi.",
    extraKeywords: ["women's day gifts Nairobi", "flowers for her Nairobi"],
  },
  "mothers-day": {
    theme: "mothers-day",
    tagline: "Mother's Day Flowers & Gifts Nairobi",
    homeTitle: "Mother's Day Flowers & Hampers Nairobi",
    homeDescription:
      "Beautiful Mother's Day bouquets, roses and gift hampers delivered same-day across Nairobi. Show Mum she matters.",
    extraKeywords: [
      "mother's day flowers Nairobi",
      "mother's day hampers Nairobi",
      "gifts for mum Nairobi",
    ],
  },
  "fathers-day": {
    theme: "fathers-day",
    tagline: "Father's Day Gifts Nairobi",
    homeTitle: "Father's Day Gift Hampers & Wine Nairobi",
    homeDescription:
      "Thoughtful Father's Day hampers, wine gifts and premium presents with same-day Nairobi delivery.",
    extraKeywords: ["father's day gifts Nairobi", "gifts for dad Nairobi"],
  },
  christmas: {
    theme: "christmas",
    tagline: "Christmas Flowers & Gift Hampers Nairobi",
    homeTitle: "Christmas Flowers & Holiday Hampers Nairobi",
    homeDescription:
      "Festive Christmas flowers, holiday hampers and gift baskets with same-day delivery across Nairobi.",
    extraKeywords: [
      "christmas flowers Nairobi",
      "christmas hampers Nairobi",
      "holiday gifts Nairobi",
    ],
  },
};

/** Resolve active season from calendar date (defaults to server/build time). */
export function getActiveSeason(date: Date = new Date()): SeasonalTheme {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 1 && day >= 15) || (month === 2 && day <= 14)) return "valentines";
  if (month === 3 && day <= 10) return "womens-day";
  if (month === 5 && day <= 15) return "mothers-day";
  if (month === 6 && day <= 21) return "fathers-day";
  if ((month === 11 && day >= 15) || month === 12) return "christmas";

  return "evergreen";
}

export function getSeasonalCopy(date: Date = new Date()): SeasonalCopy {
  const theme = getActiveSeason(date);
  if (theme === "evergreen") return EVERGREEN;
  return SEASONAL[theme];
}

/** Category-level seasonal keywords — empty array when out of season. */
export function getCategorySeasonalKeywords(
  category: string,
  date: Date = new Date()
): string[] {
  const theme = getActiveSeason(date);
  if (theme === "evergreen") return [];

  const map: Partial<Record<SeasonalTheme, Record<string, string[]>>> = {
    valentines: {
      flowers: ["valentine's roses Nairobi", "valentine's bouquet Nairobi"],
      teddy: ["valentine's teddy bears Nairobi"],
      hampers: ["valentine's gift hampers Nairobi"],
      wines: ["valentine's wine gifts Nairobi"],
      chocolates: ["valentine's chocolates Nairobi"],
    },
    "mothers-day": {
      flowers: ["mother's day flowers Nairobi"],
      hampers: ["mother's day hampers Nairobi"],
    },
    christmas: {
      flowers: ["christmas flowers Nairobi"],
      hampers: ["christmas hampers Nairobi"],
    },
  };

  return map[theme]?.[category] ?? [];
}
