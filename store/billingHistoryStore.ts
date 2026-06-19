import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

export type BillingRecord = {
  id: string;
  orderId: string;
  invoiceNumber: string;
  invoiceUrl: string | null;
  subtotal: number;
  discount: number;
  gstAmount: number;
  total: number;
  paymentMethod: string | null;
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  status: string;
  product: string;
  plan: string;
  createdAt: string;
};

type BillingHistoryStore = {
  records:     BillingRecord[];
  loading:     boolean;
  total:       number;
  currentPage: number;
  lastPage:    number;
  fetchBillingHistory: (page?: number) => Promise<void>;
};

export const useBillingHistoryStore = create<BillingHistoryStore>((set) => ({
  records:     [],
  loading:     false,
  total:       0,
  currentPage: 1,
  lastPage:    1,

  fetchBillingHistory: async (page = 1) => {
    set({ loading: true });
    try {
      const res = await api.get(`/user/billing-history?page=${page}`);
      set({
        records:     res.data.data,
        total:       res.data.meta?.total       ?? 0,
        currentPage: res.data.meta?.current_page ?? 1,
        lastPage:    res.data.meta?.last_page    ?? 1,
        loading:     false,
      });
    } catch {
      toast.error("Failed to load billing history");
      set({ loading: false });
    }
  },
}));