import { useState } from "react"
import { useAnalyticsData } from "../hooks/useAnalyticsData"
import type { DateRange } from "../types/analytics"

import DateRangeFilter from "../components/filters/DateRangeFilter"
import RevenueChart from "../components/analytics/RevenueChart"
import CategoryBreakdown from "../components/analytics/CategoryBreakdown"
import InsightsPanel from "../components/analytics/InsightPanel"
import KpiCard from "../components/analytics/KpiCard"
import Skeleton from "../components/ui/Skeleten"
import ErrorState from "../components/ui/ErrorState"

function getInitialDateRange(): DateRange {
  // Fake Store API only has Data from mid 2020 and sooner
  const from = new Date("2019-01-01")
  const to = new Date("2022-12-31")
  return { from, to }
}
export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>(() => getInitialDateRange())
  const { data, loading, error, refetch } = useAnalyticsData(dateRange)


  // LOADING STATE

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Business Performance</h2>
          <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />
        </div>



        <p className="text-slate-400 text-sm">Loading analytics…</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <Skeleton className="h-4 w-1/3 mb-3" />
              <Skeleton className="h-8 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ERROR STATE

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Business Performance</h2>
          <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />
        </div>
          <p className="text-xs text-slate-500 mt-1">
            This dashboard uses the <a className="text-indigo-400 underline" href="https://fakestoreapi.com/docs" target="_blank" rel="noreferrer">Fake Store API</a>.
            Their historical order data is mostly from early–mid&nbsp2020. 
            Some date ranges may not display results because the API does not contain newer data.
          </p>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    )
  }

  // SAFE DATA ACCESS
  const { kpis } = data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold tracking-tight">Business Performance</h2>
        <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />
      </div>
          <p className="text-xs text-slate-500 mt-1">
            This dashboard uses the <a className="text-indigo-400 underline" href="https://fakestoreapi.com/docs" target="_blank" rel="noreferrer">Fake Store API</a>.
            Their historical order data is mostly from early–mid&nbsp2020. 
            Some date ranges may not display results because the API does not contain newer data.
          </p>
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Revenue" value={kpis.totalRevenue} variant="currency" />
        <KpiCard label="Appointments" value={kpis.totalAppointments} variant="number" />
        <KpiCard label="Avg Order Value" value={kpis.avgOrderValue} variant="currency" />
        <KpiCard
          label="Top Category"
          value={data.byCategory[0]?.category ?? "—"}
          variant="text"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <RevenueChart series={data.series} />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <CategoryBreakdown data={data.byCategory} />
        </div>
      </div>

      {/* AI Insights */}
      <div className="lg:col-span-2">
        <InsightsPanel data={data} />
      </div>  
    </div>
  )
}
