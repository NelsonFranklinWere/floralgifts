"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

interface VisitorPing {
  id: string;
  path: string;
  referrer: string;
  userAgent: string;
  timestamp: number;
}

function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Fallback: no sound if AudioContext not allowed (e.g. autoplay policy)
  }
}

function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return Promise.resolve(false);
  if (Notification.permission === "granted") return Promise.resolve(true);
  if (Notification.permission === "denied") return Promise.resolve(false);
  return Notification.requestPermission().then((p) => p === "granted");
}

function showDesktopNotification(title: string, body: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/images/logo/FloralLogo.jpg" });
  } catch {
    // ignore
  }
}

const POLL_INTERVAL_MS = 3000;

export default function AdminLiveVisitorsPage() {
  const router = useRouter();
  const [visitors, setVisitors] = useState<VisitorPing[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const lastSeenTimestamp = useRef<number>(0);
  const initialLoad = useRef(true);

  const fetchVisitors = useCallback(async (since?: number): Promise<VisitorPing[]> => {
    const token = localStorage.getItem("admin_token");
    if (!token) return [];

    try {
      const url = since != null ? `/api/admin/live-visitors?since=${since}` : "/api/admin/live-visitors";
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list: VisitorPing[] = res.data?.visitors ?? [];
      return list;
    } catch (e: any) {
      if (e.response?.status === 401 || e.response?.status === 403) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setNotificationPermission(typeof Notification !== "undefined" ? Notification.permission : "default");

    (async () => {
      const list = await fetchVisitors();
      if (list.length > 0) {
        setVisitors(list);
        lastSeenTimestamp.current = list[0]?.timestamp ?? 0;
      }
      initialLoad.current = false;
    })();
  }, [fetchVisitors, router]);

  useEffect(() => {
    if (loading || initialLoad.current) return;

    const interval = setInterval(async () => {
      const since = lastSeenTimestamp.current;
      const list = await fetchVisitors(since);
      if (list.length === 0) return;

      const newPings = list.filter((p) => p.timestamp > since);
      if (newPings.length > 0) {
        setVisitors((prev) => {
          const merged = [...newPings];
          const seen = new Set(newPings.map((p) => p.id));
          prev.forEach((p) => {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          });
          return merged.sort((a, b) => b.timestamp - a.timestamp);
        });
        const latest = newPings[0];
        lastSeenTimestamp.current = latest.timestamp;

        if (soundEnabled) playAlertSound();
        if (notificationsEnabled && notificationPermission === "granted") {
          showDesktopNotification(
            "New visitor on site",
            `Page: ${latest.path}`
          );
        }
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [loading, soundEnabled, notificationsEnabled, notificationPermission, fetchVisitors]);

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(granted ? "granted" : "denied");
    setNotificationsEnabled(granted);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = Date.now();
    const diff = (now - ts) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return d.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <header className="bg-white border-b border-brand-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-brand-gray-600 hover:text-brand-green">
                ← Dashboard
              </Link>
              <h1 className="font-heading font-bold text-xl text-brand-gray-900">Live Visitors</h1>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-brand-gray-700">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded border-brand-gray-300 text-brand-green focus:ring-brand-green"
                />
                Sound alerts
              </label>
              {notificationPermission === "granted" ? (
                <label className="flex items-center gap-2 text-sm text-brand-gray-700">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="rounded border-brand-gray-300 text-brand-green focus:ring-brand-green"
                  />
                  Desktop notifications
                </label>
              ) : (
                <button
                  type="button"
                  onClick={enableNotifications}
                  className="btn-outline text-sm"
                >
                  Enable desktop notifications
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <p className="text-brand-gray-600">Loading...</p>
        ) : (
          <>
            <p className="text-brand-gray-600 mb-4">
              Recent page views across the site. You get a sound and optional desktop notification when a new visit is detected (polling every {POLL_INTERVAL_MS / 1000}s).
            </p>
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-brand-gray-200">
                <thead className="bg-brand-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase">Page</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase hidden sm:table-cell">Referrer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase hidden md:table-cell">Device</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brand-gray-200">
                  {visitors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-brand-gray-500">
                        No visitor activity yet. Activity will appear when someone browses the site.
                      </td>
                    </tr>
                  ) : (
                    visitors.map((v) => (
                      <tr key={v.id} className="hover:bg-brand-gray-50">
                        <td className="px-4 py-2 text-sm text-brand-gray-600 whitespace-nowrap">
                          {formatTime(v.timestamp)}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-brand-gray-900">{v.path}</td>
                        <td className="px-4 py-2 text-sm text-brand-gray-600 truncate max-w-[200px] hidden sm:table-cell">
                          {v.referrer || "—"}
                        </td>
                        <td className="px-4 py-2 text-sm text-brand-gray-500 truncate max-w-[180px] hidden md:table-cell">
                          {v.userAgent ? (v.userAgent.length > 50 ? v.userAgent.slice(0, 50) + "…" : v.userAgent) : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
