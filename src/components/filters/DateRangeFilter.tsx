import type { ChangeEvent } from "react";
import type { DateRange } from "../../types/analytics";

type DateRangeFilterProps = {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
};

function formatInputDate(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function parseInputDate(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function DateRangeFilter({
  dateRange,
  onChange,
}: DateRangeFilterProps) {
  const handleFromChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFrom = parseInputDate(e.target.value);
    if (!newFrom) return;

    let { to } = dateRange;
    if (newFrom > to) {
      to = newFrom;
    }

    onChange({ from: newFrom, to });
  };

  const handleToChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTo = parseInputDate(e.target.value);
    if (!newTo) return;

    let { from } = dateRange;
    if (newTo < from) {
      from = newTo;
    }

    onChange({ from, to: newTo });
  };

  const fromValue = formatInputDate(dateRange.from);
  const toValue = formatInputDate(dateRange.to);

const inputClasses =
  "bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-slate-50 text-xs sm:text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 " +
  "placeholder-slate-500 cursor-pointer"

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm">
      <div className="flex items-center gap-1 text-slate-400">
        <span className="text-base">📅</span>
        <span>Date range</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={fromValue}
          onChange={handleFromChange}
          className={inputClasses}
        />
        <span className="text-slate-500 text-xs">to</span>
        <input
          type="date"
          value={toValue}
          onChange={handleToChange}
          className={inputClasses}
        />
      </div>
    </div>
  );
}