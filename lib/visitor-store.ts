/**
 * In-memory store for recent visitor pings. Used for admin live visitor alerts.
 * Resets on server restart. Keeps last 200 entries.
 */

const MAX_ENTRIES = 200;

export interface VisitorPing {
  id: string;
  path: string;
  referrer: string;
  userAgent: string;
  timestamp: number;
}

const store: VisitorPing[] = [];
let lastId = 0;

export function addVisitorPing(ping: Omit<VisitorPing, "id" | "timestamp">): VisitorPing {
  const entry: VisitorPing = {
    ...ping,
    id: `v-${++lastId}-${Date.now()}`,
    timestamp: Date.now(),
  };
  store.unshift(entry);
  if (store.length > MAX_ENTRIES) {
    store.length = MAX_ENTRIES;
  }
  return entry;
}

export function getRecentVisitorPings(since?: number): VisitorPing[] {
  if (since != null) {
    return store.filter((p) => p.timestamp > since);
  }
  return [...store];
}

export function getLatestTimestamp(): number {
  return store[0]?.timestamp ?? 0;
}
