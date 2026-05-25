"use client";

import { cn } from "@/lib/utils";

interface StaffPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export default function StaffPageHeader({ title, description, actions, className }: StaffPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-gray-900">
          <span className="text-brand-red">{title.split(" ")[0]}</span>
          {title.includes(" ") ? ` ${title.split(" ").slice(1).join(" ")}` : ""}
        </h2>
        {description && <p className="mt-2 text-sm text-brand-gray-800 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
