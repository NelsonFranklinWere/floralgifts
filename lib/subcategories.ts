// Subcategory definitions for each product category

export const SUBCATEGORIES = {
  flowers: [
    "Anniversary",
    "Get Well Soon",
    "I'm Sorry",
    "Graduation",
    "Birthday",
    "Wedding",
    "Funeral",
    "Valentine",
    "Romantic",
    "Congratulations",
    "Thank You",
    "New Baby",
    "Just Because",
    "Mothers Day Gifts",
    "Men Gifts",
    "Girlfriend Day Gifts",
    "Mens Day Gifts",
  ],
  hampers: [], // Gift hampers have no subcategories, they use included_items instead
  teddy: [
    "25cm",
    "50cm",
    "100cm",
    "120cm",
    "160cm",
    "180cm",
    "200cm",
  ],
  wines: [], // Wines have no subcategories
  chocolates: [], // Chocolates have no subcategories
} as const;

export type FlowerSubcategory = typeof SUBCATEGORIES.flowers[number];
export type HamperSubcategory = typeof SUBCATEGORIES.hampers[number];
export type TeddySubcategory = typeof SUBCATEGORIES.teddy[number];
export type WineSubcategory = typeof SUBCATEGORIES.wines[number];
export type ChocolateSubcategory = typeof SUBCATEGORIES.chocolates[number];

export type Subcategory = 
  | FlowerSubcategory 
  | HamperSubcategory 
  | TeddySubcategory 
  | WineSubcategory 
  | ChocolateSubcategory;

export function getSubcategoriesForCategory(
  category: "flowers" | "hampers" | "teddy" | "wines" | "chocolates"
): readonly string[] {
  return SUBCATEGORIES[category] || [];
}

