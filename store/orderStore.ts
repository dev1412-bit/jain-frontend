// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import api from "@/lib/axios";
// import { toast } from "sonner";

// export type OrderBilling = {
//   name: string;
//   email: string;
//   phone?: string | null;
//   company?: string | null;
//   address?: string | null;
//   city?: string | null;
//   state?: string | null;
//   pinCode?: string | null;
//   country?: string | null;
// };

// export type OrderItem = {
//   id: string;
//   product_id: string;
//   product_title: string;
//   product_slug: string;
//   plan_name?: string | null;
//   plan_period?: string | null;
//   quantity: number;
//   unit_price: string;
//   total_price: string;
  
//   // ── Match New Schema Fields ──
//   licenseKey?: string | null;
//   licenseStatus?: 'active' | 'expired' | 'revoked';
//   downloadableFile?: string | null;
//   isSubscription: boolean;
//   subscriptionPeriod?: string | null;
//   expiresAt?: string | null;
//   softwareVersion?: string | null;
// };

// export type OrderLog = {
//   id: string;
//   status: "pending" | "completed" | "refunded" | "failed" | "cancelled";
//   paymentStatus: "pending" | "paid" | "refunded" | "failed";
//   note?: string | null;
//   meta?: any;
//   createdBy?: string | null;
//   createdAt: string; // Formatted 'M j, Y h:i A' from your backend resource
// };

// // Main Order type matching the PHP OrderResource
// export type Order = {
//   id: string;
//   uuid: string;
//   orderId: string; // The formatted string 'ORD-YYYY-001'
//   status: "pending" | "completed" | "refunded" | "failed" | "cancelled";
//   paymentStatus: "pending" | "paid" | "refunded" | "failed";
//   paymentMethod?: string | null;
//   paymentRef?: string | null;
//   billing: OrderBilling;
//   subtotal: string;
//   discount: string;
//   gstAmount: string;
//   total: string;
//   invoiceNumber?: string | null;
//   invoiceUrl?: string | null;
//   notes?: string | null;
//   user?: {
//     id: string;
//     name: string;
//     email: string;
//   };
//   items?: OrderItem[];
//   logs?: OrderLog[];
//   createdAt?: string;
// };

// type OrderStore = {
//   orders: Order[];
//   loading: boolean;
//   total: number;
//   currentPage: number;
//   fetchOrders: (page?: number, search?: string, status?: string) => Promise<void>;
  
//   myOrders: Order[]; // Changed from MyOrder to Order for consistency
//   myOrdersLoading: boolean;
//   myOrdersTotal: number;
//   myOrdersPage: number;
//   fetchMyOrders: (page?: number, search?: string, status?: string, sort?: string) => Promise<void>;

//   refundOrder: (id: string) => Promise<void>;
//   cancelOrder: (id: string) => Promise<void>;
//   placeOrder: (payload: any) => Promise<Order>;
// };

// export const useOrderStore = create<OrderStore>()(
//   persist(
//     (set) => ({
//       orders: [],
//       loading: false,
//       total: 0,
//       currentPage: 1,

//       myOrders: [],
//       myOrdersLoading: false,
//       myOrdersTotal: 0,
//       myOrdersPage: 1,

//       fetchOrders: async (page = 1, search = "", status = "") => {
//         set({ loading: true });
//         try {
//           const params = new URLSearchParams({ page: String(page) });
//           if (search) params.append("search", search);
//           if (status) params.append("status", status);
//           const res = await api.get(`/orders?${params}`);
//           set({
//             orders: res.data.data,
//             total: res.data.meta?.total ?? 0,
//             currentPage: page,
//             loading: false,
//           });
//         } catch {
//           toast.error("Failed to load orders");
//           set({ loading: false });
//         }
//       },

//       fetchMyOrders: async (page = 1, search = "", status = "", sort = "newest") => {
//         set({ myOrdersLoading: true });
//         try {
//           const params = new URLSearchParams({ page: String(page) });
//           if (search) params.append("search", search);
//           if (status) params.append("status", status);
//           if (sort) params.append("sort", sort);

//           const res = await api.get(`/user/orders?${params}`);
//           set({
//             myOrders: res.data.data,
//             myOrdersTotal: res.data.meta?.total ?? 0,
//             myOrdersPage: page,
//             myOrdersLoading: false,
//           });
//         } catch {
//           toast.error("Failed to load orders");
//           set({ myOrdersLoading: false });
//         }
//       },

//       refundOrder: async (id: string) => {
//         try {
//           const res = await api.post(`/orders/${id}/refund`);
//           const updated: Order = res.data.data;
//           set((s) => ({
//             orders: s.orders.map((o) => (o.id === id ? updated : o)),
//             myOrders: s.myOrders.map((o) => (o.id === id ? updated : o)),
//           }));
//           toast.success("Order refunded successfully");
//         } catch {
//           toast.error("Failed to refund order");
//         }
//       },

//       cancelOrder: async (id: string) => {
//         try {
//           const res = await api.post(`/user/orders/${id}/cancel`);
//           const updated: Order = res.data.data;
//           set((s) => ({
//             myOrders: s.myOrders.map((o) => (o.id === id ? updated : o)),
//           }));
//           toast.success(res.data.message ?? "Order cancelled.");
//         } catch (err: any) {
//           toast.error(err?.response?.data?.message || "Failed to cancel order");
//           throw err;
//         }
//       },

//       placeOrder: async (payload) => {
//         const res = await api.post("/checkout", payload);
//         toast.success("Order placed successfully!");
//         return res.data.data;
//       },
//     }),
//     {
//       name: "order-store",
//       partialize: (state) => ({
//         orders: state.orders,
//         total: state.total,
//         currentPage: state.currentPage,
//       }),
//     }
//   )
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { toast } from "sonner";

export type OrderBilling = {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pinCode?: string | null;
  country?: string | null;
};

export type OrderItem = {
  id: string;
  product_id: string;
  product_title: string;
  product_slug: string;
  plan_name?: string | null;
  plan_period?: string | null;
  quantity: number;
  unit_price: string;
  total_price: string;
  licenseKey?: string | null;
  licenseStatus?: 'active' | 'expired' | 'revoked';
  downloadableFile?: string | null;
  isSubscription: boolean;
  subscriptionPeriod?: string | null;
  expiresAt?: string | null;
  softwareVersion?: string | null;
};

export type OrderLog = {
  id: string;
  status: "pending" | "completed" | "refunded" | "failed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  note?: string | null;
  meta?: any;
  createdBy?: string | null;
  createdAt: string; 
};

export type Order = {
  id: string;
  uuid: string;
  orderId: string; 
  status: "pending" | "completed" | "refunded" | "failed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  paymentMethod?: string | null;
  paymentRef?: string | null;
  billing: OrderBilling;
  subtotal: string;
  discount: string;
  gstAmount: string;
  total: string;
  invoiceNumber?: string | null;
  invoiceUrl?: string | null;
  notes?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  items?: OrderItem[];
  logs?: OrderLog[];
  createdAt?: string;
};

type OrderStore = {
  orders: Order[];
  loading: boolean;
  total: number;
  currentPage: number;
  fetchOrders: (page?: number, search?: string, status?: string) => Promise<void>;
  
  myOrders: Order[]; 
  myOrdersLoading: boolean;
  myOrdersTotal: number;
  myOrdersPage: number;
  fetchMyOrders: (page?: number, search?: string, status?: string, sort?: string) => Promise<void>;

  refundOrder: (id: string) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  placeOrder: (payload: any) => Promise<Order>;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      loading: false,
      total: 0,
      currentPage: 1,

      myOrders: [],
      myOrdersLoading: false,
      myOrdersTotal: 0,
      myOrdersPage: 1,

      fetchOrders: async (page = 1, search = "", status = "") => {
        set({ loading: true });
        try {
          const params = new URLSearchParams({ page: String(page) });
          if (search) params.append("search", search);
          if (status) params.append("status", status);
          const res = await api.get(`/orders?${params}`);
          set({
            orders: res.data.data,
            total: res.data.meta?.total ?? 0,
            currentPage: page,
            loading: false,
          });
        } catch {
          toast.error("Failed to load orders");
          set({ loading: false });
        }
      },

      fetchMyOrders: async (page = 1, search = "", status = "", sort = "newest") => {
        set({ myOrdersLoading: true });
        try {
          const params = new URLSearchParams({ page: String(page) });
          if (search) params.append("search", search);
          if (status) params.append("status", status);
          if (sort) params.append("sort", sort);

          const res = await api.get(`/user/orders?${params}`);
          set({
            myOrders: res.data.data,
            myOrdersTotal: res.data.meta?.total ?? 0,
            myOrdersPage: page,
            myOrdersLoading: false,
          });
        } catch {
          toast.error("Failed to load orders");
          set({ myOrdersLoading: false });
        }
      },

      refundOrder: async (id: string) => {
        try {
          const res = await api.post(`/orders/${id}/refund`);
          const updated: Order = res.data.data;
          set((s) => ({
            orders: s.orders.map((o) => (o.id === id ? updated : o)),
            myOrders: s.myOrders.map((o) => (o.id === id ? updated : o)),
          }));
          toast.success("Order refunded successfully");
        } catch {
          toast.error("Failed to refund order");
        }
      },

      cancelOrder: async (id: string) => {
        try {
          const res = await api.post(`/user/orders/${id}/cancel`);
          const updated: Order = res.data.data;
          set((s) => ({
            myOrders: s.myOrders.map((o) => (o.id === id ? updated : o)),
          }));
          toast.success(res.data.message ?? "Order cancelled.");
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Failed to cancel order");
          throw err;
        }
      },

      placeOrder: async (payload) => {
        // Step 1: Fire initialization call to your Laravel backend
        const initRes = await api.post("/checkout", payload);
        const serverData = initRes.data;

        if (!serverData.success || !serverData.gateway) {
          throw new Error(serverData.message || "Failed initialization with gateway parameters.");
        }

        const { gateway, order: internalOrder } = serverData;

        // Step 2: Return a Promise that resolves only when Razorpay completes securely
        return new Promise<Order>((resolve, reject) => {
          const options = {
            key: gateway.key,
            amount: gateway.amount,
            currency: gateway.currency,
            name: gateway.name,
            description: "Purchase Order Settlement",
            order_id: gateway.id,
            prefill: {
              name: gateway.prefill.name,
              email: gateway.prefill.email,
              contact: gateway.prefill.contact,
            },
            theme: { color: "#818cf8" },
            handler: async function (rzpResponse: any) {
              try {
                // Step 3: Call your verification controller method
                const verifyRes = await api.post("/checkout/verify", {
                  internal_order_id: internalOrder.id,
                  razorpay_order_id: rzpResponse.razorpay_order_id,
                  razorpay_payment_id: rzpResponse.razorpay_payment_id,
                  razorpay_signature: rzpResponse.razorpay_signature,
                });

                if (verifyRes.data.success) {
                  const verifiedOrder: Order = verifyRes.data.data;

                  // Add the new valid order dynamically to state memory
                  set((s) => ({
                    orders: [verifiedOrder, ...s.orders],
                    myOrders: [verifiedOrder, ...s.myOrders],
                  }));

                  toast.success("Order placed and verified successfully!");
                  resolve(verifiedOrder);
                } else {
                  toast.error("Payment verification rejected.");
                  reject(new Error("Verification failed"));
                }
              } catch (err: any) {
                const errMsg = err?.response?.data?.message || "Verification endpoint execution failure.";
                toast.error(errMsg);
                reject(new Error(errMsg));
              }
            },
            modal: {
              ondismiss: () => {
                toast.error("Payment process cancelled by user.");
                reject(new Error("Payment cancelled by user"));
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        });
      },
    }),
    {
      name: "order-store",
      partialize: (state) => ({
        orders: state.orders,
        total: state.total,
        currentPage: state.currentPage,
      }),
    }
  )
);