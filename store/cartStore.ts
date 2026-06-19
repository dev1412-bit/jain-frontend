import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  couponType: "percentage" | "fixed" | null;
  isLoggedIn: boolean;

  // actions
  setLoggedIn: (v: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  subtotal: () => number;
  discountAmount: () => number;
  total: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:          [],
      couponCode:     null,
      couponDiscount: 0,
      couponType:     null,
      isLoggedIn:     false,

      setLoggedIn: (v) => set({ isLoggedIn: v }),

      // ── fetch cart from backend (logged in) ──
      fetchCart: async () => {
        if (!get().isLoggedIn) return;
        try {
          const res = await api.get("/cart");
          set({ items: res.data });
        } catch {}
      },

      // ── merge guest localStorage cart into DB after login ──
      mergeGuestCart: async () => {
        const localItems = get().items;
        if (localItems.length === 0) {
          await get().fetchCart();
          return;
        }
        try {
          const res = await api.post("/cart/merge", { items: localItems });
          set({ items: res.data }); // merged result from backend
          toast.success("Your cart has been saved");
        } catch {
          await get().fetchCart();
        }
      },

      // ── add item ──
      addItem: async (item) => {
        const { isLoggedIn } = get();

        // optimistic update
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...s.items, { ...item, quantity: 1 }] };
        });

        if (isLoggedIn) {
          try {
            await api.post("/cart", item);
          } catch {
            // revert on failure
            set((s) => ({ items: s.items.filter((i) => i.id !== item.id) }));
            toast.error("Failed to add to cart");
          }
        }

        toast.success("Added to cart!");
      },

      // ── remove item ──
      removeItem: async (id) => {
        const { isLoggedIn, items } = get();
        const prev = items;

        set((s) => ({ items: s.items.filter((i) => i.id !== id) }));

        if (isLoggedIn) {
          try {
            await api.delete(`/cart/${id}`);
          } catch {
            set({ items: prev });
          }
        }
      },

      // ── update quantity ──
      updateQuantity: async (id, quantity) => {
        const { isLoggedIn } = get();

        set((s) => ({
          items: s.items.map((i) => i.id === id ? { ...i, quantity } : i),
        }));

        if (isLoggedIn) {
          try {
            await api.put(`/cart/${id}`, { quantity });
          } catch {}
        }
      },

      // ── clear cart ──
      clearCart: async () => {
        const { isLoggedIn } = get();
        set({ items: [], couponCode: null, couponDiscount: 0, couponType: null });
        if (isLoggedIn) {
          try {
            await api.delete("/cart");
          } catch {}
        }
      },

      // ── coupon ──
      applyCoupon: async (code) => {
        try {
          const res = await api.post("/coupons/validate", { code });
          const coupon = res.data;
          set({
            couponCode:     coupon.code,
            couponDiscount: coupon.value,
            couponType:     coupon.type,
          });
          toast.success(
            `Coupon applied! ${coupon.type === "percentage"
              ? coupon.value + "% off"
              : "₹" + coupon.value + " off"
            }`
          );
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Invalid coupon code");
        }
      },

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0, couponType: null }),

      // ── computed ──
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      discountAmount: () => {
        const { couponDiscount, couponType } = get();
        const sub = get().subtotal();
        if (!couponDiscount) return 0;
        if (couponType === "percentage")
          return Math.round((sub * couponDiscount) / 100);
        return couponDiscount;
      },

      total: () => {
        const sub  = get().subtotal();
        const disc = get().discountAmount();
        const gst  = Math.round((sub - disc) * 0.18);
        return sub - disc + gst;
      },
    }),
    {
      name: "cart-storage",
      // only persist local items and coupon — not isLoggedIn
      partialize: (state) => ({
        items:          state.items,
        couponCode:     state.couponCode,
        couponDiscount: state.couponDiscount,
        couponType:     state.couponType,
      }),
    }
  )
);