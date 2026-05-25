"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getStaffToken } from "@/lib/staff-client";

export interface RealtimeNotification {
  id: string;
  type: "order_new" | "order_updated" | "message_new";
  title: string;
  body: string;
  at: number;
  data?: Record<string, unknown>;
}

type Listener = (event: string, data: Record<string, unknown>) => void;

let globalListeners: Listener[] = [];

export function onStaffRealtime(listener: Listener) {
  globalListeners.push(listener);
  return () => {
    globalListeners = globalListeners.filter((l) => l !== listener);
  };
}

export function emitStaffRealtime(event: string, data: Record<string, unknown> = {}) {
  globalListeners.forEach((l) => l(event, data));
}

export function useStaffRealtime() {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addNotification = useCallback((n: Omit<RealtimeNotification, "id" | "at">) => {
    const item: RealtimeNotification = {
      ...n,
      id: `${Date.now()}-${Math.random()}`,
      at: Date.now(),
    };
    setNotifications((prev) => [item, ...prev].slice(0, 20));
    return item;
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  useEffect(() => {
    const token = getStaffToken();
    if (!token) return;

    const url = `/api/staff/stream?token=${encodeURIComponent(token)}`;

    const bind = (es: EventSource) => {
      es.addEventListener("connected", () => {
        setConnected(true);
        if (typeof window !== "undefined") localStorage.setItem("staff_live_ok", "1");
      });
      es.addEventListener("subscribed", () => setConnected(true));
      es.addEventListener("ping", () => setConnected(true));
      es.addEventListener("sync", () => {
        setConnected(true);
        emitStaffRealtime("sync", {});
      });

      es.addEventListener("order_new", (e) => {
        const data = JSON.parse(e.data) as Record<string, unknown>;
        emitStaffRealtime("order_new", data);
        addNotification({
          type: "order_new",
          title: "New order",
          body: `${data.customer_name || "Customer"} — check orders`,
          data,
        });
      });

      es.addEventListener("order_updated", (e) => {
        const data = JSON.parse(e.data) as Record<string, unknown>;
        emitStaffRealtime("order_updated", data);
        addNotification({
          type: "order_updated",
          title: "Order updated",
          body: `Status: ${(data.order_status as string) || (data.status as string) || "changed"}`,
          data,
        });
      });

      es.addEventListener("message_new", (e) => {
        const data = JSON.parse(e.data) as Record<string, unknown>;
        emitStaffRealtime("message_new", data);
        addNotification({
          type: "message_new",
          title: "New enquiry",
          body: `${data.name || "Someone"} sent a message`,
          data,
        });
      });

      es.onerror = () => {
        setConnected(false);
        es.close();
        if (esRef.current === es) esRef.current = null;
        retryRef.current = setTimeout(connect, 3000);
      };
    };

    const connect = () => {
      if (!getStaffToken()) return;
      if (esRef.current) return;
      const es = new EventSource(url);
      esRef.current = es;
      bind(es);
    };

    connect();

    return () => {
      if (retryRef.current) clearTimeout(retryRef.current);
      esRef.current?.close();
      esRef.current = null;
      setConnected(false);
    };
  }, [addNotification]);

  return { connected, notifications, dismiss, clearAll, addNotification };
}
