import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { toast } from "sonner";

export type Customer = {
  id: string;
  uuid: string;
  email: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;
  company?: string | null;
  gstin?: string | null;
  role?: string;
  total_orders: number;
  total_spent: string;
  status: "active" | "suspended" | "blacklisted";
  is_active: boolean;
  is_registered: boolean;
  recent_orders?: RecentOrder[];
  created_at?: string;
  joined_at?: string;
};

export type RecentOrder = {
  id: string;
  uuid: string;
  invoice_number?: string;
  total: string;
  status: string;
  created_at: string;
  items: { product_title: string; plan_name?: string; total_price: string }[];
};

export type CustomerStats = {
  total_users: number;
  total_customers: number;
  active: number;
  suspended: number;
  new_this_month: number;
};

type CustomerStore = {
  customers: Customer[];
  loading: boolean;
  total: number;
  currentPage: number;
  stats: CustomerStats | null;
  selectedCustomer: Customer | null;

  fetchCustomers: (
    page?: number,
    search?: string,
    status?: string,
    type?: string
  ) => Promise<void>;

  fetchCustomer: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  updateStatus: (id: string, status: Customer["status"]) => Promise<void>;
  toggleActive: (uuid: string) => Promise<void>;
};

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers:        [],
      loading:          false,
      total:            0,
      currentPage:      1,
      stats:            null,
      selectedCustomer: null,

      fetchCustomers: async (page = 1, search = "", status = "", type = "") => {
        set({ loading: true });
        try {
          const params = new URLSearchParams({ page: String(page) });
          if (search) params.append("search", search);
          if (status) params.append("status", status);
          if (type)   params.append("type", type);

          const res = await api.get(`/admin/customers?${params}`);
          set({
            customers:   res.data.data,
            total:       res.data.meta?.total ?? 0,
            currentPage: page,
            loading:     false,
          });
        } catch {
          toast.error("Failed to load customers");
          set({ loading: false });
        }
      },

      fetchCustomer: async (id) => {
        try {
          const res = await api.get(`/admin/customers/${id}`);
          set({ selectedCustomer: res.data.data ?? res.data });
        } catch {
          toast.error("Failed to load customer");
        }
      },

      fetchStats: async () => {
        try {
          const res = await api.get("/admin/customers/stats");
          set({ stats: res.data });
        } catch {}
      },

      updateStatus: async (id, status) => {
        try {
          const res = await api.patch(`/admin/customers/${id}/status`, { status });
          const updated: Customer = res.data.data ?? res.data;
          set((s) => ({
            customers: s.customers.map((c) => (c.id === id ? updated : c)),
            selectedCustomer:
              s.selectedCustomer?.id === id ? updated : s.selectedCustomer,
          }));
          toast.success(`Customer ${status === "active" ? "activated" : "suspended"}`);
        } catch {
          toast.error("Failed to update status");
        }
      },


           toggleActive: async (uuid) => {
        // optimistic update
        const prev = get().customers;
        set((s) => ({
          customers: s.customers.map((c) =>
            c.uuid === uuid ? { ...c, is_active: !c.is_active } : c
          ),
        }));

        try {
          const res = await api.post(`/admin/customers/${uuid}/toggle-active`);
          const updated: Customer = res.data.data ?? res.data;
          set((s) => ({
            customers: s.customers.map((c) => (c.uuid === uuid ? updated : c)),
            selectedCustomer:
              s.selectedCustomer?.uuid === uuid ? updated : s.selectedCustomer,
          }));
          toast.success(updated.is_active ? "Customer activated" : "Customer deactivated");
        } catch {
          // rollback on failure
          set({ customers: prev });
          toast.error("Failed to update customer status");
        }
      },
    }),
    {
      name: "customer-store",
      partialize: (state) => ({
        customers:   state.customers,
        total:       state.total,
        currentPage: state.currentPage,
      }),
    }
  )
);