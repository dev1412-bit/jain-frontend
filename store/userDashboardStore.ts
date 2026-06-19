import { create } from "zustand";
import api from "@/lib/axios";

export type UserDashStats = {
  totalOrders:     number;
  ordersThisMonth: number;
  activeItems:     number;
  downloads:       number;
  totalSpent:      number;
  spentThisMonth:  number;
};

export type SpendingPoint = {
  month:  string;
  amount: number;
};

export type ActivityItem = {
  type:        string;
  title:       string;
  description: string;
  link:        string;
  time:        string;
};

export type DashRecentOrder = {
  id:      string;
  product: string;
  plan:    string;
  amount:  number;
  status:  string;
  date:    string;
};

type UserDashboardStore = {
  stats:        UserDashStats | null;
  spendingData: SpendingPoint[];
  activity:     ActivityItem[];
  recentOrders: DashRecentOrder[];
  loading:      boolean;
  fetchDashboard: () => Promise<void>;
};

export const useUserDashboardStore = create<UserDashboardStore>((set) => ({
  stats:        null,
  spendingData: [],
  activity:     [],
  recentOrders: [],
  loading:      false,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const [stats, spending, activity, orders] = await Promise.all([
        api.get("/user/dashboard/stats"),
        api.get("/user/dashboard/spending"),
        api.get("/user/dashboard/activity"),
        api.get("/user/dashboard/orders"),
      ]);
      set({
        stats:        stats.data,
        spendingData: spending.data,
        activity:     activity.data,
        recentOrders: orders.data,
        loading:      false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));