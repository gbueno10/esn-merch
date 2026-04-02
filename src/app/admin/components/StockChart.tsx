"use client";

type StockData = {
  name: string;
  variant: string | null;
  stock: number;
};

function getColor(stock: number, maxStock: number) {
  if (stock === 0) return "bg-red-100 text-red-700";
  if (stock <= 5) return "bg-amber-100 text-amber-700";
  const ratio = stock / maxStock;
  if (ratio > 0.6) return "bg-blue-100 text-blue-700";
  return "bg-blue-50 text-blue-600";
}

type GroupedProduct = {
  name: string;
  variants: { label: string; stock: number }[];
};

function groupByProduct(data: StockData[]): GroupedProduct[] {
  const map = new Map<string, { label: string; stock: number }[]>();
  for (const d of data) {
    const variants = map.get(d.name) ?? [];
    variants.push({ label: d.variant ?? "—", stock: d.stock });
    map.set(d.name, variants);
  }
  return Array.from(map.entries()).map(([name, variants]) => ({ name, variants }));
}

export function StockChart({ data }: { data: StockData[] }) {
  const groups = groupByProduct(data);
  const maxStock = Math.max(...data.map((d) => d.stock), 1);

  // Check if any product has variants
  const hasVariants = data.some((d) => d.variant !== null);

  if (!hasVariants) {
    // Simple single-row view for products without variants
    return (
      <div className="border border-slate-200 rounded-lg p-4">
        <p className="text-xs text-slate-500 mb-3">Stock overview</p>
        <div className="flex flex-wrap gap-2">
          {groups.map((g) => {
            const stock = g.variants[0].stock;
            return (
              <div
                key={g.name}
                className={`px-3 py-2 rounded-lg text-center min-w-[80px] ${getColor(stock, maxStock)}`}
              >
                <p className="text-xs font-medium truncate">{g.name}</p>
                <p className="text-lg font-bold tabular-nums">{stock}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Collect all unique variant labels in order
  const allLabels: string[] = [];
  for (const g of groups) {
    for (const v of g.variants) {
      if (!allLabels.includes(v.label)) allLabels.push(v.label);
    }
  }

  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <p className="text-xs text-slate-500 mb-3">Stock overview</p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-slate-400 pb-2 pr-3 min-w-[120px]" />
              {allLabels.map((label) => (
                <th key={label} className="text-center text-xs font-medium text-slate-400 pb-2 px-1 min-w-[48px]">
                  {label}
                </th>
              ))}
              <th className="text-center text-xs font-medium text-slate-400 pb-2 px-1 pl-3 min-w-[48px]">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const stockMap = new Map(g.variants.map((v) => [v.label, v.stock]));
              const total = g.variants.reduce((s, v) => s + v.stock, 0);

              return (
                <tr key={g.name}>
                  <td className="text-xs font-medium text-slate-700 py-1 pr-3 whitespace-nowrap">
                    {g.name}
                  </td>
                  {allLabels.map((label) => {
                    const stock = stockMap.get(label);
                    if (stock === undefined) {
                      return (
                        <td key={label} className="p-1 text-center">
                          <div className="rounded bg-slate-50 text-slate-300 text-xs py-1.5">—</div>
                        </td>
                      );
                    }
                    return (
                      <td key={label} className="p-1 text-center">
                        <div className={`rounded text-xs font-semibold py-1.5 tabular-nums ${getColor(stock, maxStock)}`}>
                          {stock}
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-1 pl-3 text-center">
                    <div className="text-xs font-bold text-slate-900 py-1.5 tabular-nums">
                      {total}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-100" />
          <span className="text-[10px] text-slate-400">Out of stock</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-100" />
          <span className="text-[10px] text-slate-400">Low (1-5)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-100" />
          <span className="text-[10px] text-slate-400">OK</span>
        </div>
      </div>
    </div>
  );
}
