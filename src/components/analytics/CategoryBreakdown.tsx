import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import type { CategoryBreakdown as CategoryBreakdownType } from "../../types/analytics"

type CategoryBreakdownProps = {
  data: CategoryBreakdownType[]
}

function formatCurrency(value: number) {
  return `$${value.toFixed(0)}`
}

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const hasData = data && data.length > 0

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-100">
          Revenue by Category
        </h3>
        <span className="text-xs text-slate-500">
          Top-performing service categories
        </span>
      </div>

      {!hasData ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
          Not enough data to show categories.
        </div>
      ) : (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                width={60}
              />
              <Tooltip
                cursor={{ 
                  fill: "rgba(79, 70, 229, 0.15)", 
                  radius: 6 }}
                formatter={(value: number | string | (number | string)[]) => {
                    const v = Array.isArray(value) ? value[0] : value

                    return typeof v === "number" ? `$${v.toFixed(0)}` : v
                }}
                labelClassName="text-xs"
                contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1f2937",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                }}
                />
              <Bar 
              dataKey="revenue" 
              fill="#6366f1" 
              radius={[6, 6, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
