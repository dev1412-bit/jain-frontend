import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

export type Subscription = {
  id: string;
  productTitle: string;
  productSlug: string;
  planName: string;
  planPeriod: "monthly" | "yearly" | "lifetime";
  subscriptionPeriod: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  licenseKey?: string;
  licenseStatus: "active" | "expired" | "revoked";
  isSubscription: boolean;
  softwareVersion?: string;
  downloadableFile?: string;
  expiresAt?: string;
  expiresAtFormatted?: string;
  renewsIn?: number;       // days until expiry
  isExpiringSoon: boolean;
  order?: { id: string; uuid: string };
  createdAt?: string;
};

export type PaginationMeta = {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
};

type SubscriptionStore = {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;

  // filters
  search: string;
  statusFilter: string;
  sortBy: string;

  fetchSubscriptions: (params?: {
    search?: string;
    status?: string;
    sort?: string;
    page?: number;
  }) => Promise<void>;

  cancelSubscription: (id: string) => Promise<void>;
  renewSubscription:  (id: string) => Promise<void>;

  setSearch:       (q: string) => void;
  setStatusFilter: (s: string) => void;
  setSortBy:       (s: string) => void;
};

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  loading: false,
  error: null,
  pagination: null,
  search: "",
  statusFilter: "",
  sortBy: "latest",

  fetchSubscriptions: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/user/subscriptions", { params });
      const meta = res.data.meta;
      set({
        subscriptions: res.data.data ?? res.data,
        pagination: meta ? {
          currentPage: meta.current_page,
          lastPage:    meta.last_page,
          total:       meta.total,
          perPage:     meta.per_page,
        } : null,
        loading: false,
      });
    } catch {
      set({ error: "Failed to load subscriptions", loading: false });
    }
  },

  cancelSubscription: async (id) => {
    try {
      await api.post(`/user/subscriptions/${id}/cancel`);
      set((s) => ({
        subscriptions: s.subscriptions.map((sub) =>
          sub.id === id ? { ...sub, licenseStatus: "revoked" } : sub
        ),
      }));
      toast.success("Subscription cancelled");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to cancel subscription");
    }
  },

  renewSubscription: async (id) => {
    try {
      const res = await api.post(`/user/subscriptions/${id}/renew`);
      const updated = res.data.data;
      set((s) => ({
        subscriptions: s.subscriptions.map((sub) =>
          sub.id === id ? { ...sub, ...updated } : sub
        ),
      }));
      toast.success("Subscription renewed!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to renew subscription");
    }
  },

  setSearch:       (q) => set({ search: q }),
  setStatusFilter: (s) => set({ statusFilter: s }),
  setSortBy:       (s) => set({ sortBy: s }),
}));