export default function ProductSkeleton() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="aspect-square bg-brand-gray-200 rounded-lg mb-3" />
      <div className="h-5 bg-brand-gray-200 rounded mb-2" />
      <div className="h-4 bg-brand-gray-200 rounded w-2/3 mb-3" />
      <div className="h-6 bg-brand-gray-200 rounded w-1/2 mb-4" />
      <div className="h-10 bg-brand-gray-200 rounded" />
    </div>
  );
}

