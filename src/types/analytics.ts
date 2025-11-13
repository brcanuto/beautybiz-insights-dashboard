
export type Kpis = {
  totalRevenue: number;
  totalAppointments: number;
  avgOrderValue: number;
};

export type RevenuePoint = {
  date: string; // 'YYYY-MM-DD'
  revenue: number;
};

export type CategoryBreakdown = {
  category: string;
  revenue: number;
};

export type AnalyticsData = {
  kpis: Kpis;
  series: RevenuePoint[];
  byCategory: CategoryBreakdown[];
};

export type DateRange = {
  from: Date;
  to: Date;
};
