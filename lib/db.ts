import { supabase, supabaseAdmin } from "./supabase";

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  price: number;
  category: "flowers" | "hampers" | "teddy" | "wines" | "chocolates" | "cards" | "cakes";
  subcategory?: string | null;
  tags: string[];
  teddy_size?: number | null;
  teddy_color?: string | null;
  images: string[];
  included_items?: Array<{ name: string; qty: number; note?: string }> | null;
  upsells?: string[] | null;
  stock?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    options?: Record<string, string>;
  }>;
  total?: number; // alias for total_amount (for backward compatibility)
  total_amount: number;
  customer_name: string;
  phone: string;
  email?: string | null;
  delivery_address: string;
  delivery_city?: string | null;
  delivery_date: string;
  payment_method: "mpesa" | "mpesa_till" | "mpesa_paybill" | "card" | "whatsapp";
  mpesa_checkout_request_id?: string | null;
  mpesa_result_code?: number | null;
  mpesa_receipt_number?: string | null;
  pesapal_order_tracking_id?: string | null;
  pesapal_payment_method?: string | null;
  pesapal_confirmation_code?: string | null;
  status: "pending" | "paid" | "failed" | "cancelled" | "shipped";
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export async function getProducts(filters?: {
  category?: string;
  subcategory?: string;
  tags?: string[];
  teddy_size?: number[];
  teddy_color?: string[];
}): Promise<Product[]> {
  try {
    // Use admin client on the server so product listing is not blocked by RLS
    let query = (supabaseAdmin.from("products") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.subcategory) {
      query = query.eq("subcategory", filters.subcategory);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains("tags", filters.tags);
    }

    if (filters?.teddy_size && filters.teddy_size.length > 0) {
      query = query.in("teddy_size", filters.teddy_size);
    }

    if (filters?.teddy_color && filters.teddy_color.length > 0) {
      query = query.in("teddy_color", filters.teddy_color);
    }

    const { data, error } = await query;

    if (error) {
      const err = error as any;
      const msg = err?.message ?? err?.error_description ?? String(error);
      if (typeof window === "undefined") {
        console.warn("[getProducts] Supabase error:", msg || err?.code || "Unknown");
      }
      return [];
    }

    return (data || []).map((row: any) => ({
      ...row,
      tags: row.tags || [],
      images: row.images || [],
      included_items: row.included_items || null,
      upsells: row.upsells || null,
      subcategory: row.subcategory || null,
    })) as Product[];
  } catch (err: any) {
    const msg = err?.message ?? err?.cause?.message ?? String(err);
    if (typeof window === "undefined") {
      console.warn("[getProducts] Failed (using fallbacks):", msg || "Network/connection error");
    }
    return [];
  }
}

// The Sale catalog (products shown on /sale and in the Meta Catalog CSV feed)
// is stored as a JSON array of product ids in site_settings under this key.
// Legacy key "sell_catalog_ids" is still read for one-time migration.
export const SALE_CATALOG_SETTING_KEY = "sale_catalog_ids";
const LEGACY_SELL_CATALOG_SETTING_KEY = "sell_catalog_ids";

async function readCatalogIds(key: string): Promise<string[]> {
  try {
    const { data, error } = await (supabaseAdmin.from("site_settings") as any)
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error || !data?.value) return [];

    const parsed = JSON.parse(data.value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export async function getSaleCatalogIds(): Promise<string[]> {
  const ids = await readCatalogIds(SALE_CATALOG_SETTING_KEY);
  if (ids.length > 0) return ids;

  // Migrate from the earlier "sell_catalog_ids" key if present
  const legacy = await readCatalogIds(LEGACY_SELL_CATALOG_SETTING_KEY);
  if (legacy.length > 0) {
    await setSaleCatalogIds(legacy);
    return legacy;
  }
  return [];
}

export async function setSaleCatalogIds(ids: string[]): Promise<boolean> {
  try {
    const { error } = await (supabaseAdmin.from("site_settings") as any).upsert(
      {
        key: SALE_CATALOG_SETTING_KEY,
        value: JSON.stringify(ids),
        description:
          "Product ids shown on the /sale page and in the Meta Catalog CSV feed (/sale.csv)",
      },
      { onConflict: "key" }
    );

    if (error) {
      console.error("[setSaleCatalogIds] Supabase error:", error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("[setSaleCatalogIds] Failed:", err?.message || err);
    return false;
  }
}

/** Sale-catalog products. Pass `limit` to cap; omit (or ≤0) for the full catalog. */
export async function getSaleProducts(limit?: number): Promise<Product[]> {
  try {
    const ids = await getSaleCatalogIds();
    if (ids.length === 0) return [];

    const selectedIds =
      limit != null && limit > 0 ? ids.slice(0, limit) : ids;

    const { data, error } = await (supabaseAdmin.from("products") as any)
      .select("*")
      .in("id", selectedIds);

    if (error) {
      if (typeof window === "undefined") {
        console.warn("[getSaleProducts] Supabase error:", (error as any)?.message || error);
      }
      return [];
    }

    const rows = (data || []).map((row: any) => ({
      ...row,
      tags: row.tags || [],
      images: row.images || [],
      included_items: row.included_items || null,
      upsells: row.upsells || null,
      subcategory: row.subcategory || null,
    })) as Product[];

    // Preserve the admin-defined catalog order
    const order = new Map(selectedIds.map((id, i) => [id, i]));
    rows.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    return rows;
  } catch (err: any) {
    if (typeof window === "undefined") {
      console.warn("[getSaleProducts] Failed:", err?.message || err);
    }
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await (supabaseAdmin
      .from("products") as any)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      const err: any = error;
      // Treat "no rows found" as a simple 404 without logging noisy errors
      if (err.code === "PGRST116" || err.message?.toLowerCase().includes("no rows") || err.details?.toLowerCase().includes("row not found")) {
        return null;
      }
      console.error("Error fetching product by slug:", {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code,
      });
      return null;
    }

    if (!data) return null;

    return {
      ...(data as any),
      tags: (data as any).tags || [],
      images: (data as any).images || [],
      included_items: (data as any).included_items || null,
      upsells: (data as any).upsells || null,
      subcategory: (data as any).subcategory || null,
    } as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await (supabaseAdmin
      .from("products") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      const err: any = error;
      if (err.code === "PGRST116" || err.message?.toLowerCase().includes("no rows") || err.details?.toLowerCase().includes("row not found")) {
        return null;
      }
      console.error("Error fetching product by id:", {
        message: err.message,
        details: err.details,
        hint: err.hint,
        code: err.code,
      });
      return null;
    }

    if (!data) return null;

    return {
      ...(data as any),
      tags: (data as any).tags || [],
      images: (data as any).images || [],
      included_items: (data as any).included_items || null,
      upsells: (data as any).upsells || null,
      subcategory: (data as any).subcategory || null,
    } as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function createOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order | null> {
  try {
    const insertData: any = {
      items: order.items,
      total_amount: order.total_amount || order.total || 0,
      customer_name: order.customer_name,
      phone: order.phone,
      email: order.email || null,
      delivery_city: order.delivery_city || null,
      delivery_date: order.delivery_date,
      payment_method: order.payment_method,
      status: order.status || "pending",
      mpesa_checkout_request_id: order.mpesa_checkout_request_id || null,
      notes: order.notes || null,
    };
    
    // Use delivery_address - the database column has been renamed
    insertData.delivery_address = order.delivery_address;

    const { data, error } = await (supabaseAdmin
      .from("orders") as any)
      .insert(insertData)
      .select()
      .single();

    if (data) {
      // Add total alias for backward compatibility
      (data as any).total = data.total_amount;
    }

    if (error) {
      console.error("Error creating order:", error);
      return null;
    }

    return data as Order;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data, error } = await (supabaseAdmin.from("orders") as any).select("*").eq("id", id).single();

    if (error) {
      console.error("Error fetching order:", error);
      return null;
    }

    if (data) {
      // Add total alias for backward compatibility
      (data as any).total = data.total_amount;
      // Map 'delivery_address' from DB (or 'address' if migration not run yet)
      if (!data.delivery_address && data.address) {
        data.delivery_address = data.address;
      }
    }

    return data as Order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order | null> {
  try {
    const updateData: any = {};

    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.mpesa_result_code !== undefined) updateData.mpesa_result_code = updates.mpesa_result_code;
    if (updates.mpesa_receipt_number !== undefined) updateData.mpesa_receipt_number = updates.mpesa_receipt_number;
    if (updates.mpesa_checkout_request_id !== undefined) updateData.mpesa_checkout_request_id = updates.mpesa_checkout_request_id;
    if (updates.delivery_city !== undefined) updateData.delivery_city = updates.delivery_city;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    // Pesapal-specific fields
    if (updates.pesapal_order_tracking_id !== undefined) updateData.pesapal_order_tracking_id = updates.pesapal_order_tracking_id;
    if (updates.pesapal_payment_method !== undefined) updateData.pesapal_payment_method = updates.pesapal_payment_method;
    if (updates.pesapal_confirmation_code !== undefined) updateData.pesapal_confirmation_code = updates.pesapal_confirmation_code;

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await (supabaseAdmin
      .from("orders") as any)
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      return null;
    }

    return data as Order;
  } catch (error) {
    console.error("Error updating order:", error);
    return null;
  }
}

export async function getOrders(filters?: {
  status?: string;
}): Promise<Order[]> {
  try {
    console.log(`🔍 DB getOrders: Filters:`, filters);
    
    // If no status filter, return all orders
    if (!filters?.status) {
      const { data, error } = await (supabaseAdmin.from("orders") as any)
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching all orders:", error);
        return [];
      }
      
      console.log(`📊 DB getOrders: All orders count: ${data?.length || 0}`);
      
      return (data || []).map((order: any) => ({
        ...order,
        total: order.total_amount,
        delivery_address: order.address || order.delivery_address,
      })) as Order[];
    }
    
    // For any status filter, use direct query approach
    console.log(`🔍 DB getOrders: Filtering by status: "${filters.status}"`);
    
    const { data, error } = await (supabaseAdmin.from("orders") as any)
      .select("*")
      .eq("status", filters.status)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error(`Error fetching ${filters.status} orders:`, error);
      return [];
    }
    
    console.log(`📊 DB getOrders: ${filters.status} orders count: ${data?.length || 0}`);
    
    // Process and return orders
    const processedOrders = (data || []).map((order: any) => ({
      ...order,
      total: order.total_amount,
      delivery_address: order.address || order.delivery_address,
    })) as Order[];
    
    return processedOrders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Cart / checkout sessions (abandoned cart + progressive field capture)
// Stored in site_settings as cart_session:{uuid} so no schema migration needed.
// ---------------------------------------------------------------------------

export const CART_SESSION_KEY_PREFIX = "cart_session:";

export interface CartSessionItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  slug?: string;
  options?: Record<string, string> | null;
}

export interface CartSessionFields {
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  recipient_phone?: string;
  recipient_name?: string;
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
  delivery_location?: string;
  delivery_address?: string;
  stk_phone?: string;
  [key: string]: string | undefined;
}

export interface CartSession {
  session_id: string;
  status: "active" | "converted" | "abandoned";
  items: CartSessionItem[];
  cart_total: number;
  fields: CartSessionFields;
  path?: string;
  referrer?: string;
  user_agent?: string;
  converted_order_id?: string | null;
  created_at: string;
  updated_at: string;
}

function cartSessionKey(sessionId: string) {
  return `${CART_SESSION_KEY_PREFIX}${sessionId}`;
}

function sanitizeFields(input: unknown): CartSessionFields {
  if (!input || typeof input !== "object") return {};
  const out: CartSessionFields = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (typeof v === "string") {
      const trimmed = v.trim().slice(0, 500);
      if (trimmed) out[k] = trimmed;
    }
  }
  return out;
}

function sanitizeItems(input: unknown): CartSessionItem[] {
  if (!Array.isArray(input)) return [];
  return input
    .slice(0, 50)
    .map((raw: any) => ({
      id: String(raw?.id || "").slice(0, 80),
      name: String(raw?.name || "Item").slice(0, 200),
      price: Number(raw?.price) || 0,
      quantity: Math.max(1, Math.min(99, Number(raw?.quantity) || 1)),
      image: raw?.image ? String(raw.image).slice(0, 500) : undefined,
      slug: raw?.slug ? String(raw.slug).slice(0, 200) : undefined,
      options: raw?.options && typeof raw.options === "object" ? raw.options : null,
    }))
    .filter((i) => i.id);
}

export async function getCartSession(sessionId: string): Promise<CartSession | null> {
  if (!sessionId || sessionId.length > 80) return null;
  try {
    const { data, error } = await (supabaseAdmin.from("site_settings") as any)
      .select("value")
      .eq("key", cartSessionKey(sessionId))
      .maybeSingle();
    if (error || !data?.value) return null;
    return JSON.parse(data.value) as CartSession;
  } catch {
    return null;
  }
}

export async function upsertCartSession(input: {
  sessionId: string;
  event?: string;
  items?: unknown;
  cart_total?: number;
  fields?: unknown;
  path?: string;
  referrer?: string;
  user_agent?: string;
  converted_order_id?: string | null;
}): Promise<CartSession | null> {
  const sessionId = String(input.sessionId || "").slice(0, 80);
  if (!sessionId) return null;

  const now = new Date().toISOString();
  const existing = await getCartSession(sessionId);

  const next: CartSession = {
    session_id: sessionId,
    status: existing?.status || "active",
    items: existing?.items || [],
    cart_total: existing?.cart_total || 0,
    fields: existing?.fields || {},
    path: existing?.path,
    referrer: existing?.referrer,
    user_agent: existing?.user_agent,
    converted_order_id: existing?.converted_order_id || null,
    created_at: existing?.created_at || now,
    updated_at: now,
  };

  if (input.items !== undefined) {
    next.items = sanitizeItems(input.items);
  }
  if (typeof input.cart_total === "number" && !Number.isNaN(input.cart_total)) {
    next.cart_total = Math.max(0, Math.round(input.cart_total));
  } else if (input.items !== undefined) {
    next.cart_total = next.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }

  if (input.fields !== undefined) {
    next.fields = { ...next.fields, ...sanitizeFields(input.fields) };
  }

  if (input.path) next.path = String(input.path).slice(0, 300);
  if (input.referrer) next.referrer = String(input.referrer).slice(0, 500);
  if (input.user_agent) next.user_agent = String(input.user_agent).slice(0, 500);

  if (input.event === "converted" || input.converted_order_id) {
    next.status = "converted";
    if (input.converted_order_id) {
      next.converted_order_id = String(input.converted_order_id).slice(0, 80);
    }
  } else if (next.status !== "converted" && next.items.length === 0) {
    // Keep row so partial contact details remain visible to admin
    next.status = existing?.status === "converted" ? "converted" : "active";
  }

  try {
    const { error } = await (supabaseAdmin.from("site_settings") as any).upsert(
      {
        key: cartSessionKey(sessionId),
        value: JSON.stringify(next),
        description: "Cart/checkout session lead",
        updated_at: now,
      },
      { onConflict: "key" }
    );
    if (error) {
      console.error("[upsertCartSession]", error.message);
      return null;
    }
    return next;
  } catch (err: any) {
    console.error("[upsertCartSession]", err?.message || err);
    return null;
  }
}

export async function listCartSessions(limit = 100): Promise<CartSession[]> {
  try {
    const { data, error } = await (supabaseAdmin.from("site_settings") as any)
      .select("key, value, updated_at")
      .like("key", `${CART_SESSION_KEY_PREFIX}%`)
      .order("updated_at", { ascending: false })
      .limit(Math.min(500, Math.max(1, limit)));

    if (error) {
      console.error("[listCartSessions]", error.message);
      return [];
    }

    return (data || [])
      .map((row: any) => {
        try {
          return JSON.parse(row.value) as CartSession;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as CartSession[];
  } catch (err: any) {
    console.error("[listCartSessions]", err?.message || err);
    return [];
  }
}

