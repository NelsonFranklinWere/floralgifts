import { SHOP_INFO } from "./constants";
import { formatCurrency, formatDateTime } from "./utils";

export interface WhatsAppOrderItem {
  name: string;
  quantity: number;
  price: number;
  options?: Record<string, string>;
}

export interface WhatsAppOrderData {
  items: WhatsAppOrderItem[];
  total: number;
  customerName?: string;
  phone?: string;
  address?: string;
  deliveryDate?: string;
  notes?: string;
}

export function generateWhatsAppLink(data: WhatsAppOrderData): string {
  const items = data.items
    .map(
      (item) =>
        `${item.quantity}x ${item.name} ${item.options ? `(${Object.values(item.options).join(", ")})` : ""} - ${formatCurrency(item.price * item.quantity)}`
    )
    .join("\n");

  let message = `Hello! I'd like to place an order:\n\n`;
  message += `*Items:*\n${items}\n\n`;
  message += `*Total: ${formatCurrency(data.total)}*\n\n`;

  if (data.customerName) {
    message += `*Name:* ${data.customerName}\n`;
  }
  if (data.phone) {
    message += `*Phone:* ${data.phone}\n`;
  }
  if (data.address) {
    message += `*Delivery Address:* ${data.address}\n`;
  }
  if (data.deliveryDate) {
    message += `*Delivery Date:* ${data.deliveryDate}\n`;
  }
  if (data.notes) {
    message += `*Notes:* ${data.notes}\n`;
  }

  message += `\nPlease confirm availability and delivery time. Thank you!`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SHOP_INFO.whatsapp}?text=${encoded}`;
}

export function generateProductWhatsAppLink(
  productName: string,
  price: number,
  quantity: number = 1
): string {
  const message = `Hello! I'm interested in:\n\n*${productName}*\nQuantity: ${quantity}\nPrice: ${formatCurrency(price)}\n\nPlease let me know availability and delivery options.`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SHOP_INFO.whatsapp}?text=${encoded}`;
}

