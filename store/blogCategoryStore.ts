import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  blogCount: number;
};

type BlogCategoryStore = {
  categories: BlogCategory[];
  loading: boolean;
  error: string | null;

  fetchCategories:      () => Promise<void>;  // public — /blog-categories
  fetchAdminCategories: () => Promise<void>;  // admin   — /admin/blog-categories
  createCategory: (data: { name: string; slug?: string; description?: string }) => Promise<void>;
  updateCategory: (id: string, data: Partial<BlogCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useBlogCategoryStore = create<BlogCategoryStore>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/blog-categories");
      set({ categories: res.data.data ?? res.data, loading: false });
    } catch {
      set({ error: "Failed to load blog categories", loading: false });
    }
  },

  fetchAdminCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/admin/blog-categories");
      set({ categories: res.data.data ?? res.data, loading: false });
    } catch {
      set({ error: "Failed to load blog categories", loading: false });
      toast.error("Failed to load blog categories");
    }
  },

  createCategory: async (data) => {
    try {
      const res = await api.post("/admin/blog-categories", data);
      const newCat = res.data.data ?? res.data;
      set((s) => ({ categories: [...s.categories, newCat] }));
      toast.success("Blog category created!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create category");
      throw err;
    }
  },

  updateCategory: async (id, data) => {
    try {
      const res = await api.put(`/admin/blog-categories/${id}`, data);
      const updated = res.data.data ?? res.data;
      set((s) => ({
        categories: s.categories.map((c) => c.id === id ? updated : c),
      }));
      toast.success("Blog category updated!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update category");
      throw err;
    }
  },

  deleteCategory: async (id) => {
    try {
      await api.delete(`/admin/blog-categories/${id}`);
      set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
      toast.success("Blog category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  },
}));