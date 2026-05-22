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

  private static queue: Record<string, unknown>[] = [];
  private static flushTimer: ReturnType<typeof setTimeout> | null = null;
  private static readonly MAX_BATCH = 12;
  private static readonly FLUSH_MS = 5000;

  /** Batched, non-blocking — avoids dozens of parallel /api/analytics calls per page. */
  private static sendToServer(data: Record<string, unknown>) {
    if (typeof window === "undefined") return;

    this.queue.push(data);
    if (this.queue.length >= this.MAX_BATCH) {
      this.flushQueue();
      return;
    }
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flushQueue(), this.FLUSH_MS);
    }
  }

  /** Flush batched events (e.g. when user leaves the tab). */
  static flushPending() {
    this.flushQueue();
  }

  private static flushQueue() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    const events = this.queue.splice(0);
    if (!events.length) return;

    const payload = JSON.stringify({ events });
    const blob = new Blob([payload], { type: "application/json" });

    if (navigator.sendBeacon?.("/api/analytics", blob)) return;

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      Analytics.flushPending();
    }
  });
}

