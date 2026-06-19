import { create } from "zustand";
import api from "@/lib/axios";

export type Activity = {
  id: string;
  type: string;
  icon: string;
  color: string;
  title: string;
  description?: string;
  link?: string;
  meta?: Record<string, any>;
  createdAt: string;
  createdAtFormatted: string;
  timeAgo: string;
  user?: { id: string; name: string; email: string }; 
};

export type ActivityStats = {
  total: number;
  today: number;
  this_week: number;
  by_type: Record<string, number>;
};

export type Pagination = {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
};

type ActivityStore = {
  // user
  activities: Activity[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;

  // admin
  adminActivities: Activity[];
  adminLoading: boolean;
  adminPagination: Pagination | null;
  stats: ActivityStats | null;

  // filters (shared)
  search: string;
  typeFilter: string;
  groupFilter: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  userSearch: string; // admin only

  // actions
  fetchUserActivity:  (params?: Record<string, any>) => Promise<void>;
  fetchAdminActivity: (params?: Record<string, any>) => Promise<void>;
  fetchStats:         () => Promise<void>;

  setSearch:      (v: string) => void;
  setTypeFilter:  (v: string) => void;
  setGroupFilter: (v: string) => void;
  setDateFrom:    (v: string) => void;
  setDateTo:      (v: string) => void;
  setSortBy:      (v: string) => void;
  setUserSearch:  (v: string) => void;
  resetFilters:   () => void;
};

const mapMeta = (res: any) =>
  res.data.meta
    ? {
        currentPage: res.data.meta.current_page,
        lastPage:    res.data.meta.last_page,
        total:       res.data.meta.total,
        perPage:     res.data.meta.per_page,
      }
    : null;

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities:       [],
  loading:          false,
  error:            null,
  pagination:       null,
  adminActivities:  [],
  adminLoading:     false,
  adminPagination:  null,
  stats:            null,

  search:       "",
  typeFilter:   "",
  groupFilter:  "",
  dateFrom:     "",
  dateTo:       "",
  sortBy:       "latest",
  userSearch:   "",

  // ── User ───────────────────────────────────────────────────
  fetchUserActivity: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { search, typeFilter, groupFilter, dateFrom, dateTo, sortBy } = get();
      const res = await api.get("/user/activity", {
        params: {
          search: search || undefined,
          type:   typeFilter || undefined,
          group:  groupFilter || undefined,
          from:   dateFrom || undefined,
          to:     dateTo || undefined,
          sort:   sortBy,
          ...params,
        },
      });
      set({
        activities: res.data.data ?? res.data,
        pagination: mapMeta(res),
        loading: false,
      });
    } catch {
      set({ error: "Failed to load activity", loading: false });
    }
  },

  // ── Admin ───────────────────────────────────────────────────
  fetchAdminActivity: async (params = {}) => {
    set({ adminLoading: true });
    try {
      const { search, typeFilter, groupFilter, dateFrom, dateTo, sortBy, userSearch } = get();
      const res = await api.get("/admin/activity", {
        params: {
          search:      search || undefined,
          type:        typeFilter || undefined,
          group:       groupFilter || undefined,
          from:        dateFrom || undefined,
          to:          dateTo || undefined,
          sort:        sortBy,
          user_search: userSearch || undefined,
          ...params,
        },
      });
      set({
        adminActivities: res.data.data ?? res.data,
        adminPagination: mapMeta(res),
        adminLoading: false,
      });
    } catch {
      set({ adminLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await api.get("/admin/activity/stats");
      set({ stats: res.data });
    } catch {}
  },

  setSearch:      (v) => set({ search: v }),
  setTypeFilter:  (v) => set({ typeFilter: v }),
  setGroupFilter: (v) => set({ groupFilter: v }),
  setDateFrom:    (v) => set({ dateFrom: v }),
  setDateTo:      (v) => set({ dateTo: v }),
  setSortBy:      (v) => set({ sortBy: v }),
  setUserSearch:  (v) => set({ userSearch: v }),

  resetFilters: () => set({
    search: "", typeFilter: "", groupFilter: "",
    dateFrom: "", dateTo: "", sortBy: "latest", userSearch: "",
  }),
}));