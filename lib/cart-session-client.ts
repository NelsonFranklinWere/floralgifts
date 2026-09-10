/**
 * Client-side cart/checkout session tracker.
 * Captures cart from first add-to-cart and checkout fields as the user types.
 */

import type { CartItem } from "@/lib/store/cart";

const SESSION_KEY = "fw_cart_session_id";
const DEBOUNCE_MS = 900;

export type CheckoutFields = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  recipient_phone?: string;
  address?: string;
  apartment?: string;
  city?: string;
  postal_code?: string;
  payment_method?: string;
  billing_first_name?: string;
  billing_last_name?: string;
  billing_address?: string;
  billing_city?: string;
  billing_phone?: string;
  gift_message?: string;
  delivery_instructions?: string;
  name?: string;
  delivery_location?: string;
  delivery_address?: string;
  recipient_name?: string;
  stk_phone?: string;
};

export function getCartSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function payloadBase() {
  return {
    sessionId: getCartSessionId(),
    path: typeof window !== "undefined" ? window.location.pathname : "",
    referrer: typeof document !== "undefined" ? document.referrer || "" : "",
  };
}

async function postSession(body: Record<string, unknown>) {
  const sessionId = getCartSessionId();
  if (!sessionId || typeof window === "undefined") return;

  try {
    await fetch("/api/cart-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payloadBase(), ...body }),
      keepalive: true,
    });
  } catch {
    // Never block UX for tracking failures
  }
}

/** Immediate save of cart line items (add / remove / qty / clear). */
export function trackCartSession(items: CartItem[], cartTotal: number) {
  void postSession({
    event: "cart_update",
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
      slug: i.slug,
      options: i.options || null,
    })),
    cart_total: cartTotal,
  });
}

let fieldsTimer: ReturnType<typeof setTimeout> | null = null;
let pendingFields: CheckoutFields | null = null;

/** Debounced save of checkout form fields as the user types. */
export function trackCheckoutFields(fields: CheckoutFields) {
  pendingFields = fields;
  if (fieldsTimer) clearTimeout(fieldsTimer);
  fieldsTimer = setTimeout(() => {
    if (!pendingFields) return;
    const snapshot = { ...pendingFields };
    pendingFields = null;
    // Skip empty-only payloads (no value entered yet)
    const hasAny = Object.values(snapshot).some(
      (v) => typeof v === "string" && v.trim().length > 0
    );
    if (!hasAny) return;
    void postSession({
      event: "checkout_fields",
      fields: snapshot,
    });
  }, DEBOUNCE_MS);
}

/** Flush pending field saves immediately (e.g. before place order). */
export function flushCheckoutFields() {
  if (fieldsTimer) {
    clearTimeout(fieldsTimer);
    fieldsTimer = null;
  }
  if (!pendingFields) return;
  const snapshot = { ...pendingFields };
  pendingFields = null;
  void postSession({ event: "checkout_fields", fields: snapshot });
}

export function markCartSessionConverted(orderId: string) {
  void postSession({
    event: "converted",
    converted_order_id: orderId,
  });
}
