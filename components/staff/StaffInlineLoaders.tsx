"use client";

export function StaffInlineSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-2 text-sm text-brand-gray-800">
      <span className="h-5 w-5 rounded-full border-2 border-brand-red border-t-transparent animate-spin shrink-0" />
      {label}
    </span>
  );
}

export function StaffTableLoadingRow({
  colSpan = 6,
  label = "Loading…",
}: {
  colSpan?: number;
  label?: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-12">
        <StaffInlineSpinner label={label} />
      </td>
    </tr>
  );
}

export function StaffCardLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="staff-card p-8 flex justify-center">
      <StaffInlineSpinner label={label} />
    </div>
  );
}
