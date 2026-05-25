"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { staffFetch } from "@/lib/staff-client";
import StaffPageHeader from "@/components/staff/StaffPageHeader";
import StaffCard from "@/components/staff/StaffCard";
import StaffLoading from "@/components/staff/StaffLoading";

export default function ContentPage() {
  const [data, setData] = useState<{
    blogs: { id: string; title: string; slug: string; published: boolean }[];
    heroSlides: { id: string; title: string; position: number }[];
    homepageSections: { id: string; section_key: string; title: string }[];
  } | null>(null);

  useEffect(() => {
    staffFetch<NonNullable<typeof data>>("/api/staff/content").then(setData);
  }, []);

  if (!data) return <StaffLoading label="Loading content..." />;

  return (
    <div className="space-y-6">
      <StaffPageHeader title="Content" description="Blogs, hero banners, and homepage sections." />

      <StaffCard
        title="Blog posts"
        actions={
          <Link href="/admin/blogs" className="staff-btn-secondary text-xs">
            Manage blogs →
          </Link>
        }
      >
        <div className="space-y-2 text-sm">
          {data.blogs.slice(0, 8).map((b) => (
            <div key={b.id} className="flex justify-between gap-2">
              <span className="text-slate-900">{b.title}</span>
              <span className={b.published ? "staff-pill-success" : "staff-pill-neutral"}>
                {b.published ? "Published" : "Draft"}
              </span>
            </div>
          ))}
        </div>
      </StaffCard>

      <StaffCard
        title="Hero banners"
        actions={
          <Link href="/admin/hero-slides" className="staff-btn-secondary text-xs">
            Manage banners →
          </Link>
        }
      >
        <div className="space-y-2 text-sm text-slate-700">
          {data.heroSlides.map((s) => (
            <div key={s.id}>
              {s.title || "Slide"} — position {s.position}
            </div>
          ))}
        </div>
      </StaffCard>

      <StaffCard title="Homepage featured sections">
        <div className="space-y-2 text-sm">
          {data.homepageSections.map((s) => (
            <div key={s.id} className="flex justify-between items-center">
              <span className="text-slate-900">{s.title || s.section_key}</span>
              <span className="text-xs text-slate-400">{s.section_key}</span>
            </div>
          ))}
          <p className="text-xs text-slate-500 pt-2">
            Edit featured product IDs via Settings or extend the homepage_sections API.
          </p>
        </div>
      </StaffCard>
    </div>
  );
}
