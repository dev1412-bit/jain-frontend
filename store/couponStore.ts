import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

export type Coupon = {
  id: string;
  uuid: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  maxUses: number | null;
  usedCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  status: "active" | "inactive";
  isExpired: boolean;
  createdAt: string;
};

export type CouponStats = {
  activeCoupons: number;
  totalUses: number;
  totalDiscount: number;
  expiringMonth: number;
};

export type CreateCouponPayload = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  usage_limit?: number | null;
  starts_at?: string | null;
  expires_at?: string | null;
  is_active?: boolean;
};

type CouponStore = {
  coupons: Coupon[];
  stats: CouponStats | null;
  loading: boolean;
  total: number;
  currentPage: number;
  fetchCoupons: (page?: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  createCoupon: (data: CreateCouponPayload) => Promise<void>;
  updateCoupon: (id: string, data: Partial<CreateCouponPayload>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  generateCode: () => Promise<string>;
};

export const useCouponStore = create<CouponStore>((set) => ({
  coupons: [],
  stats: null,
  loading: false,
  total: 0,
  currentPage: 1,

  fetchCoupons: async (page = 1) => {
    set({ loading: true });
    try {
      const res = await api.get(`/coupons?page=${page}`);
      set({
        coupons: res.data.data,
        total: res.data.meta?.total ?? res.data.data.length,
        currentPage: page,
        loading: false,
      });
    } catch {
      toast.error("Failed to load coupons");
      set({ loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await api.get("/coupons/stats");
      set({ stats: res.data });
    } catch {
      console.error("Failed to load coupon stats");
    }
  },

  createCoupon: async (data) => {
    try {
      const res = await api.post("/coupons", data);
      const newCoupon = res.data.data ?? res.data;
      set((s) => ({ coupons: [newCoupon, ...s.coupons] }));
      toast.success("Coupon created!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to create coupon";
      toast.error(msg);
      throw err;
    }
  },

  updateCoupon: async (id, data) => {
    try {
      const res = await api.put(`/coupons/${id}`, data);
      const updated = res.data.data ?? res.data;
      set((s) => ({
        coupons: s.coupons.map((c) => (c.id === id ? updated : c)),
      }));
      toast.success("Coupon updated!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update coupon");
      throw err;
    }
  },

  deleteCoupon: async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) }));
      toast.success("Coupon deleted");
    } catch {
      toast.error("Failed to delete coupon");
    }
  },

  generateCode: async () => {
    const res = await api.get("/coupons/generate");
    return res.data.code;
  },
}));