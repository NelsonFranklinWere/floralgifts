import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.substring(1);
  } else if (!cleaned.startsWith("254")) {
    cleaned = "254" + cleaned;
  }
  return cleaned;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function validatePhone(phone: string): boolean {
  const cleaned = formatPhone(phone);
  // Allow Kenyan phone formats:
  // - 07xx (2547xxxxxxxx) - 12 digits total
  // - 011x (25411xxxxxxx) - 12 digits total
  // - 01xx (2541xxxxxxxx) - 12 digits total (other 01 prefixes)
  return /^254(7\d{8}|1\d{8})$/.test(cleaned);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

export function validateDeliveryDate(
  date: string,
  time: string,
  isNairobi: boolean = true
): { valid: boolean; message?: string } {
  const deliveryDateTime = new Date(`${date}T${time}`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (deliveryDateTime < now) {
    return { valid: false, message: "Delivery date must be in the future" };
  }

  if (isNairobi) {
    const sameDayCutoff = new Date(today);
    sameDayCutoff.setHours(14, 0, 0, 0); // 2 PM cutoff

    if (deliveryDateTime.toDateString() === today.toDateString() && now > sameDayCutoff) {
      return {
        valid: false,
        message: "Same-day delivery orders must be placed before 2 PM",
      };
    }
  } else {
    if (deliveryDateTime.toDateString() === today.toDateString()) {
      return { valid: false, message: "Outside Nairobi orders require next-day delivery" };
    }
  }

  return { valid: true };
}

export function validateAmount(amount: number): boolean {
  return amount > 0 && amount <= 100000000; // Max 1M KES
}

export function validateQuantity(quantity: number): boolean {
  return quantity > 0 && quantity <= 100;
}

/**
 * Get the default fallback image for a product category
 */
export function getCategoryFallbackImage(category: string): string {
  switch (category) {
    case "flowers":
      return "/images/products/flowers/BouquetFlowers1.jpg";
    case "teddy":
      return "/images/products/teddies/Teddybear1.jpg";
    case "hampers":
      return "/images/products/hampers/giftamper.jpg";
    case "wines":
      return "/images/products/hampers/giftamper.jpg"; // Using hamper image as placeholder
    case "chocolates":
      return "/images/products/hampers/giftamper.jpg"; // Using hamper image as placeholder
    default:
      return "/images/products/flowers/BouquetFlowers1.jpg";
  }
}

