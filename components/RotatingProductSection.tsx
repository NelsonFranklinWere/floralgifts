"use client";

import { useEffect, useMemo, useState } from "react";
import ProductSection from "@/components/ProductSection";

type ProductLike = {
  id: string;
  slug: string;
  title: string;
  price: number;
  images: string[];
  short_description?: string;
  category?: string;
};

function shuffle<T,>(arr: T[], seed: number): T[] {
  // Deterministic-ish shuffle so rotation doesn't change every render.
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    // LCG
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function seedFromString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickWindow<T>(arr: T[], start: number, count: number): T[] {
  if (!arr.length || count <= 0) return [];
  const out: T[] = [];
  for (let i = 0; i < count; i++) {
    out.push(arr[(start + i) % arr.length]);
  }
  return out;
}

function uniqueById(items: ProductLike[]): ProductLike[] {
  const seen = new Set<string>();
  const out: ProductLike[] = [];
  for (const it of items) {
    if (!it?.id) continue;
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    out.push(it);
  }
  return out;
}

export default function RotatingProductSection({
  title,
  subtitle,
  bgColor,
  linkHref,
  flowers,
  teddy,
  wines,
  chocolates,
  cakes,
  other = [],
  rotateMs = 60_000,
  count = 8,
}: {
  title: string;
  subtitle?: string;
  bgColor?: string;
  linkHref?: string;
  flowers: ProductLike[];
  teddy: ProductLike[];
  wines: ProductLike[];
  chocolates: ProductLike[];
  cakes: ProductLike[];
  other?: ProductLike[];
  rotateMs?: number;
  count?: number;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), rotateMs);
    return () => window.clearInterval(id);
  }, [rotateMs]);

  const seed = useMemo(() => seedFromString(title), [title]);
  const pools = useMemo(() => {
    const f = shuffle(flowers || [], seed ^ 0x1);
    const t = shuffle(teddy || [], seed ^ 0x2);
    const w = shuffle(wines || [], seed ^ 0x3);
    const c = shuffle(chocolates || [], seed ^ 0x4);
    const k = shuffle(cakes || [], seed ^ 0x5);
    const o = shuffle(other || [], seed ^ 0x6);
    return { f, t, w, c, k, o };
  }, [flowers, teddy, wines, chocolates, cakes, other, seed]);

  const products = useMemo(() => {
    // Ensure required categories are always represented.
    const step = 2; // rotate by 2 each minute so "new" items appear
    const baseStart = tick * step;

    // Start with one from each required category
    const required: ProductLike[] = [
      ...pickWindow(pools.f, baseStart, 1),
      ...pickWindow(pools.t, baseStart, 1),
      ...pickWindow(pools.w, baseStart, 1),
      ...pickWindow(pools.c, baseStart, 1),
    ];

    // Prefer adding cakes once they exist in DB/admin
    const optional: ProductLike[] = [
      ...pickWindow(pools.k, baseStart, pools.k.length > 0 ? 1 : 0),
      ...pickWindow(pools.o, baseStart, 3),
    ];

    let mixed = uniqueById([...required, ...optional]);

    // Fill remaining slots by cycling through all pools, but keep required already present.
    const allPools = [pools.f, pools.t, pools.w, pools.c, pools.k, pools.o].filter((p) => p.length > 0);
    let guard = 0;
    while (mixed.length < count && allPools.length > 0 && guard < 500) {
      const pool = allPools[(baseStart + guard) % allPools.length];
      const candidate = pool[(baseStart + guard) % pool.length] as ProductLike;
      if (candidate?.id && !mixed.some((m) => m.id === candidate.id)) {
        mixed.push(candidate);
      }
      guard++;
    }

    // If still short, repeat from the start so scroll row stays full.
    if (mixed.length > 0 && mixed.length < count) {
      const needed = count - mixed.length;
      for (let i = 0; i < needed; i++) mixed.push(mixed[i % mixed.length]);
    }

    return mixed.slice(0, count);
  }, [tick, pools, count]);

  return (
    <ProductSection
      title={title}
      subtitle={subtitle}
      products={products}
      bgColor={bgColor}
      linkHref={linkHref}
    />
  );
}

