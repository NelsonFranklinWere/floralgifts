/**
 * Placeholder matching product grid layout — reduces CLS while deferred sections load.
 */
export default function ProductSectionSkeleton() {
  return (
    <section className="py-8" aria-hidden="true">
      <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6 mx-4 sm:mx-6 lg:mx-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-4 sm:px-6 lg:px-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-6 bg-gray-100 rounded animate-pulse mt-3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
