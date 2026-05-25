import { supabaseAdmin } from "./supabase";
import { startOfDay, subDays, format, eachDayOfInterval } from "date-fns";

const ORDER_LIST_SELECT =
  "id, customer_name, phone, email, total_amount, payment_method, status, order_status, delivery_address, delivery_date, created_at";

const PRODUCT_LIST_SELECT =
  "id, slug, title, price, category, stock, visibility, low_stock_threshold, created_at";

export async function fetchStaffDashboard(period: string) {
  const today = startOfDay(new Date());
  const todayIso = today.toISOString();
  const daysBack = period === "monthly" ? 30 : period === "weekly" ? 7 : 7;
  const rangeStart = subDays(today, daysBack - 1);
  const rangeStartIso = rangeStart.toISOString();

  const yesterday = subDays(today, 1);
  const yesterdayIso = yesterday.toISOString();
  const yesterdayEnd = today.toISOString();

  const [
    recentRes,
    rangeOrdersRes,
    todayOrdersRes,
    yesterdayOrdersRes,
    pendingRes,
    lowStockRes,
    unreadMsgRes,
    deliveryRes,
  ] = await Promise.all([
    (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .select(ORDER_LIST_SELECT)
      .order("created_at", { ascending: false })
      .limit(10),
    (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .select("id, total_amount, status, created_at")
      .gte("created_at", rangeStartIso)
      .order("created_at", { ascending: false })
      .limit(2000),
    (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .select("id, email, total_amount, status, created_at")
      .gte("created_at", todayIso)
      .limit(500),
    (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .select("id, total_amount, status, created_at")
      .gte("created_at", yesterdayIso)
      .lt("created_at", yesterdayEnd)
      .limit(500),
    (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
      .select("id, stock, low_stock_threshold")
      .not("stock", "is", null)
      .lte("stock", 20)
      .limit(200),
    (supabaseAdmin.from("contact_messages") as ReturnType<typeof supabaseAdmin.from>)
      .select("id", { count: "exact", head: true })
      .eq("status", "unread"),
    (supabaseAdmin.from("orders") as ReturnType<typeof supabaseAdmin.from>)
      .select("id", { count: "exact", head: true })
      .in("order_status", ["confirmed", "packed", "out_for_delivery"]),
  ]);

  const recentOrders = (recentRes.data || []).map((o: Record<string, unknown>) => ({
    id: o.id as string,
    customer_name: o.customer_name as string,
    total: (o.total_amount as number) || 0,
    status: (o.order_status as string) || (o.status as string),
    payment_method: o.payment_method as string,
    created_at: o.created_at as string,
  }));

  const rangeOrders = rangeOrdersRes.data || [];
  const todayOrders = todayOrdersRes.data || [];

  const ordersToday = todayOrders.length;
  const revenueToday = todayOrders
    .filter((o: { status: string }) => o.status === "paid" || o.status === "shipped")
    .reduce((s: number, o: { total_amount: number }) => s + (o.total_amount || 0), 0);

  const yesterdayOrders = yesterdayOrdersRes.data || [];
  const ordersYesterday = yesterdayOrders.length;
  const revenueYesterday = yesterdayOrders
    .filter((o: { status: string }) => o.status === "paid" || o.status === "shipped")
    .reduce((s: number, o: { total_amount: number }) => s + (o.total_amount || 0), 0);

  const customerEmails = new Set(
    todayOrders.map((o: { email?: string }) => o.email).filter(Boolean)
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
      activeDeliveries: deliveryRes.count ?? 0,
    },
    chartData,
    recentOrders,
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
  if (error) throw error;
  return (data || []).map((o: Record<string, unknown>) => ({
    id: o.id as string,
    customer_name: o.customer_name as string,
    phone: o.phone as string,
    email: o.email as string | null,
    items: o.items,
    total_amount: o.total_amount as number,
    payment_method: o.payment_method as string,
    status: o.status as string,
    order_status: (o.order_status as string) || (o.status as string),
    delivery_date: o.delivery_date as string,
    delivery_address: o.delivery_address as string,
    created_at: o.created_at as string,
  }));
}

export async function fetchStaffProductsList(options?: { category?: string; q?: string; limit?: number }) {
  const limit = options?.limit ?? 150;
  let query = (supabaseAdmin.from("products") as ReturnType<typeof supabaseAdmin.from>)
    .select(PRODUCT_LIST_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.category) {
    query = query.eq("category", options.category);
  }
  if (options?.q) {
    query = query.or(`title.ilike.%${options.q}%,slug.ilike.%${options.q}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
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
