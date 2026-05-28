"use client";

export {
  StaffInlineSpinner,
  StaffTableLoadingRow,
  StaffCardLoading,
} from "./StaffInlineLoaders";

/** @deprecated Prefer inline loaders from StaffInlineLoaders */
export default function StaffLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="h-10 w-10 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
      <p className="text-sm text-brand-gray-800">{label}</p>
    </div>
  );
}
