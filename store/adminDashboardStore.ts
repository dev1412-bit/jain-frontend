import { create } from "zustand";
import api from "@/lib/axios";

export type StatPeriod = "week" | "month" | "year";
export type AnalyticsPeriod = "1m" | "3m" | "6m" | "1y";

export type DashboardStats = {
  totalRevenue:   number;
  totalOrders:    number;
  activeUsers:    number;
  totalProducts:  number;
  revenueGrowth:  number;
  ordersGrowth:   number;
  usersGrowth:    number;
  productsGrowth: number;
};

export type RevenuePoint = {
  month:   string;
  revenue: number;
};

// 👇 new types for analytics
export type RevenueTrendPoint = {
  month:   string;
  revenue: number;
  orders:  number;
};

export type TrafficSource = {
  name:  string;
  value: number;
  color: string;
};

export type ConversionPoint = {
  month: string;
  rate:  number;
};

export type DeviceStat = {
  device: string;
  value:  number;
};

export type MonthlyPerformance = {
  month:          string;
  visitors:       number;
  orders:         number;
  revenue:        number;
  conversionRate: number;
};

export type CategoryStat = {
  name:  string;
  value: number;
  color: string;
};

type DashboardStore = {
  // existing
  stats:        DashboardStats | null;
  revenueData:  RevenuePoint[];
  categoryData: CategoryStat[];
  loading:      boolean;
  period:       StatPeriod;
  setPeriod:    (p: StatPeriod) => void;
  fetchStats:   () => Promise<void>;
  fetchRevenue: (period?: StatPeriod) => Promise<void>;
  fetchCategories: () => Promise<void>;

  // 👇 analytics
  analyticsPeriod:      AnalyticsPeriod;
  revenueTrend:         RevenueTrendPoint[];
  trafficSources:       TrafficSource[];
  conversionData:       ConversionPoint[];
  deviceStats:          DeviceStat[];
  monthlyPerformance:   MonthlyPerformance[];
  analyticsLoading:     boolean;
  setAnalyticsPeriod:   (p: AnalyticsPeriod) => void;
  fetchAnalytics:       (period?: AnalyticsPeriod) => Promise<void>;
};

const CATEGORY_COLORS = [
  "#d4006e", "#7c3aed", "#0ea5e9",
  "#f59e0b", "#10b981", "#6366f1",
];

const TRAFFIC_COLORS = [
  "#d4006e", "#7c3aed", "#0ea5e9", "#f59e0b", "#10b981",
];

export const useAdminDashboardStore = create<DashboardStore>((set, get) => ({
  // ── existing state ──
  stats:        null,
  revenueData:  [],
  categoryData: [],
  loading:      false,
  period:       "month",

  // ── analytics state ──
  analyticsPeriod:    "3m",
  revenueTrend:       [],
  trafficSources:     [],
  conversionData:     [],
  deviceStats:        [],
  monthlyPerformance: [],
  analyticsLoading:   false,

  // ── existing actions ──
  setPeriod: (p) => {
    set({ period: p });
    get().fetchRevenue(p);
  },

  fetchStats: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/admin/dashboard/stats");
      set({ stats: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchRevenue: async (period) => {
    try {
      const p = period ?? get().period;
      const res = await api.get(`/admin/dashboard/revenue?period=${p}`);
      set({ revenueData: res.data });
    } catch {}
  },

  fetchCategories: async () => {
    try {
      const res = await api.get("/admin/dashboard/categories");
      const data = res.data.map((item: any, i: number) => ({
        ...item,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }));
      set({ categoryData: data });
    } catch {}
  },

  // ── analytics actions ──
  setAnalyticsPeriod: (p) => {
    set({ analyticsPeriod: p });
    get().fetchAnalytics(p);
  },

  fetchAnalytics: async (period) => {
    set({ analyticsLoading: true });
    try {
      const p = period ?? get().analyticsPeriod;
      const res = await api.get(`/admin/analytics?period=${p}`);

      set({
        revenueTrend: res.data.revenueTrend,
        trafficSources: res.data.trafficSources.map((t: any, i: number) => ({
          ...t,
          color: TRAFFIC_COLORS[i % TRAFFIC_COLORS.length],
        })),
        conversionData:     res.data.conversionData,
        deviceStats:        res.data.deviceStats,
        monthlyPerformance: res.data.monthlyPerformance,
        analyticsLoading:   false,
      });
    } catch {
      set({ analyticsLoading: false });
    }
  },
}));