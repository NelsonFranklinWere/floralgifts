export const EMPTY_STAFF_DASHBOARD = {
  stats: {
    ordersToday: 0,
    revenueToday: 0,
    ordersYesterday: 0,
    revenueYesterday: 0,
    pendingOrders: 0,
    lowStock: 0,
    newCustomers: 0,
    unreadMessages: 0,
    activeDeliveries: 0,
    liveVisitors: 0,
  },
  chartData: [] as { date: string; revenue: number; orders: number }[],
  recentOrders: [] as {
    id: string;
    customer_name: string;
    total: number;
    status: string;
    payment_method: string;
    created_at: string;
  }[],
};
