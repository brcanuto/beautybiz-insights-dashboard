import { formatCurrency, formatNumber } from "../../lib/format";

type KpiCardProps = {
  label: string;
  value: number | string;
  variant?: "currency" | "number" | "text";
};

export default function KpiCard({ label, value, variant }: KpiCardProps) {
  let displayValue: string;

  if (variant === "text") {
    displayValue = String(value);
  } else if (variant === "currency") {
    displayValue = formatCurrency(Number(value));
  } else {
    displayValue =
      typeof value === "number" ? formatNumber(value) : String(value);
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 transition hover:border-slate-600 hover:-translate-y-0.5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-3xl font-semibold mt-2">{displayValue}</p>
    </div>
  );
}
