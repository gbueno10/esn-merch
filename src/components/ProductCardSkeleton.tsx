export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col animate-pulse">
      <div className="aspect-square bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-100 w-3/4 rounded" />
        <div className="h-3 bg-slate-100 w-full rounded" />
        <div className="h-3 bg-slate-100 w-4/5 rounded" />
        <div className="mt-2 h-10 bg-slate-100 w-full rounded-xl" />
      </div>
    </div>
  );
}
