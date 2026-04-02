"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

type DailyRevenue = {
  date: string;
  label: string;
  online: number;
  office: number;
};

const chartConfig = {
  online: {
    label: "Online",
    color: "#3b82f6",
  },
  office: {
    label: "Office",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

export function SalesChart({ data }: { data: DailyRevenue[] }) {
  const hasData = data.some((d) => d.online > 0 || d.office > 0);

  if (!hasData) {
    return (
      <div className="border border-slate-200 rounded-lg p-8 text-center">
        <p className="text-sm text-slate-400">No sales data for the last 14 days</p>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <p className="text-xs text-slate-500 mb-3">Revenue — last 14 days</p>
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <BarChart data={data} barGap={2}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            tick={{ fill: "#94a3b8" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={10}
            tick={{ fill: "#94a3b8" }}
            tickFormatter={(v) => `€${v}`}
            width={45}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <span>€{(value as number).toFixed(2)}</span>
                )}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="online" fill="var(--color-online)" radius={[3, 3, 0, 0]} />
          <Bar dataKey="office" fill="var(--color-office)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
