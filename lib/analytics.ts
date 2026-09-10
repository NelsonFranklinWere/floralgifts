"use client";

import Cookies from "js-cookie";
import { META_PIXEL_ID } from "@/lib/constants";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

/** Fire a Meta Pixel standard/custom event when the pixel is loaded. */
function trackMeta(
  event: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
) {
  if (typeof window === "undefined" || !META_PIXEL_ID || !window.fbq) return;
  try {
    if (options?.eventID) {
      window.fbq("track", event, params || {}, { eventID: options.eventID });
    } else {
      window.fbq("track", event, params || {});
    }
  } catch {
    // Pixel must never break the shop
  }
}

function kes(amountCents: number): number {
  return Math.round((amountCents / 100) * 100) / 100;
}

// Analytics tracking with hidden cookies + Meta Pixel forwarding
export class Analytics {
  private static readonly COOKIE_NAME = "_fw_analytics";
  private static readonly SESSION_COOKIE = "_fw_session";
  private static readonly USER_ID_COOKIE = "_fw_uid";

  static getUserId(): string {
    let userId = Cookies.get(this.USER_ID_COOKIE);
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      Cookies.set(this.USER_ID_COOKIE, userId, { expires: 365, sameSite: "lax" });
    }
    return userId;
  }

  static getSessionId(): string {
    let sessionId = Cookies.get(this.SESSION_COOKIE);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      Cookies.set(this.SESSION_COOKIE, sessionId, { expires: 1, sameSite: "lax" });
    }
    return sessionId;
  }

  /** Meta PageView — also fired by the base pixel snippet on first load */
  static trackPageView(path: string, title?: string) {
    if (typeof window === "undefined") return;

    const data = {
      event: "page_view",
      path,
      title: title || document.title,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
    };

    Cookies.set(this.COOKIE_NAME, JSON.stringify(data), { expires: 1, sameSite: "lax" });
    this.sendToServer(data);
    trackMeta("PageView");
  }

  /** Meta ViewContent */
  static trackProductView(
    productId: string,
    productName: string,
    category: string,
    price: number
  ) {
    if (typeof window === "undefined") return;

    const data = {
      event: "product_view",
      productId,
      productName,
      category,
      price,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      timestamp: new Date().toISOString(),
    };

    this.sendToServer(data);
    trackMeta("ViewContent", {
      content_ids: [productId],
      content_name: productName,
      content_type: "product",
      content_category: category,
      value: kes(price),
      currency: "KES",
    });
  }

  /** Meta AddToCart */
  static trackAddToCart(
    productId: string,
    productName: string,
    price: number,
    quantity: number
  ) {
    if (typeof window === "undefined") return;

    const data = {
      event: "add_to_cart",
      productId,
      productName,
      price,
      quantity,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      timestamp: new Date().toISOString(),
    };

    this.sendToServer(data);
    trackMeta("AddToCart", {
      content_ids: [productId],
      content_name: productName,
      content_type: "product",
      value: kes(price * quantity),
      currency: "KES",
      contents: [{ id: productId, quantity }],
      num_items: quantity,
    });
  }

  /** Meta InitiateCheckout */
  static trackCheckoutStart(total: number, items: number, contentIds?: string[]) {
    if (typeof window === "undefined") return;

    const data = {
      event: "checkout_start",
      total,
      items,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      timestamp: new Date().toISOString(),
    };

    this.sendToServer(data);
    trackMeta("InitiateCheckout", {
      content_ids: contentIds || [],
      content_type: "product",
      value: kes(total),
      currency: "KES",
      num_items: items,
    });
  }

  /** Meta Purchase */
  static trackPurchase(
    orderId: string,
    total: number,
    paymentMethod: string,
    options?: { contentIds?: string[]; numItems?: number }
  ) {
    if (typeof window === "undefined") return;

    const data = {
      event: "purchase",
      orderId,
      total,
      paymentMethod,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      timestamp: new Date().toISOString(),
    };

    this.sendToServer(data);
    trackMeta(
      "Purchase",
      {
        content_ids: options?.contentIds || [],
        content_type: "product",
        value: kes(total),
        currency: "KES",
        num_items: options?.numItems,
      },
      { eventID: orderId }
    );
  }

  /** Meta Search */
  static trackSearch(searchString: string, contentIds?: string[]) {
    if (typeof window === "undefined") return;
    if (!searchString.trim()) return;

    const data = {
      event: "search",
      searchString,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      timestamp: new Date().toISOString(),
    };

    this.sendToServer(data);
    trackMeta("Search", {
      search_string: searchString.trim(),
      content_ids: contentIds || [],
      content_type: "product",
    });
  }

  static trackCollectionView(category: string, productCount: number) {
    if (typeof window === "undefined") return;

    const data = {
      event: "collection_view",
      category,
      productCount,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      timestamp: new Date().toISOString(),
    };

    this.sendToServer(data);
    // Meta has no standard collection event — use ViewContent with product_group
    trackMeta("ViewContent", {
      content_type: "product_group",
      content_category: category,
      content_name: category,
    });
  }

  private static sendToServer(data: any) {
    if (typeof window === "undefined") return;

    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);

    if (!navigator.sendBeacon) {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {});
    }
  }
}
