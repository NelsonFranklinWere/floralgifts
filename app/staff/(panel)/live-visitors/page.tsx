"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import { Radio, Volume2, VolumeX, Bell, BellOff } from "lucide-react";

interface VisitorPing {
  id: string;
  path: string;
  referrer: string;
  userAgent: string;
  timestamp: number;
}

interface LiveVisitorResponse {
  visitors: VisitorPing[];
  stats: { activeNow: number; recentTotal: number; uniquePages: number };
}

const POLL_MS = 15_000;

function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    /* autoplay blocked */
  }
}

function formatTime(ts: number) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(ts).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" });
}

function VisitTime({ ts }: { ts: number }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const update = () => setLabel(formatTime(ts));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, [ts]);

  return <span suppressHydrationWarning>{label || "—"}</span>;
}

function shortDevice(ua: string) {
  if (!ua) return "—";
  if (/iPhone|iPad/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Mac/i.test(ua)) return "Mac";
  return ua.length > 40 ? `${ua.slice(0, 40)}…` : ua;
}

export default function StaffLiveVisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorPing[]>([]);
  const [stats, setStats] = useState({ activeNow: 0, recentTotal: 0, uniquePages: 0 });
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const lastSeenTimestamp = useRef(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchVisitors = useCallback(async (since?: number) => {
    const q = since != null ? `?since=${since}` : "";
    const res = await staffFetch<LiveVisitorResponse>(`/api/staff/live-visitors${q}`);
    return res;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchVisitors();
        setVisitors(res.visitors);
        setStats(res.stats);
        if (res.visitors.length > 0) {
          lastSeenTimestamp.current = res.visitors[0].timestamp;
        }
      } catch {
        /* staffFetch handles auth redirect */
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    })();
  }, [fetchVisitors]);

  useEffect(() => {
    if (loading || initialLoad) return;

    const interval = setInterval(async () => {
      try {
        const since = lastSeenTimestamp.current;
        const res = await fetchVisitors(since);
        setStats(res.stats);

        const newPings = res.visitors.filter((p) => p.timestamp > since);
        if (newPings.length === 0) return;

        setVisitors((prev) => {
          const merged = [...newPings];
          const seen = new Set(newPings.map((p) => p.id));
          prev.forEach((p) => {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          });
          return merged.sort((a, b) => b.timestamp - a.timestamp).slice(0, 100);
        });

        const latest = newPings[0];
        lastSeenTimestamp.current = latest.timestamp;

        if (soundEnabled) playAlertSound();
        if (
          notificationsEnabled &&
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
          new Notification("Visitor on Floral Whispers Gifts", {
            body: `Viewing ${latest.path}`,
            icon: "/images/logo/FloralLogo.jpg",
          });
        }
      } catch {
        /* ignore poll errors */
      }
    }, POLL_MS);

    return () => clearInterval(interval);
  }, [loading, soundEnabled, notificationsEnabled, fetchVisitors]);

  const enableNotifications = async () => {
    if (typeof Notification === "undefined") return;
    const p = await Notification.requestPermission();
    setNotificationsEnabled(p === "granted");
  };

  return (
    <div className="space-y-6">
      <StaffPageHeader
        title="Live visits"
        description="See who is browsing the store right now. Updates every 15 seconds."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              className="staff-btn-secondary text-xs"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Sound
            </button>
            {typeof Notification !== "undefined" && Notification.permission === "granted" ? (
              <button
                type="button"
                onClick={() => setNotificationsEnabled((v) => !v)}
                className="staff-btn-secondary text-xs"
              >
                {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                Notify
              </button>
            ) : (
              <button type="button" onClick={enableNotifications} className="staff-btn-secondary text-xs">
                <Bell className="h-4 w-4" />
                Enable notifications
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="staff-card p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-brand-green/10 flex items-center justify-center">
            <Radio className="h-5 w-5 text-brand-green" />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-gray-900">{stats.activeNow}</p>
            <p className="text-xs text-brand-gray-800">Active now (2 min)</p>
          </div>
        </div>
        <div className="staff-card p-5">
          <p className="text-2xl font-bold text-brand-gray-900">{stats.uniquePages}</p>
          <p className="text-xs text-brand-gray-800">Pages viewed (active)</p>
        </div>
        <div className="staff-card p-5">
          <p className="text-2xl font-bold text-brand-gray-900">{stats.recentTotal}</p>
          <p className="text-xs text-brand-gray-800">Visits (last 30 min)</p>
        </div>
      </div>

      <div className="staff-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Page</th>
              <th className="hidden sm:table-cell">Referrer</th>
              <th className="hidden md:table-cell">Device</th>
            </tr>
          </thead>
          <tbody>
            {initialLoad ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-brand-gray-800">
                  Loading visits…
                </td>
              </tr>
            ) : visitors.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-brand-gray-800">
                  No visits yet. Open the shop in another tab to test — activity appears within a few seconds.
                </td>
              </tr>
            ) : (
              visitors.map((v) => (
                <tr key={v.id}>
                  <td className="whitespace-nowrap text-brand-gray-800">
                    <VisitTime ts={v.timestamp} />
                  </td>
                  <td className="font-medium text-brand-gray-900">{v.path}</td>
                  <td className="hidden sm:table-cell truncate max-w-[200px] text-brand-gray-800">
                    {v.referrer || "Direct"}
                  </td>
                  <td className="hidden md:table-cell text-brand-gray-800">{shortDevice(v.userAgent)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
