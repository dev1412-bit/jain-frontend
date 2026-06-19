import {create} from "zustand";
import api from "@/lib/axios";
import {toast} from "sonner";
import type {Product} from "./productStore";

type ApiErrorResponse = {
    message?: string;
};

function getErrorMessage(error: unknown, fallback: string) {
    const response = (error as { response?: { data?: ApiErrorResponse; status?: number } }).response;
    return response?.data?.message || fallback;
}

type WishlistStore = {
    items: Product[];
    wishlisted: Record<string, boolean>;
    loading: boolean;
    fetchWishlist: () => Promise<void>;
    toggleWishlist: (productId: string) => Promise<void>;
    isWishlisted: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistStore>((set, get)=>({
    items:[],
    wishlisted: {},
    loading: false,

    fetchWishlist: async () => {
        set({loading: true});
        try{
            const res = await api.get("/wishlist");
            const products: Product[] = res.data.data ?? res.data;
            const map: Record<string, boolean>   ={};
            products.forEach((p) => {map[p.id] = true; });
            set({ items: products, wishlisted: map, loading: false });
        }catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to load wishlist"));
            set({ loading: false });
        }
    },
    toggleWishlist: async (productId) =>{
        const current = get().wishlisted[productId] ?? false;
        set((s) =>({
            wishlisted: { ...s.wishlisted, [productId]: !current },
        }));

    try{
        const res = await api.post(`/wishlist/${productId}`);
        const { wishlisted } = res.data;
        set((s) => ({
            wishlisted: { ...s.wishlisted, [productId]: wishlisted },
            items: wishlisted ? s.items : s.items.filter((p) => p.id !== productId),
        }));
        toast.success(res.data.message);
    }catch(error: unknown){
        set((s) =>({
            wishlisted: { ...s.wishlisted, [productId]: current },
        }));
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 401) {
            toast.error("Please sign in to  add to wishlist");
        } else {
            toast.error(getErrorMessage(error, "Failed to update wishlist"));
        }
    }
    },
    isWishlisted: (productId) => get().wishlisted[productId] ?? false, 
}));
