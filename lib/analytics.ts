"use client";

import Cookies from "js-cookie";

// Analytics tracking with hidden cookies
export class Analytics {
  private static readonly COOKIE_NAME = "_fw_analytics";
  private static readonly SESSION_COOKIE = "_fw_session";
  private static readonly USER_ID_COOKIE = "_fw_uid";

  // Generate or get user ID
  static getUserId(): string {
    let userId = Cookies.get(this.USER_ID_COOKIE);
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      Cookies.set(this.USER_ID_COOKIE, userId, { expires: 365, sameSite: "lax" });
    }
    return userId;
  }

  // Get or create session ID
  static getSessionId(): string {
    let sessionId = Cookies.get(this.SESSION_COOKIE);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      Cookies.set(this.SESSION_COOKIE, sessionId, { expires: 1, sameSite: "lax" });
    }
    return sessionId;
  }

  // Track page view
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

    // Store in hidden cookie
    Cookies.set(this.COOKIE_NAME, JSON.stringify(data), { expires: 1, sameSite: "lax" });

    // Send to analytics endpoint (if configured)
    this.sendToServer(data);
  }

  // Track product view
  static trackProductView(productId: string, productName: string, category: string, price: number) {
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
  }

  // Track add to cart
  static trackAddToCart(productId: string, productName: string, price: number, quantity: number) {
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
  }

  // Track checkout start
  static trackCheckoutStart(total: number, items: number) {
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
  }

  // Track purchase
  static trackPurchase(orderId: string, total: number, paymentMethod: string) {
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
  }

  // Track collection view
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
  }

  // Send data to server (non-blocking)
  private static sendToServer(data: any) {
    if (typeof window === "undefined") return;

    // Use sendBeacon for reliable, non-blocking delivery
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);

    // Fallback to fetch if sendBeacon not available
    if (!navigator.sendBeacon) {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {
        // Silently fail - analytics should not break the app
      });
    }
  }
}

