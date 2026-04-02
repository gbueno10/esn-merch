export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col animate-pulse">
      <div className="aspect-square bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-2.5 bg-slate-200 w-12 rounded" />
        <div className="space-y-1.5">
          <div className="h-4 bg-slate-200 w-3/4 rounded" />
          <div className="h-4 bg-slate-200 w-1/2 rounded" />
        </div>
        <div className="h-3 bg-slate-200 w-full rounded" />
        <div className="h-3 bg-slate-200 w-4/5 rounded" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 bg-slate-200 w-20 rounded" />
          <div className="h-8 bg-slate-200 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
