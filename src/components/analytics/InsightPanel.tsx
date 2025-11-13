import { useState } from "react";
import type { AnalyticsData } from "../../types/analytics";

type InsightsPanelProps = {
  data: AnalyticsData;
};

type Insight = {
  id: string;
  title: string;
  body: string;
  tone: "positive" | "neutral" | "warning";
};

export default function InsightsPanel({ data }: InsightsPanelProps) {
  const [insights, setInsights] = useState<Insight[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate an "AI thinking" delay
    setTimeout(() => {
      const newInsights = computeInsights(data);
      setInsights(newInsights);
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            AI-style Insights
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Simple rule-based insights that mimic AI analysis.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md hover:shadow-lg hover:from-indigo-300 hover:to-sky-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          <span className="text-sm">✨</span>
          <span>{isGenerating ? "Analyzing…" : "Generate Insights"}</span>
        </button>

      </div>

      <div className="flex-1">
        {isGenerating && (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="border border-slate-800 rounded-lg p-3 animate-pulse"
              >
                <div className="h-3 w-1/3 bg-slate-800 rounded mb-2" />
                <div className="h-3 w-2/3 bg-slate-800 rounded mb-1" />
                <div className="h-3 w-1/2 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {!isGenerating && insights && insights.length > 0 && (
          <ul className="space-y-2">
            {insights.map((insight) => (
              <li
                key={insight.id}
                className="border border-slate-800 rounded-lg p-3 text-sm"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={
                      insight.tone === "positive"
                        ? "inline-flex h-2 w-2 rounded-full bg-emerald-400"
                        : insight.tone === "warning"
                        ? "inline-flex h-2 w-2 rounded-full bg-amber-400"
                        : "inline-flex h-2 w-2 rounded-full bg-slate-500"
                    }
                  />
                  <p className="font-medium text-slate-100">{insight.title}</p>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {insight.body}
                </p>
              </li>
            ))}
          </ul>
        )}

        {!isGenerating && (!insights || insights.length === 0) && (
          <p className="text-xs text-slate-500">
            Click &quot;Generate Insights&quot; to summarize recent performance.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Very small, rule-based "insights engine".
 * Uses:
 * - series (trend)
 * - byCategory (top category)
 * - kpis (avg order value, volume)
 */
function computeInsights(data: AnalyticsData): Insight[] {
  const insights: Insight[] = [];

  const { kpis, series, byCategory } = data;
  const { totalRevenue, totalAppointments, avgOrderValue } = kpis;

  // 1) Trend insight: compare first and last data point
  if (series.length >= 2) {
    const first = series[0];
    const last = series[series.length - 1];
    const diff = last.revenue - first.revenue;
    const pct =
      first.revenue > 0 ? (diff / first.revenue) * 100 : diff > 0 ? 100 : 0;

    if (Math.abs(pct) >= 5) {
      const up = pct > 0;
      insights.push({
        id: "trend",
        title: up ? "Revenue trending up" : "Revenue trending down",
        tone: up ? "positive" : "warning",
        body: up
          ? `Revenue is up about ${pct.toFixed(
              1
            )}% compared to the start of this period. Consider doubling down on what’s working (e.g., promoting your top services).`
          : `Revenue is down about ${Math.abs(
              pct
            ).toFixed()}% versus the start of this period. It may be worth reviewing pricing, promotions, or client retention strategies.`,
      });
    }
  }

  // 2) Top category insight
  if (byCategory.length > 0) {
    const top = byCategory[0];
    const share =
      totalRevenue > 0 ? (top.revenue / totalRevenue) * 100 : undefined;

    insights.push({
      id: "top-category",
      title: "Top performing category",
      tone: "neutral",
      body:
        share && share >= 20
          ? `${top.category} is your best-performing category and contributes about ${share.toFixed(
              0
            )}% of total revenue. Highlight this category in your marketing or upsell it during appointments.`
          : `${top.category} is currently your best-performing category. You could feature it more prominently in your booking flow or promotions.`,
    });
  }

  // 3) Volume vs value insight
  if (totalAppointments > 0 && totalRevenue > 0) {
    const highAov = avgOrderValue >= 150;
    const lowAov = avgOrderValue <= 40;
    const lowVolume = totalAppointments < 10;
    const highVolume = totalAppointments >= 40;

    if (highAov && lowVolume) {
      insights.push({
        id: "high-value-low-volume",
        title: "High value, low volume",
        tone: "neutral",
        body:
          "Your average order value is high, but you’re seeing relatively few appointments. Consider strategies to increase booking volume, like off-peak discounts or referral incentives.",
      });
    } else if (lowAov && highVolume) {
      insights.push({
        id: "low-value-high-volume",
        title: "High volume, room to increase value",
        tone: "positive",
        body:
          "You have strong booking volume, but a relatively low average order value. You might experiment with add-ons, bundles, or premium services to gently raise revenue per appointment.",
      });
    }
  }

  // 4) Fallback insight if everything else is quiet
  if (insights.length === 0) {
    insights.push({
      id: "baseline",
      title: "Stable performance",
      tone: "neutral",
      body:
        "Performance looks relatively stable for this period. Try adjusting the date range to spot short-term spikes or dips, or segment by category to see where the biggest opportunities are.",
    });
  }

  return insights;
}
