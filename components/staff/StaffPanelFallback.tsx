/** Placeholder while StaffShell loads (client-only — avoids hydration + localStorage mismatch). */
export default function StaffPanelFallback() {
  return (
    <div className="staff-app min-h-screen flex flex-col bg-white">
      <div className="h-16 border-b border-brand-gray-200 bg-white shrink-0" />
      <div className="flex-1 bg-[#FAF7F2] p-6 lg:p-8">
        <div className="h-8 w-40 rounded-lg bg-brand-gray-100 animate-pulse mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-white border border-brand-gray-200 animate-pulse" />
          ))}
        </div>
        <div className="h-80 rounded-xl bg-white border border-brand-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
