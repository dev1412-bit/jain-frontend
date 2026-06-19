import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
};

type NotificationStore = {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  page: number;
  lastPage: number;

  fetchNotifications: (page?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  addNotification: (n: AppNotification) => void; // for real-time push
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount:   0,
  loading:       false,
  page:          1,
  lastPage:      1,

fetchNotifications: async (page = 1) => {
    set({ loading: true });
    try {
      const res = await api.get(`/notifications?page=${page}`);
      
      // 1. Get the raw array out of Laravel's pagination response
      const rawNotifications = res.data.data.data || []; 
      
      // 2. FIXED: Map and flatten Laravel's nested JSON structure to match your frontend properties
      const formattedNotifications = rawNotifications.map((n: any) => ({
        id: n.id,
        // Extract from the nested data column object cleanly!
        type: n.data?.type ?? 'default',
        title: n.data?.title ?? 'Notification',
        message: n.data?.message ?? '',
        link: n.data?.link ?? '',
        // Convert read_at timestamp into a flat boolean state flag
        read: n.read_at !== null,
        // Map snake_case created_at to camelCase createdAt, formatting it cleanly
        createdAt: n.created_at ? new Date(n.created_at).toLocaleString() : '',
      }));

      const currentPage = res.data.data.current_page || page;
      const lastPageNum = res.data.data.last_page || 1;

      set({
        notifications: page === 1
          ? formattedNotifications
          : [...get().notifications, ...formattedNotifications],
        unreadCount: res.data.unread_count ?? get().unreadCount,
        page: currentPage,
        lastPage: lastPageNum,
        loading: false,
      });
    } catch (error) {
      console.error("Failed fetching notifications:", error);
      set({ loading: false });
    }
  },
  
  fetchUnreadCount: async () => {
    try {
      const res = await api.get("/notifications/unread");
      set({ unreadCount: res.data.count });
    } catch {}
  },

  markRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set((s) => ({
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, s.unreadCount - 1),
      }));
    } catch {}
  },

  markAllRead: async () => {
    try {
      await api.patch("/notifications/read-all");
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch {}
  },

  addNotification: (n) => {
    set((s) => ({
      notifications: [n, ...s.notifications],
      unreadCount:   s.unreadCount + 1,
    }));
  },
}));