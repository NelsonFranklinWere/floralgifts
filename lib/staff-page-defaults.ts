export const EMPTY_DELIVERY = {
  deliveries: [] as { id: string; customer_name: string; delivery_address: string; order_status?: string }[],
  zones: [] as { id: string; name: string; fee: number }[],
  personnel: [] as { id: string; name: string; phone: string }[],
};

export const EMPTY_CONTENT = {
  blogs: [] as { id: string; title: string; slug: string; published: boolean }[],
  heroSlides: [] as { id: string; title: string; position: number }[],
  homepageSections: [] as { id: string; section_key: string; title: string }[],
};

export const EMPTY_FINANCIALS: Record<string, unknown> = {
  totalRevenue: 0,
  orderCount: 0,
  avgOrder: 0,
  byPayment: {},
  byCategory: {},
  topProducts: [],
};
