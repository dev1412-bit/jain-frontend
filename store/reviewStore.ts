import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string };
};

export type AdminReview = Review & {
  isApproved: boolean;
  product: { id: string; title: string; slug: string };
};

type ReviewStore = {
  reviews: Review[];
  myReview: Review | null;
  loading: boolean;
  submitting: boolean;
  fetchReviews: (productId: string) => Promise<void>;
  fetchMyReview: (productId: string) => Promise<void>;
  submitReview: (productId: string, data: { rating: number; comment: string }) => Promise<void>;
  updateReview: (reviewId: string, data: { rating: number; comment: string }) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;

  // ── Admin ──
  adminReviews: AdminReview[];
  adminLoading: boolean;
  adminTotal: number;
  fetchAdminReviews: (page?: number, filters?: { status?: string }) => Promise<void>;
  toggleReviewApproval: (reviewId: string) => Promise<void>;
  deleteReviewAdmin: (reviewId: string) => Promise<void>;
};

export const useReviewStore = create<ReviewStore>((set) => ({
  reviews: [],
  myReview: null,
  loading: false,
  submitting: false,
  adminReviews: [],
  adminLoading: false,
  adminTotal: 0,

fetchReviews: async (productId) => {
  set({ loading: true });
  try {
    const res = await api.get(`/products/${productId}/reviews`);
    set({ reviews: res.data.data, loading: false }); // was: res.data.data.data ?? res.data.data
  } catch {
    set({ loading: false });
  }
},

  fetchMyReview: async (productId) => {
    try {
      const res = await api.get(`/products/${productId}/reviews/mine`);
      set({ myReview: res.data.data });
    } catch {
      // not signed in, or no review yet
    }
  },

  submitReview: async (productId, data) => {
    set({ submitting: true });
    try {
      const res = await api.post(`/products/${productId}/reviews`, data);
      set((s) => ({ reviews: [res.data.data, ...s.reviews], myReview: res.data.data, submitting: false }));
      toast.success("Review submitted — thank you!");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to submit review");
      set({ submitting: false });
    }
  },

  updateReview: async (reviewId, data) => {
    set({ submitting: true });
    try {
      const res = await api.put(`/reviews/${reviewId}`, data);
      set((s) => ({
        reviews: s.reviews.map((r) => (r.id === reviewId ? res.data.data : r)),
        myReview: res.data.data,
        submitting: false,
      }));
      toast.success("Review updated");
    } catch {
      toast.error("Failed to update review");
      set({ submitting: false });
    }
  },

  deleteReview: async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      set((s) => ({ reviews: s.reviews.filter((r) => r.id !== reviewId), myReview: null }));
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    }
  },

  
    fetchAdminReviews: async (page = 1, filters = {}) => {
    set({ adminLoading: true });
    try {
        const params = new URLSearchParams({ page: String(page) });
        if (filters.status) params.append("status", filters.status);
        const res = await api.get(`/admin/reviews?${params}`);
        set({
        adminReviews: res.data.data,                              // was: res.data.data.data
        adminTotal: res.data.meta?.total ?? res.data.data.length,  // was: res.data.data.meta?.total ?? res.data.data.data.length
        adminLoading: false,
        });
    } catch {
        toast.error("Failed to load reviews");
        set({ adminLoading: false });
    }
    },

  toggleReviewApproval: async (reviewId) => {
    try {
      const res = await api.patch(`/admin/reviews/${reviewId}/toggle`);
      set((s) => ({
        adminReviews: s.adminReviews.map((r) => (r.id === reviewId ? { ...r, isApproved: res.data.data.isApproved } : r)),
      }));
      toast.success(res.data.message);
    } catch {
      toast.error("Failed to update review status");
    }
  },

  deleteReviewAdmin: async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      set((s) => ({ adminReviews: s.adminReviews.filter((r) => r.id !== reviewId) }));
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    }
  },
}));