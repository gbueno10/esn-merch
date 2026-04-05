export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-slate-100 mb-4" />
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="h-3.5 bg-slate-100 rounded w-2/3" />
          <div className="h-3.5 bg-slate-100 rounded w-12" />
        </div>
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
  );
}
