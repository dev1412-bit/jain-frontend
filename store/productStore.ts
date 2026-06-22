import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { toast } from "sonner";

export type PricingPlan = {
  id?: string;
  planName: string;
  price: number;
  originalPrice?: number | null;
  period: string;
  features?: string[];
};

export type ProductSeo = {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
};

export type ProductSettings = {
  licenseKeyFormat?: string;
  downloadableFile?: string;
  subscriptionEnabled: boolean;
};

export type ProductMedia = {
  id: string;
  url: string;
  fileType: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  description?: string;
  features?: string[];
  basePrice: number;
  emiPrice?: number | null;
  status: "draft" | "published" | "archived";
  categoryId: string;
  category?: { id: string; name: string;   slug: string; };
  pricingPlans?: PricingPlan[];
  media?: ProductMedia[];
  seo?: ProductSeo | null;
  settings?: ProductSettings | null;
  createdAt?: string;
};

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
};

export type CreateProductPayload = {
  title: string;
  slug: string;
  description?: string;
  features?: string[];
  base_price: number;
  emi_price?: number | null;
  status: "draft" | "published" | "archived";
  category_id: string;
  pricing_plans?: {
    plan_name: string;
    price: number;
    original_price?: number | null;
    period: string;
    features?: string[];
  }[];
  seo?: {
    meta_title?: string;
    meta_description?: string;
    focus_keyword?: string;
    canonical_url?: string;
  };
  settings?: {
    license_key_format?: string;
    downloadable_file?: string;
    subscription_enabled?: boolean;
  };
};


type ProductStore = {
  // ── Admin ──
  products: Product[];
  featuredProducts: Product[];
  featuredLoading: boolean;
  fetchFeaturedProducts: () => Promise<void>;
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  fetchProducts: (page?: number, search?: string, category?: string, status?: string) => Promise<void>;
  createProduct: (data: CreateProductPayload) => Promise<Product>;
  updateProduct: (id: string, data: Partial<CreateProductPayload>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  uploadMedia: (productId: string, file: File) => Promise<ProductMedia>;
  deleteMedia: (productId: string, mediaId: string) => Promise<void>;

  // ── Store (frontend) ──
  storeProducts: Product[];
  storeLoading: boolean;
  categories: StoreCategory[];
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;
  fetchStoreProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  setSearch: (q: string) => void;
  setCategory: (cat: string) => void;
  setSort: (sort: string) => void;
  filteredProducts: () => Product[];
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      // ── Admin state ──
      products: [],
      loading: false,
      error: null,
      total: 0,
      currentPage: 1,
      featuredProducts: [],
      featuredLoading: false,
      // ── Store state ──
      storeProducts: [],
      storeLoading: false,
      categories: [],
      selectedCategory: "all",
      searchQuery: "",
      sortBy: "default",


      fetchFeaturedProducts: async () => {
        set({ featuredLoading: true });
        try {
          const res = await api.get("/products/featured");
          set({ featuredProducts: res.data.data ?? res.data, featuredLoading: false });
        } catch {
          set({ featuredLoading: false });
        }
      },
 

      // ── Admin actions ──
      fetchProducts: async (page = 1, search = "", category = "", status = "") => {
        set({ loading: true, error: null });
        try {
          const params = new URLSearchParams({ page: String(page) });
          if (search)   params.append("search", search);
          if (category) params.append("category_id", category);
          if (status)   params.append("status", status);
          const res = await api.get(`/products?${params}`);
          set({
            products: res.data.data,
            total: res.data.meta?.total ?? 0,
            currentPage: page,
            loading: false,
          });
        } catch {
          toast.error("Failed to load products");
          set({ loading: false, error: "Failed to load products" });
        }
      },

      createProduct: async (data) => {
        const res = await api.post("/products", data);
        const product = res.data.data ?? res.data;
        set((s) => ({ products: [product, ...s.products] }));
        toast.success("Product created!");
        return product;
      },

      updateProduct: async (id, data) => {
        const res = await api.put(`/products/${id}`, data);
        const updated = res.data.data ?? res.data;
        set((s) => ({ products: s.products.map((p) => p.id === id ? updated : p) }));
        toast.success("Product updated!");
      },

      deleteProduct: async (id) => {
        await api.delete(`/products/${id}`);
        set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
        toast.success("Product deleted");
      },

      uploadMedia: async (productId, file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post(`/products/${productId}/media`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
      },

      deleteMedia: async (productId, mediaId) => {
        await api.delete(`/products/${productId}/media/${mediaId}`);
      },

      // ── Store actions ──
      fetchStoreProducts: async () => {
        set({ storeLoading: true, error: null });
        try {
          // only fetch published products for the store
          const res = await api.get("/products?status=published&per_page=100");
          set({
            storeProducts: res.data.data ?? res.data,
            storeLoading: false,
          });
        } catch {
          set({ storeLoading: false, error: "Failed to load products" });
        }
      },

      fetchCategories: async () => {
        try {
          const res = await api.get("/categories");
          const cats = (res.data.data ?? res.data).map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
          }));
          set({ categories: cats });
        } catch {
          console.error("Failed to load categories");
        }
      },

      setSearch:   (q)    => set({ searchQuery: q }),
      setCategory: (cat)  => set({ selectedCategory: cat }),
      setSort:     (sort) => set({ sortBy: sort }),

      filteredProducts: () => {
        const { storeProducts, searchQuery, selectedCategory, sortBy } = get();
        let result = [...storeProducts];

        // category filter
        if (selectedCategory !== "all") {
          result = result.filter((p) =>
            p.category?.name.toLowerCase().replace(/\s+/g, "-") === selectedCategory ||
            p.category?.name === selectedCategory
          );
        }

        // search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          result = result.filter((p) =>
            p.title.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
          );
        }

        // sort
        switch (sortBy) {
          case "price-asc":
            result.sort((a, b) => a.basePrice - b.basePrice);
            break;
          case "price-desc":
            result.sort((a, b) => b.basePrice - a.basePrice);
            break;
          case "newest":
            result.sort((a, b) =>
              new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
            );
            break;
          default:
            break;
        }

        return result;
      },
    }),
    {
      name: "product-store",
      partialize: (state) => ({
        products: state.products,
        total: state.total,
        currentPage: state.currentPage,
      }),
    }
  )
);
