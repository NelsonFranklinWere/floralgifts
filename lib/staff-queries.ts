import { supabaseAdmin } from "./supabase";
import { getVisitorStats } from "./visitor-store";
import { startOfDay, subDays, format, eachDayOfInterval } from "date-fns";

/** Core columns only — order_status is optional (migration 011); mapped from status when absent. */
const ORDER_LIST_SELECT =
  "id, customer_name, phone, email, total_amount, payment_method, status, delivery_address, delivery_date, created_at";

const PRODUCT_LIST_SELECT =
  "id, slug, title, price, category, stock, visibility, low_stock_threshold, created_at";

const PRODUCT_LIST_SELECT_BASE =
  "id, slug, title, price, category, stock, created_at";

function isMissingColumnError(error: { message?: string; code?: string }): boolean {
  const msg = (error.message || "").toLowerCase();
  return (
    error.code === "PGRST204" ||
    msg.includes("does not exist") ||
    (msg.includes("column") && msg.includes("products"))
  );
}

function mapStaffProductRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    price: row.price as number,
    category: row.category as string,
    stock: row.stock as number | null,
    visibility: (row.visibility as string) || "published",
    low_stock_threshold: (row.low_stock_threshold as number) ?? 5,
    created_at: row.created_at as string,
  };
}

function sumPaidAmount(rows: { total_amount?: number | null }[]) {
  return rows.reduce((s, o) => s + (o.total_amount || 0), 0);
}

export async function fetchStaffDashboard(period: string) {
  const today = startOfDay(new Date());
  const todayIso = today.toISOString();
  const daysBack = period === "monthly" ? 30 : period === "weekly" ? 7 : 7;
  const rangeStart = subDays(today, daysBack - 1);
  const rangeStartIso = rangeStart.toISOString();

  const yesterday = subDays(today, 1);
  const yesterdayIso = yesterday.toISOString();
  const yesterdayEnd = today.toISOString();

  const chartLimit = period === "monthly" ? 400 : 200;
  const orders = supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>;
  const products = supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>;
  const messages = supabaseAdmin.from("contact_messages") as ReturnType<typeof supabaseAdmin.from>;

  const settled = await Promise.allSettled([
    orders.select(ORDER_LIST_SELECT).order("created_at", { ascending: false }).limit(10),
    orders.select("id", { count: "exact", head: true }).gte("created_at", todayIso),
    orders
      .select("total_amount")
      .gte("created_at", todayIso)
      .in("status", ["paid", "shipped"])
      .limit(150),
    orders.select("email").gte("created_at", todayIso).not("email", "is", null).limit(80),
    orders
      .select("id", { count: "exact", head: true })
      .gte("created_at", yesterdayIso)
      .lt("created_at", yesterdayEnd),
    orders
      .select("total_amount")
      .gte("created_at", yesterdayIso)
      .lt("created_at", yesterdayEnd)
      .in("status", ["paid", "shipped"])
      .limit(150),
    orders
      .select("id, total_amount, status, created_at")
      .gte("created_at", rangeStartIso)
      .order("created_at", { ascending: false })
      .limit(chartLimit),
    orders.select("id", { count: "exact", head: true }).eq("status", "pending"),
    orders.select("id", { count: "exact", head: true }).eq("status", "shipped"),
    products.select("id, stock, low_stock_threshold").not("stock", "is", null).lte("stock", 20).limit(80),
    messages.select("id", { count: "exact", head: true }).eq("status", "unread"),
  ]);

  const val = <T,>(i: number, fallback: T): T => {
    const r = settled[i];
    if (r.status === "fulfilled" && !(r.value as { error?: unknown }).error) {
      return r.value as T;
    }
    return fallback;
  };

  const recentRes = val(0, { data: [] });
  const todayCountRes = val(1, { count: 0 });
  const todayPaidRes = val(2, { data: [] });
  const todayEmailsRes = val(3, { data: [] });
  const yesterdayCountRes = val(4, { count: 0 });
  const yesterdayPaidRes = val(5, { data: [] });
  const rangeOrdersRes = val(6, { data: [] });
  const pendingRes = val(7, { count: 0 });
  const shippedRes = val(8, { count: 0 });
  const lowStockRes = val(9, { data: [] });
  const unreadMsgRes = val(10, { count: 0 });

  const recentOrders = (recentRes.data || []).map((o: Record<string, unknown>) => ({
    id: o.id as string,
    customer_name: o.customer_name as string,
    total: (o.total_amount as number) || 0,
    status: (o.status as string) || "pending",
    payment_method: o.payment_method as string,
    created_at: o.created_at as string,
  }));

  const rangeOrders = rangeOrdersRes.data || [];
  const ordersToday = todayCountRes.count ?? 0;
  const revenueToday = sumPaidAmount(todayPaidRes.data || []);
  const ordersYesterday = yesterdayCountRes.count ?? 0;
  const revenueYesterday = sumPaidAmount(yesterdayPaidRes.data || []);

  const customerEmails = new Set(
    (todayEmailsRes.data || [])
      .map((o: { email?: string }) => o.email?.trim().toLowerCase())
      .filter(Boolean)
  );

  const lowStock = (lowStockRes.data || []).filter((p: { stock: number; low_stock_threshold?: number }) => {
    const stock = p.stock ?? 0;
    const threshold = p.low_stock_threshold ?? 5;
    return stock > 0 && stock <= threshold;
  }).length;

  const days = eachDayOfInterval({ start: rangeStart, end: today });
  const chartData = days.map((day) => {
    const dayMs = day.getTime();
    const dayOrders = rangeOrders.filter((o: { created_at: string; status: string }) => {
      const t = startOfDay(new Date(o.created_at)).getTime();
      return t === dayMs && (o.status === "paid" || o.status === "shipped");
    });
    return {
      date: format(day, "MMM d"),
      revenue: dayOrders.reduce((s: number, o: { total_amount: number }) => s + (o.total_amount || 0), 0) / 100,
      orders: dayOrders.length,
    };
  });

  const liveVisits = getVisitorStats();

  return {
    stats: {
      ordersToday,
      revenueToday,
      ordersYesterday,
      revenueYesterday,
      pendingOrders: pendingRes.count ?? 0,
      lowStock,
      newCustomers: customerEmails.size,
      unreadMessages: unreadMsgRes.count ?? 0,
      activeDeliveries: shippedRes.count ?? 0,
      liveVisitors: liveVisits.activeNow,
    },
    chartData,
    recentOrders,
  };
}

function mapOrderRow(o: Record<string, unknown>) {
  const status = (o.status as string) || "pending";
  return {
    id: o.id as string,
    customer_name: o.customer_name as string,
    phone: o.phone as string,
    email: o.email as string | null,
    items: o.items,
    total_amount: o.total_amount as number,
    payment_method: o.payment_method as string,
    status,
    order_status: (o.order_status as string) || status,
    delivery_date: o.delivery_date as string,
    delivery_address: o.delivery_address as string,
    created_at: o.created_at as string,
  };
}

export async function fetchStaffOrdersList(options?: { status?: string; limit?: number }) {
  const limit = options?.limit ?? 80;
  let query = (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
    .select(ORDER_LIST_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.status) {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[fetchStaffOrdersList]", error.message);
    throw new Error(error.message || "Failed to load orders");
  }
  return (data || []).map((o) => mapOrderRow(o as Record<string, unknown>));
}

async function runStaffProductsQuery(
  select: string,
  options?: { category?: string; q?: string; limit?: number }
) {
  const limit = options?.limit ?? 150;
  let query = (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
    .select(select)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.category) {
    query = query.eq("category", options.category);
  }
  if (options?.q) {
    const term = options.q.replace(/[%_,]/g, "");
    if (term) {
      query = query.or(`title.ilike.%${term}%,slug.ilike.%${term}%`);
    }
  }

  return query;
}

export async function fetchStaffProductsList(options?: { category?: string; q?: string; limit?: number }) {
  const full = await runStaffProductsQuery(PRODUCT_LIST_SELECT, options);
  if (!full.error) {
    return (full.data || []).map((row) => mapStaffProductRow(row as Record<string, unknown>));
  }

  if (isMissingColumnError(full.error)) {
    console.warn(
      "[fetchStaffProductsList] Optional columns missing — run supabase/migrations/011_staff_admin_panel.sql. Using base product columns."
    );
    const base = await runStaffProductsQuery(PRODUCT_LIST_SELECT_BASE, options);
    if (base.error) {
      console.error("[fetchStaffProductsList]", base.error.message);
      throw new Error(base.error.message || "Failed to load products");
    }
    return (base.data || []).map((row) => mapStaffProductRow(row as Record<string, unknown>));
  }

  console.error("[fetchStaffProductsList]", full.error.message);
  throw new Error(full.error.message || "Failed to load products");
}

/** Aggregate customers from recent orders only (avoids full table scan). */
export async function fetchStaffCustomersSummary(q?: string) {
  const { data, error } = await (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
    .select("email, customer_name, phone, total_amount, status, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw error;

  const map = new Map<
    string,
    { email: string; name: string; phone: string; orders: number; spend: number; joined: string }
  >();

  for (const o of data || []) {
    const row = o as {
      email?: string;
      customer_name: string;
      phone: string;
      total_amount: number;
      status: string;
      created_at: string;
    };
    const key = (row.email || row.phone || row.customer_name).toLowerCase();
    const existing = map.get(key) || {
      email: row.email || "",
      name: row.customer_name,
      phone: row.phone,
      orders: 0,
      spend: 0,
      joined: row.created_at,
    };
    existing.orders += 1;
    if (row.status === "paid" || row.status === "shipped") {
      existing.spend += row.total_amount || 0;
    }
    if (new Date(row.created_at) < new Date(existing.joined)) existing.joined = row.created_at;
    map.set(key, existing);
  }

  let customers = Array.from(map.values());
  if (q) {
    const lower = q.toLowerCase();
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.email.toLowerCase().includes(lower) ||
        c.phone.includes(q)
    );
  }
  return customers;
}
