import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_TAG_PRODUCTS } from "./cache-tags";
import { supabase, supabaseAdmin } from "./supabase";

/** Listing columns only — avoids shipping full descriptions on catalog pages. */
const PRODUCT_CATALOG_SELECT =
  "id,slug,title,short_description,price,category,subcategory,tags,teddy_size,teddy_color,images,included_items,upsells,stock,created_at,updated_at";

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

function normalizeProductRow(row: Record<string, unknown>): Product {
  return {
    ...(row as Product),
    description: (row.description as string) ?? "",
    tags: (row.tags as string[]) || [],
    images: (row.images as string[]) || [],
    included_items: (row.included_items as Product["included_items"]) || null,
    upsells: (row.upsells as string[]) || null,
    subcategory: (row.subcategory as string) || null,
  };
}

function applyProductFilters(
  products: Product[],
  filters?: {
    category?: string;
    subcategory?: string;
    tags?: string[];
    teddy_size?: number[];
    teddy_color?: string[];
  }
): Product[] {
  let result = products;
  if (filters?.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters?.subcategory) {
    result = result.filter((p) => p.subcategory === filters.subcategory);
  }
  if (filters?.tags && filters.tags.length > 0) {
    result = result.filter(
      (p) =>
        p.tags &&
        filters.tags!.some((tag) =>
          p.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
        )
    );
  }
  if (filters?.teddy_size && filters.teddy_size.length > 0) {
    result = result.filter(
      (p) => p.teddy_size != null && filters.teddy_size!.includes(p.teddy_size)
    );
  }
  if (filters?.teddy_color && filters.teddy_color.length > 0) {
    result = result.filter(
      (p) => p.teddy_color != null && filters.teddy_color!.includes(p.teddy_color)
    );
  }
  return result;
}

/** One cached DB round-trip per deploy window; filtered in memory per request. */
const loadProductsCatalog = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const { data, error } = await (supabaseAdmin.from("products") as any)
        .select(PRODUCT_CATALOG_SELECT)
        .order("created_at", { ascending: false });

      if (error) {
        const err = error as { message?: string; code?: string };
        if (typeof window === "undefined") {
          console.warn("[getProducts] Supabase error:", err.message || err.code || "Unknown");
        }
        return [];
      }

      return (data || []).map((row: Record<string, unknown>) =>
        normalizeProductRow(row)
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (typeof window === "undefined") {
        console.warn("[getProducts] Failed:", msg);
      }
      return [];
    }
  },
  ["products-catalog"],
  { revalidate: 300, tags: [CACHE_TAG_PRODUCTS] }
);

export const getAllProductsCatalog = cache(async (): Promise<Product[]> => {
  return loadProductsCatalog();
});

export const getProducts = cache(async function getProducts(filters?: {
  category?: string;
  subcategory?: string;
  tags?: string[];
  teddy_size?: number[];
  teddy_color?: string[];
}): Promise<Product[]> {
  const catalog = await getAllProductsCatalog();
  return applyProductFilters(catalog, filters);
});

export const getProductBySlug = cache(async function getProductBySlug(
  slug: string
): Promise<Product | null> {
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
});

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
