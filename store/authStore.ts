import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

export type Role = "guest" | "user" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role
};

type AuthStore = {
  user: AuthUser | null;
  role: Role;
  setAuth: (user: AuthUser, role: Role) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      role: "guest",

      setAuth: (user, role) => {
        set({ user, role });
        document.cookie = `role=${role}; path=/; max-age=604800; SameSite=Lax`;
      },

      clearAuth: () => {
        set({ user: null, role: "guest" });
        document.cookie = "role=; path=/; max-age=0";
      },

      logout: async () => {
        try {
          await api.post("/logout");
        } catch {}
      const { useCartStore } = await import("@/store/cartStore");
        useCartStore.getState().setLoggedIn(false);
        await useCartStore.getState().clearCart();
        useAuthStore.getState().clearAuth();
      },
    }),
    { name: "auth-storage" }
  )
);
