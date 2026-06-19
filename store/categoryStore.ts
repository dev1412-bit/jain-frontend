import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  banner?: string;
  productCount: number;
  status: "active" | "inactive";
};

type CategoryStore = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (data: FormData) => Promise<void>;        
  updateCategory: (id: string, data: FormData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/categories");
      set({ categories: res.data.data ?? res.data, loading: false });
    } catch {
      set({ error: "Failed to load categories", loading: false });
      toast.error("Failed to load categories");
    }
  },

  createCategory: async (data) => {
    try {
      const res = await api.post("/categories", data, {
         headers: { "Content-Type": "multipart/form-data"} 
      });
      const newCat = res.data.data ?? res.data;
      set((s) => ({ categories: [...s.categories, newCat] }));
      toast.success("Category created successfully!");
    }  catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to create category";
      toast.error(msg);
      throw err; 
    }
  },

  updateCategory: async (id, data) => {
    try {
      data.append("_method", "PUT");
      const res = await api.post(`/categories/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
      const updated = res.data.data ?? res.data;
      set((s) => ({
        categories: s.categories.map((c) => c.id === id ? updated : c),
      }));
      toast.success("Category updated!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update category";
      toast.error(msg);
      throw err;
    }
  },
  deleteCategory: async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      set((s) => ({
        categories: s.categories.filter((c) => c.id !== id),
      }));
      toast.success("Category deleted");
    }  catch (err: any) {
        toast.error("Failed to  delete category")
    }
  },
}));




// Mock data — replaced by real API
// const MOCK: Category[] = [
//   { id: "1", name: "SaaS",              slug: "/saas",             productCount: 9, status: "active" },
//   { id: "2", name: "JS Premium",        slug: "/js-premium",       productCount: 6, status: "active" },
//   { id: "3", name: "Custom Development",slug: "/custom-development",productCount: 3, status: "active" },
//   { id: "4", name: "Maintenance",       slug: "/maintenance",      productCount: 1, status: "active" },
//   { id: "5", name: "APIs",              slug: "/apis",             productCount: 3, status: "active" },
//   { id: "6", name: "Third Party",       slug: "/third-party",      productCount: 3, status: "active" },
// ];