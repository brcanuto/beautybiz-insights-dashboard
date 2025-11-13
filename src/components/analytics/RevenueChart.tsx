import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { RevenuePoint } from "../../types/analytics";

type RevenueChartProps = {
  series: RevenuePoint[];
};

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function RevenueChart({ series }: RevenueChartProps) {
  const hasData = series && series.length > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-100">
          Revenue Over Time
        </h3>
        <span className="text-xs text-slate-500">
          Line chart of total revenue per day
        </span>
      </div>

      {!hasData ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
          Not enough data to show a chart.
        </div>
      ) : (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                width={70}
              />
              <Tooltip
                formatter={(value: number | string | (number | string)[]) => {
                    // Recharts allows arrays, but our data is just a single value.
                    const v = Array.isArray(value) ? value[0] : value;

                    return typeof v === "number" ? `$${v.toFixed(2)}` : v;
                }}
                labelClassName="text-xs"
                contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1f2937",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                }}
                />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
