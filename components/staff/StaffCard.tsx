"use client";

import { cn } from "@/lib/utils";

interface StaffCardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export default function StaffCard({
  title,
  children,
  actions,
  className,
  bodyClassName,
  noPadding,
}: StaffCardProps) {
  return (
    <div className={cn("staff-card", className)}>
      {title && (
        <div className="staff-card-header">
          <h3>{title}</h3>
          {actions}
        </div>
      )}
      <div className={cn(!noPadding && "staff-card-body", bodyClassName)}>{children}</div>
    </div>
  );
}
