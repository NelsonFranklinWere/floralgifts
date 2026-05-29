"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DashboardChartProps {
  data: { date: string; revenue: number; orders: number }[];
}

export default function DashboardChart({ data }: DashboardChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    window.addEventListener("resize", update, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [mounted]);

  const canRenderChart = useMemo(() => size.width > 10 && size.height > 10, [size.height, size.width]);

  if (!mounted) {
    return <div className="h-80 min-h-[320px] staff-skeleton rounded-lg" />;
  }

  if (!data?.length) {
    return (
      <div className="h-80 min-h-[320px] flex items-center justify-center text-sm text-brand-gray-800">
        No chart data for this period yet.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-80 min-h-[320px] w-full min-w-0">
      {canRenderChart ? (
        <ResponsiveContainer width="100%" height="100%" minHeight={320}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="revenue"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `K${v}`}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                color: "#0f172a",
              }}
              formatter={(value, name) => {
                const v = Number(value ?? 0);
                if (name === "revenue") return [`Ksh ${v.toLocaleString()}`, "Revenue"];
                return [v, "Orders"];
              }}
            />
            <Legend />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              name="Revenue (KES)"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar yAxisId="orders" dataKey="orders" name="Orders" fill="#ec4899" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full w-full staff-skeleton rounded-lg" />
      )}
    </div>
  );
}
